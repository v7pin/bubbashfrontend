import React from "react";
import { X } from "lucide-react";
import ChatbotWidget from "./ChatbotWidget"; // Adjust if path differs

const SmartRecommendation = ({ userBubbles, onClose }) => {
  const highSpend = userBubbles.filter((b) => b.amount > 2000);
  const lowSpend = userBubbles.filter((b) => b.amount < 300);

  return (
    <>
      {/* Blurred background */}
      <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-40" />

      {/* Modal content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-violet-200">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold text-violet-800 mb-4 flex items-center gap-2">
            🧠 Smart Recommendations{" "}
            <span className="text-sm font-medium">(AI)</span>
          </h2>

          {userBubbles.length === 0 ? (
            <p className="text-gray-500">No data available for suggestions.</p>
          ) : (
            <div className="bg-violet-50 rounded-xl p-4 space-y-3 text-sm text-gray-700">
              {highSpend.map((b) => (
                <p key={b.id}>
                  💡 <strong>{b.label}</strong> seems high. Try reducing by ₹
                  {Math.round(b.amount * 0.2)}.
                </p>
              ))}
              {lowSpend.map((b) => (
                <p key={b.id}>
                  💡 <strong>{b.label}</strong> is underused. Reallocate some
                  amount to <em>Savings</em>?
                </p>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500 mt-4">
            *Powered by early prototype logic. More intelligent personalization
            coming soon.
          </p>
        </div>
      </div>

      {/* Chatbot Icon */}
      <div className="z-[100]">
        <ChatbotWidget />
      </div>
    </>
  );
};

export default SmartRecommendation;
