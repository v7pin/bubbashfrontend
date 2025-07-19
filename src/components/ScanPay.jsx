import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import PaymentModal from "./PaymentModal.jsx";
import SuccessModal from "./SuccessModal.jsx";

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

export default function ScanPay() {
  const [bubbles, setBubbles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBubble, setSelectedBubble] = useState(null);
  const [payAmount, setPayAmount] = useState(0);
  const [animationBalance, setAnimationBalance] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [frozenMessage, setFrozenMessage] = useState(false);
  const bubbleContainerRef = React.useRef(null);

  const dummyTransactions = [
    {
      id: 1,
      title: "Zomato",
      time: "Today, 2:34 PM",
      amount: "-₹450",
      bubble: "Food Bubble",
      color: "text-pink-400",
      emoji: "🍕",
    },
    {
      id: 2,
      title: "Uber",
      time: "Today, 11:20 AM",
      amount: "-₹320",
      bubble: "Travel Bubble",
      color: "text-blue-400",
      emoji: "🚕",
    },
    {
      id: 3,
      title: "H&M",
      time: "Yesterday, 5:45 PM",
      amount: "-₹1,200",
      bubble: "Fashion Bubble",
      color: "text-purple-400",
      emoji: "🛍️",
    },
  ];

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "bubbles"), (snapshot) => {
      setBubbles(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleScanClick = () => {
    setScanning(true);
    setTimeout(() => {
      setShowModal(true);
      setScanning(false);
    }, 2500);
  };

  const handlePay = () => {
    if (!selectedBubble || payAmount <= 0 || payAmount > selectedBubble.amount)
      return;
    setShowModal(false);
    setShowSuccess(true);
    let current = selectedBubble.amount;
    const interval = setInterval(() => {
      if (current <= selectedBubble.amount - payAmount) {
        clearInterval(interval);
        setAnimationBalance(null);
      } else {
        current--;
        setAnimationBalance(current);
      }
    }, 20);
  };

  const scrollByBubble = (direction) => {
    if (!bubbleContainerRef.current) return;
    const container = bubbleContainerRef.current;
    const bubble = container.querySelector(".bubble-item");
    if (!bubble) return;
    const bubbleWidth = bubble.getBoundingClientRect().width + 24;
    const scrollAmount = direction === "left" ? -bubbleWidth : bubbleWidth;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="bg-[#0f0f1b] text-white min-h-screen p-4 space-y-6">
      {frozenMessage && (
        <div className="fixed bottom-14 left-1/2 transform -translate-x-1/2 bg-blue-800 text-white px-4 py-2 rounded-xl shadow-lg z-50 animate-fade-in-out">
          ❄️ This bubble is frozen and cannot be used.
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Scan & Pay</h2>
          <p className="text-sm text-gray-400">Choose a bubble to pay from</p>
        </div>
        <Settings className="text-gray-400" />
      </div>

      {/* Bubble Selector */}
      <div className="bg-[#14142c] p-3 rounded-2xl shadow-lg flex items-center space-x-2 md:space-x-4">
        <button
          onClick={() => scrollByBubble("left")}
          className="text-white p-2 hover:bg-white/10 rounded-full"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={bubbleContainerRef}
          className="flex space-x-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide w-full"
        >
          {bubbles.map((b) => {
            const isSelected = animationBalance && selectedBubble?.id === b.id;
            const isFrozen = b.frozen;
            return (
              <div
                key={b.id}
                className={`bubble-item relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 snap-center cursor-pointer transition-transform ${
                  !isFrozen ? "hover:scale-105" : "opacity-70"
                }`}
                onClick={() => {
                  if (isFrozen) {
                    setFrozenMessage(true);
                    setTimeout(() => setFrozenMessage(false), 2000);
                  } else {
                    setSelectedBubble(b);
                    setShowModal(true);
                  }
                }}
              >
                <img
                  src={colorImages[b.color] || pinkImg}
                  alt={b.color}
                  className={`w-full h-full object-contain rounded-full transition-transform duration-300 ${
                    isSelected ? "scale-75" : ""
                  }`}
                  style={{
                    filter: isFrozen ? "grayscale(40%) blur(1px)" : "none",
                  }}
                />
                {isFrozen && (
                  <>
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-full z-10" />
                    <div className="absolute top-1 right-1 bg-blue-700 text-white rounded-full p-1 text-xs shadow z-20">
                      ❄️
                    </div>
                  </>
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-1 z-20">
                  <div className="text-2xl md:text-3xl">{b.emoji}</div>
                  <div className="text-xs font-semibold mt-1 leading-tight">
                    {b.name}
                  </div>
                  <div className="text-xs text-gray-200">
                    ₹{isSelected ? animationBalance : b.amount}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => scrollByBubble("right")}
          className="text-white p-2 hover:bg-white/10 rounded-full"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* QR Code Scanner */}
      <div className="bg-[#151522] p-4 rounded-2xl shadow-md flex flex-col items-center">
        <div className="relative w-40 h-40 md:w-48 md:h-48 border border-blue-500 rounded-lg flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-xl md:text-2xl z-10">
            <div className="text-center leading-tight">
              <div>◉ ◉</div>
              <div>◉ ◉</div>
            </div>
          </div>
          {scanning && (
            <div className="absolute w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-scan z-20" />
          )}
        </div>
        <p className="text-sm text-gray-400 mt-4">
          Align QR code within the frame
        </p>
        <button
          onClick={handleScanClick}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-semibold hover:scale-105 transition"
        >
          Scan QR Code
        </button>
      </div>

      {showModal && (
        <PaymentModal
          onClose={() => setShowModal(false)}
          bubbles={bubbles}
          selectedBubble={selectedBubble}
          setSelectedBubble={setSelectedBubble}
          payAmount={payAmount}
          setPayAmount={setPayAmount}
          onPay={handlePay}
        />
      )}

      {showSuccess && selectedBubble && (
        <SuccessModal
          bubble={selectedBubble}
          payAmount={payAmount}
          onClose={() => setShowSuccess(false)}
        />
      )}

      {/* Recent Transactions */}
      <div className="bg-[#151522] p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-white">
          Recent Transactions
        </h3>
        <div className="space-y-4">
          {dummyTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between text-sm bg-[#1f1f2e] p-3 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-[#2c2c3e] w-10 h-10 flex items-center justify-center rounded-full text-lg">
                  {tx.emoji}
                </div>
                <div className="flex flex-col text-white">
                  <span className="font-semibold">{tx.title}</span>
                  <span className="text-gray-400 text-xs">{tx.time}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${tx.color}`}>{tx.amount}</div>
                <div className="text-gray-400 text-xs">{tx.bubble}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0% }
          50% { top: 95% }
          100% { top: 0% }
        }
        .animate-scan {
          animation: scan 2.5s infinite ease-in-out;
          position: absolute;
          top: 0;
        }
        @keyframes fade-in-out {
          0%, 100% { opacity: 0; }
          10%, 90% { opacity: 1; }
        }
        .animate-fade-in-out {
          animation: fade-in-out 2s ease-in-out;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
