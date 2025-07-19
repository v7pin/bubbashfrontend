import React from "react";

const BubbleCard = ({ title, limit, spent, frozen, onFreeze }) => {
  const percentage = Math.min((spent / limit) * 100, 100);

  return (
    <div
      className={`rounded-xl p-5 text-white ${
        frozen ? "bg-gray-700" : "bg-bubbleGray"
      }`}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="w-full bg-gray-400 rounded-full h-3 mb-2">
        <div
          className="bg-bubblePink h-3 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm">
        ₹{spent} of ₹{limit}
      </p>
      <button
        onClick={onFreeze}
        className="mt-3 text-xs px-3 py-1 rounded-full font-semibold bg-white text-black"
      >
        {frozen ? "Unfreeze" : "Freeze"}
      </button>
    </div>
  );
};

export default BubbleCard;
