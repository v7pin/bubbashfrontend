import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import pinkImg from "../assets/pinkb.png";
import blueImg from "../assets/blueb.png";
import purpleImg from "../assets/purpleb.png";
import greenImg from "../assets/greenb.png";
import yellowImg from "../assets/yellowb.png";
import orangeImg from "../assets/orangeb.png";
import successSound from "../assets/bubble.wav";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const colorImages = {
  pink: pinkImg,
  blue: blueImg,
  purple: purpleImg,
  green: greenImg,
  yellow: yellowImg,
  orange: orangeImg,
};

export default function SuccessModal({ bubble, payAmount, onClose }) {
  const [balance, setBalance] = useState(bubble.amount);

  useEffect(() => {
    const audio = new Audio(successSound);
    audio.volume = 0.6;
    audio.play();

    // Confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#00FFB2", "#FF6FD8", "#FFD93D", "#C5A3FF"],
    });

    const duration = 3000; // 3 seconds
    const totalSteps = Math.floor(duration / 30); // update every 30ms
    const start = bubble.amount;
    const target = bubble.amount - payAmount;
    const stepValue = (start - target) / totalSteps;

    let current = start;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current -= stepValue;
      if (step >= totalSteps || current <= target) {
        clearInterval(interval);
        setBalance(Math.round(target));
        audio.pause();
        audio.currentTime = 0;

        // ✅ Update in Firebase
        const bubbleRef = doc(db, "bubbles", bubble.id);
        updateDoc(bubbleRef, { amount: Math.round(target) });
      } else {
        setBalance(Math.round(current));
      }
    }, 30);

    return () => {
      clearInterval(interval);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [bubble, payAmount]);

  return (
    <>
      <style>
        {`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
          }
        `}
      </style>

      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-[#1f1f2e] p-8 rounded-3xl text-center w-full max-w-md shadow-2xl border border-purple-700 animate-fade-in-up">
          <h3 className="text-3xl font-extrabold text-green-400 mb-2 tracking-wide">
            ✅ Payment Successful
          </h3>

          {/* Animated Bubble */}
          <div className="relative w-36 h-36 mx-auto mt-4 mb-4">
            <img
              src={colorImages[bubble.color] || pinkImg}
              alt="bubble"
              className="w-full h-full object-contain rounded-full shadow-2xl transition-transform duration-300"
              style={{
                transform: balance < bubble.amount ? "scale(0.88)" : "scale(1)",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl">{bubble.emoji}</div>
              <div className="text-white font-bold mt-1 text-2xl">
                ₹{balance}
              </div>
            </div>
          </div>

          <p className="text-white text-xl font-semibold">
            {bubble.name} Bubble
          </p>
          <p className="text-pink-300 mt-2">
            ₹{payAmount} deducted from {bubble.name}
          </p>

          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-semibold hover:scale-105 transition"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}
