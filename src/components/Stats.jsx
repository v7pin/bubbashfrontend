import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function Stats() {
  const spendingData = {
    labels: Array.from({ length: 20 }, (_, i) => `Jan ${i + 1}`),
    datasets: [
      {
        label: "Spending",
        data: [
          0, 200, 400, 650, 900, 1100, 1300, 1500, 1800, 2000, 2200, 2400, 2700,
          2800, 3000, 3100, 3200,
        ],
        borderColor: "#ec4899",
        backgroundColor: "transparent",
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: "#a1a1aa" }, grid: { color: "#27272a" } },
      y: { ticks: { color: "#a1a1aa" }, grid: { color: "#27272a" } },
    },
  };

  return (
    <div className="w-full min-h-screen bg-black text-white px-6 py-10 font-sans">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Food Bubble</h1>
        <p className="text-gray-400">Track your spending and set limits</p>
      </div>

      <div className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center text-white mb-6 shadow-lg">
        <div>
          <h2 className="text-lg font-medium mb-1">Current Balance</h2>
          <div className="text-4xl font-bold">₹3,200</div>
          <p className="text-sm text-gray-200 mt-1">Monthly limit: ₹8,000</p>
          <div className="mt-2 w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-pink-300" style={{ width: "40%" }}></div>
          </div>
          <p className="text-xs mt-1 text-gray-200">
            40% of monthly budget used
          </p>
        </div>
        <div className="mt-6 md:mt-0 flex gap-4">
          <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full font-medium transition-all duration-200">
            + Add Funds
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full font-medium transition-all duration-200">
            Freeze Bubble
          </button>
        </div>
      </div>

      <div className="mb-10 text-sm text-gray-300">
        <h3 className="text-lg font-semibold mb-2">✨ AI Insights</h3>
        <ul className="list-disc list-inside">
          <li>
            You spend 30% more on weekends than weekdays. Consider setting a
            weekend limit to stay on track!
          </li>
          <li>
            Your biggest food expense is from food delivery apps (₹2,100 this
            month).
          </li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">📈 Spending History</h3>
        <div className="bg-zinc-900 p-4 rounded-xl shadow-inner">
          <Line data={spendingData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
