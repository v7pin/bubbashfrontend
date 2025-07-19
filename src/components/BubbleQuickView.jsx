import React, { useEffect, useState, useRef } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

import { ChevronLeft, ChevronRight } from "lucide-react";

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

const colorText = {
  pink: "text-pink-300",
  blue: "text-blue-300",
  purple: "text-purple-300",
  green: "text-green-300",
  yellow: "text-yellow-300",
  orange: "text-orange-300",
};

export default function BubbleQuickView() {
  const [bubbles, setBubbles] = useState([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "bubbles"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBubbles(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      const el = scrollRef.current;
      if (!el) return;
      setShowLeftArrow(el.scrollLeft > 0);
      setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };

    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll(); // initial check
    }

    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
    };
  }, [bubbles]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="relative w-full px-2 mb-3">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .float-bubble {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Arrows (fade in only if scrollable) */}
      {showLeftArrow && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/40 backdrop-blur-md rounded-full p-2 shadow-lg hover:scale-110 transition sm:flex hidden animate-pulse"
        >
          <ChevronLeft className="w-6 h-6 text-white drop-shadow-lg" />
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/40 backdrop-blur-md rounded-full p-2 shadow-lg hover:scale-110 transition sm:flex hidden animate-pulse"
        >
          <ChevronRight className="w-6 h-6 text-white drop-shadow-lg" />
        </button>
      )}

      <h2 className="text-xl font-semibold mb-1 text-white">Quick View</h2>

      {/* Bubble Row */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto py-4 px-6 scroll-smooth scrollbar-hide snap-x snap-mandatory"
      >
        {bubbles.map((bubble) => {
          const isFrozen = bubble.frozen;
          return (
            <div
              key={bubble.id}
              onClick={() =>
                isFrozen &&
                alert("❄️ This bubble is frozen and cannot be used.")
              }
              className={`relative flex-shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-full shadow-md hover:scale-105 transition-all float-bubble snap-start ${
                isFrozen ? "opacity-80 cursor-default" : "cursor-pointer"
              }`}
            >
              <img
                src={colorImages[bubble.color]}
                alt={bubble.name}
                className="w-full h-full object-cover rounded-full"
                style={{
                  filter: isFrozen ? "grayscale(40%) blur(1px)" : "none",
                }}
              />
              {isFrozen && (
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-full z-10 flex items-center justify-center text-sm text-blue-800 font-bold">
                  ❄️
                </div>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-1 z-20">
                <div className="text-2xl">{bubble.emoji}</div>
                <p className="text-xs font-semibold mt-1 truncate">
                  {bubble.name}
                </p>
                <p className={`text-xs font-bold ${colorText[bubble.color]}`}>
                  ₹{bubble.amount}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
