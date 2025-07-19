// File: src/components/BubbleHealth.jsx
import React from "react";

export const BubbleHealth = ({ bubbles }) => {
  return (
    <div className="bg-zinc-900 p-4 rounded-2xl">
      <h3 className="text-lg font-bold mb-4">Bubble Health</h3>
      {bubbles.map((bubble, index) => (
        <div key={index} className="mb-3">
          <p className="mb-1 text-sm">
            {bubble.emoji} {bubble.name}
          </p>
          <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${bubble.color}`}
              style={{
                width: `${Math.round((bubble.spent / bubble.limit) * 100)}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-right text-gray-400 mt-1">
            ₹{bubble.spent.toLocaleString()} / ₹{bubble.limit.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};
