# 🌊 FLOAT-Chat

FLOAT-Chat is an interactive ocean data visualization web application designed to display buoy (float) data such as **pressure, temperature, and salinity** in a clean and intuitive interface.  
The project focuses on making oceanographic data easy to explore through charts, metadata panels, and region-based insights.

---

## 🚀 Features

- 📊 **Interactive Buoy Data Dashboard**
  - Line chart visualization for buoy parameters over time
  - Smooth and responsive charts using Recharts

- 🔄 **Parameter Selection**
  - Switch between Pressure, Temperature, and Salinity
  - Easily extendable for real-time API data

- 🧭 **Buoy Metadata Panel**
  - Buoy ID
  - Latitude & Longitude
  - Clean card-based layout

- 🌍 **Region Overview**
  - Active floats count
  - Average temperature
  - Last updated information

- 🎨 **Modern UI**
  - Tailwind CSS styling
  - Responsive design
  - Minimal and professional layout

---

## 🛠 Tech Stack

- **React**
- **Next.js (Client Components)**
- **Tailwind CSS**
- **Recharts** – Data visualization
- **Lucide React** – Icons
- **ShadCN/UI Components**

---

## 📁 Project Structure

src/
├── components/
│ ├── Home/
│ │ ├── buoy-data-dashboard.jsx
│ │ ├── SearchBar.jsx
│ │ └── Video.jsx
│ └── ui/
│ ├── card.jsx
│ └── button.jsx
├── pages/
│ └── Home.jsx
└── styles/


---

## 📊 Buoy Data Dashboard

The **BuoyDataDashboard** component:
- Displays time-series buoy data using a line chart
- Allows parameter selection via dropdown
- Shows metadata such as buoy ID and coordinates

Currently, sample data is used for visualization, but the structure supports:
- Live sensor data
- REST API integration
- Oceanographic datasets (ARGO / NOAA / INCOIS)

---

## ▶️ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/FLOAT-Chat.git
cd FLOAT-Chat

2️⃣ Install Dependencies
npm install

3️⃣ Run the Development Server
npm run dev


Open your browser and visit:

http://localhost:3000

🔮 Future Enhancements

🌊 Real-time buoy data integration

🗺️ Interactive map-based float tracking

🤖 AI-powered chat for buoy insights

📈 Multi-parameter comparison charts

🔐 Authentication and saved dashboards

🤝 Contributing

Contributions are welcome!

Fork the repository

Create a new branch (feature/your-feature)

Commit your changes

Open a Pull Request

📜 License

This project is licensed under the MIT License.

✨ Author

Madhu
B.Tech CSE (AI & ML)
Exploring AI, data visualization, and modern web development 🚀
