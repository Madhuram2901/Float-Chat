from fastapi import FastAPI
from pydantic import BaseModel
import mysql.connector
import json
import re
import ollama
from dotenv import load_dotenv
import os
import json5  # pip install json5

# ------------------------------
# Load environment variables
# ------------------------------
load_dotenv()

# ------------------------------
# FastAPI app
# ------------------------------
app = FastAPI(title="Float-Chat Local API - Generalized Comparison")

# ------------------------------
# MySQL Database Config
# ------------------------------
DB_CONFIG = {
    "host": os.getenv("MYSQL_HOST", "localhost"),
    "user": os.getenv("MYSQL_USER", "root"),
    "password": os.getenv("MYSQL_PASSWORD", ""),
    "database": os.getenv("MYSQL_DB", "float_chat_db")
}

# ------------------------------
# Input model
# ------------------------------
class QuestionRequest(BaseModel):
    question: str

# ------------------------------
# Ollama model wrapper
# ------------------------------
def ask_model(prompt: str, model: str = "mistral:latest"):
    response = ollama.chat(
        model=model,
        messages=[{"role": "user", "content": prompt}]
    )
    return response["message"]["content"].strip()

# ------------------------------
# Safe JSON parse helper (with json5 fallback)
# ------------------------------
def safe_json_parse(text: str):
    cleaned = re.sub(r"//.*", "", text)  # remove inline comments
    try:
        return json.loads(cleaned)
    except Exception:
        try:
            return json5.loads(cleaned)
        except Exception:
            return None

# ------------------------------
# Run SQL query with CSV parsing and date normalization
# ------------------------------
def run_sql_query(query: str):
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        # Parse CSV strings into lists and normalize dates
        for row in rows:
            for key in ["pres", "temp"]:  # only existing columns
                if key in row and isinstance(row[key], str):
                    try:
                        row[key] = [float(x) for x in row[key].split(",")]
                    except Exception:
                        pass
            for key, val in row.items():
                if hasattr(val, "isoformat"):  # handle date/datetime
                    row[key] = val.isoformat()

        return {"data": rows, "source": "mysql"}
    except Exception as e:
        print("❌ SQL Error:", e)
        # Return explicit error instead of silent fallback
        return {
            "data": [
                {
                    "platform_number": 2901300,
                    "profile_date": "mock_date",
                    "pres": [4.1, 10.2, 15.2, 20.4, 25.3],
                    "temp": [11.549, 11.545, 11.539, 11.528, 11.443]
                }
            ],
            "source": "mock",
            "error": str(e)
        }

# ------------------------------
# API Endpoint
# ------------------------------
@app.post("/ask")
async def ask_question(request: QuestionRequest):
    user_question = request.question

    # 1️⃣ Extract flexible filters
    extract_prompt = f"""
Return ONLY valid JSON. No comments or extra text.

Keys:
- filters: object where keys are column names (platform_number, date, parameter, region, etc.) and values are lists
- compare_by: list of strings indicating which factors are being compared

Example:
{{
  "filters": {{
    "platform_number": [2901300, 2901400],
    "date": ["2011-02-15"]
  }},
  "compare_by": ["platform_number"]
}}

Question: "{user_question}"
"""
    param_text = ask_model(extract_prompt, model="mistral:latest")
    params = safe_json_parse(param_text)

    if not params:
        return {"error": "Failed to parse model output", "raw": param_text}

    filters = params.get("filters", {})
    compare_by = params.get("compare_by", [])

    # 2️⃣ Build SQL dynamically
    conditions = []
    for key, values in filters.items():
        if key == "date":
            or_clause = " OR ".join([f"DATE(profile_date) = '{v}'" for v in values])
            conditions.append(f"({or_clause})")
        elif isinstance(values, list):
            value_list = ",".join([f"'{v}'" if isinstance(v, str) else str(v) for v in values])
            conditions.append(f"{key} IN ({value_list})")
        else:
            conditions.append(f"{key} = '{values}'")

    where_clause = " AND ".join(conditions) if conditions else "1=1"

    # ✅ Only select columns that exist
    sql_query = f"""
    SELECT platform_number, pres, temp, DATE(profile_date) as profile_date
    FROM argo_profiles
    WHERE {where_clause};
    """

    # 3️⃣ Run SQL
    sql_result = run_sql_query(sql_query)
    sample_output = sql_result["data"][:50]

    # 4️⃣ Summarize results
    explain_prompt = f"""
You are an oceanography chatbot.
Summarize the data in natural language in max 3 sentences.
Comparison factors: {compare_by}.
If multiple buoys, compare across buoys.
If multiple dates, compare across dates.
If multiple parameters, compare across parameters.
Always focus on surface vs deepest values or key differences.
Do not use line breaks in the answer.

Data:
{json.dumps(sample_output, indent=2)}
"""
    explanation = ask_model(explain_prompt, model="mistral:latest")

    # Clean: remove any stray newlines
    explanation = " ".join(explanation.split())

    return {
        "answer": explanation,
        "sql_query": sql_query.strip(),
        "filters": filters,
        "compare_by": compare_by,
        "data_preview": sample_output,
        "data_source": sql_result["source"],
        "db_error": sql_result.get("error")
    }
