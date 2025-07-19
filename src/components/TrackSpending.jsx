// src/components/TrackSpending.jsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const COLORS = [
  "#845EC2",
  "#D65DB1",
  "#FF6F91",
  "#FF9671",
  "#FFC75F",
  "#F9F871",
];

const TrackSpending = ({ onClose }) => {
  const [spendingData, setSpendingData] = useState([]);
  const [history, setHistory] = useState([]);

  const fetchSpending = async () => {
    const snapshot = await getDocs(collection(db, "transactions"));
    const data = snapshot.docs.map((doc) => doc.data());

    const usageMap = {};
    data.forEach((entry) => {
      if (!usageMap[entry.bubbleLabel]) usageMap[entry.bubbleLabel] = 0;
      usageMap[entry.bubbleLabel] += entry.amount;
    });

    const chartData = Object.entries(usageMap).map(([name, value]) => ({
      name,
      value,
    }));

    setSpendingData(chartData);
    setHistory(data.reverse());
  };

  useEffect(() => {
    fetchSpending();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm font-['Poppins']">
      <div className="bg-white rounded-3xl p-6 w-full max-w-3xl relative shadow-xl">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold text-violet-700 mb-4">
          Track Spending
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Monthly Bubble Usage
            </h3>
            <PieChart width={300} height={300}>
              <Pie
                data={spendingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {spendingData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </div>

          {/* History List */}
          <div className="overflow-y-auto max-h-[300px] p-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Spending History
            </h3>
            {history.length === 0 ? (
              <p className="text-gray-500 text-sm">No transactions recorded.</p>
            ) : (
              <ul className="space-y-3">
                {history.map((entry, idx) => (
                  <li
                    key={idx}
                    className="bg-violet-100 text-violet-800 rounded-xl p-3 shadow-sm flex justify-between items-center text-sm"
                  >
                    <div>
                      <div className="font-medium">
                        {entry.bubbleLabel} {entry.emoji}
                      </div>
                      <div className="text-xs text-gray-600">
                        QR: {entry.qrCodeId || "N/A"} •{" "}
                        {new Date(entry.timestamp?.toDate()).toLocaleString()}
                      </div>
                    </div>
                    <div className="font-bold">₹{entry.amount}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackSpending;
