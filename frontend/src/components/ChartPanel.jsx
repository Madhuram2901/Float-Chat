// src/components/ChartPanel.jsx
import { useStore } from '../store/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function ChartPanel() {
  const chartData = useStore((state) => state.chartData);
  const clearChartData = useStore((state) => state.clearChartData);

  if (!chartData) {
    return null;
  }

  const dataForChart = chartData.xAxis.data.map((x, i) => ({
    name: x,
    [chartData.yAxis.label]: chartData.yAxis.data[i],
  }));

  return (
    <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-90 p-4 rounded-lg shadow-2xl z-20 w-11/12 max-w-lg h-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-cyan-400">{chartData.title}</h3>
        <button onClick={clearChartData} className="text-gray-400 hover:text-white font-bold text-xl">
          &times;
        </button>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={dataForChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="name" stroke="#A0AEC0" />
            <YAxis stroke="#A0AEC0" />
            <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} labelStyle={{ color: '#E2E8F0' }} />
            <Legend wrapperStyle={{ color: '#E2E8F0' }} />
            <Bar dataKey={chartData.yAxis.label} fill="#2DD4BF" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}