import React, { useState } from "react";
import {
  Home,
  CircleDollarSign,
  ScanLine,
  BarChart2,
  User,
} from "lucide-react";

const navItems = [
  { icon: <Home size={24} />, label: "Home" },
  { icon: <CircleDollarSign size={24} />, label: "My Bubbles" },
  { icon: <ScanLine size={24} />, label: "Scan & Pay" },
  { icon: <BarChart2 size={24} />, label: "Stats" },
  { icon: <User size={24} />, label: "Profile" },
];

export default function BottomNav({ onTabChange }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabClick = (index) => {
    setActiveIndex(index);
    if (onTabChange) onTabChange(navItems[index].label); // callback to parent
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#111111] shadow-xl border-t border-neutral-800 flex justify-around py-3 rounded-t-3xl px-4">
      {navItems.map((item, index) => (
        <div
          key={item.label}
          onClick={() => handleTabClick(index)}
          className={`flex flex-col items-center text-xs transition-all duration-200 cursor-pointer ${
            activeIndex === index
              ? "text-pink-400 scale-105"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <div
            className={`transition-transform ${
              activeIndex === index ? "drop-shadow-glow" : ""
            }`}
          >
            {item.icon}
          </div>
          <span className="mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
