import React, { useState } from "react";
import { X, Lock } from "lucide-react";
import pinkImg from "../assets/pinkb.png";
import blueImg from "../assets/blueb.png";
import purpleImg from "../assets/purpleb.png";
import greenImg from "../assets/greenb.png";
import yellowImg from "../assets/yellowb.png";
import orangeImg from "../assets/orangeb.png";

const colorImages = {
  pink: pinkImg,
  blue: blueImg,
  purple: purpleImg,
  green: greenImg,
  yellow: yellowImg,
  orange: orangeImg,
};

export default function PaymentModal({
  onClose,
  bubbles,
  selectedBubble,
  setSelectedBubble,
  payAmount,
  setPayAmount,
  onPay,
}) {
  const [errorMsg, setErrorMsg] = useState("");

  const handlePay = () => {
    if (selectedBubble?.frozen) {
      setErrorMsg("❄️ Cannot pay: This bubble is frozen.");
      return;
    }
    setErrorMsg("");
    onPay();
  };

  const handleBubbleClick = (b) => {
    if (b.frozen) {
      setErrorMsg("❄️ Cannot select: This bubble is frozen.");
      return;
    }
    setErrorMsg("");
    setSelectedBubble(b);
  };

  return (
    <>
      <style>{`
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .animate-pop {
          animation: pop 0.4s ease-out;
        }
        @keyframes pulse-hover {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .hover\\:pulse:hover {
          animation: pulse-hover 0.5s ease-in-out;
        }

        /* Small lock icon position */
        .lock-icon {
          position: absolute;
          top: 4px;
          right: 4px;
          color: #60a5fa; /* Tailwind blue-400 */
          opacity: 0.8;
          pointer-events: none;
          user-select: none;
        }
      `}</style>

      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-[#1f1f2e] p-6 rounded-3xl w-full max-w-md text-white relative shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          >
            <X />
          </button>

          {/* Heading */}
          <h3 className="text-2xl font-extrabold mb-6 text-center tracking-wide">
            💸 Make a Payment
          </h3>

          {/* Selected Bubble Preview */}
          {selectedBubble && (
            <div className="flex flex-col items-center mb-6 relative">
              <div className="relative w-24 h-24 mb-2">
                <img
                  src={colorImages[selectedBubble.color] || pinkImg}
                  alt={selectedBubble.color}
                  className="w-full h-full object-contain drop-shadow-md"
                />
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  {selectedBubble.emoji}
                </div>
                {/* Small lock icon if frozen */}
                {selectedBubble.frozen && (
                  <Lock
                    size={20}
                    className="lock-icon"
                    title="This bubble is frozen"
                  />
                )}
              </div>
              <div className="text-lg font-semibold">{selectedBubble.name}</div>
              <div className="text-sm text-gray-400">
                Available: ₹{selectedBubble.amount}
              </div>
            </div>
          )}

          {/* Payment Input */}
          <input
            type="number"
            min="1"
            placeholder="Enter amount"
            className="w-full px-4 py-3 mb-2 rounded-xl bg-[#2c2c3f] text-white placeholder-gray-400 text-lg outline-none focus:ring-2 focus:ring-pink-500"
            value={payAmount || ""}
            onChange={(e) => setPayAmount(Number(e.target.value))}
          />

          {/* Show error message */}
          {errorMsg && (
            <div className="mb-4 text-red-400 font-semibold text-center select-none">
              {errorMsg}
            </div>
          )}

          {/* Bubble Grid */}
          <div className="grid grid-cols-4 gap-4 justify-center mb-4">
            {bubbles.map((b) => {
              const isSelected = selectedBubble?.id === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => handleBubbleClick(b)}
                  className={`relative w-16 h-16 rounded-full cursor-pointer transition-transform duration-200 ${
                    isSelected ? "ring-4 ring-pink-500 animate-pop" : ""
                  } hover:pulse ${
                    b.frozen ? "cursor-not-allowed opacity-60" : ""
                  }`}
                >
                  <img
                    src={colorImages[b.color] || pinkImg}
                    alt={b.color}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">
                    {b.emoji}
                  </div>
                  {/* Small lock icon on frozen bubbles */}
                  {b.frozen && (
                    <Lock
                      size={16}
                      className="lock-icon"
                      title="This bubble is frozen"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePay}
            disabled={
              !payAmount ||
              payAmount <= 0 ||
              !selectedBubble ||
              selectedBubble.frozen
            }
            className={`w-full mt-4 py-3 rounded-xl text-lg font-semibold transition ${
              payAmount &&
              payAmount > 0 &&
              selectedBubble &&
              !selectedBubble.frozen
                ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90"
                : "bg-gray-700 cursor-not-allowed"
            }`}
          >
            Pay Now
          </button>
        </div>
      </div>
    </>
  );
}
