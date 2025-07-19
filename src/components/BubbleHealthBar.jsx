import React from "react";

const colorText = {
  pink: "text-pink-400",
  blue: "text-blue-400",
  purple: "text-purple-400",
  green: "text-green-400",
  yellow: "text-yellow-400",
  orange: "text-orange-400",
};

const colorBar = {
  pink: "bg-pink-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  orange: "bg-orange-500",
};

export default function BubbleHealthBar({ bubble }) {
  const { name, amount, total, emoji, color } = bubble;

  // Fallbacks to avoid NaN
  const parsedTotal = total || 0;
  const parsedAmount = amount || 0;

  const remaining = parsedTotal - parsedAmount;
  const percentUsed = parsedTotal > 0 ? (parsedAmount / parsedTotal) * 100 : 0;

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2 font-medium text-white">
          <span className="text-lg">{emoji}</span>
          <span className={colorText[color]}>{name}</span>
        </div>
        <div className="text-sm text-gray-300">
          ₹{remaining.toLocaleString()} / ₹{parsedTotal.toLocaleString()}
        </div>
      </div>

      <div className="relative h-3 w-full rounded-full bg-gray-800 overflow-hidden">
        <div
          className={`h-full ${colorBar[color]} transition-all duration-700 ease-in-out`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>

      <div className="text-right text-xs text-gray-400 mt-1">
        {percentUsed.toFixed(0)}% used
      </div>
    </div>
  );
}
