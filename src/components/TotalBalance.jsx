import React, { useEffect, useState, useRef } from "react";
import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function TotalBalance() {
  const [currentTotal, setCurrentTotal] = useState(0);
  const [percentChange, setPercentChange] = useState(null);
  const prevTotalRef = useRef(0);

  useEffect(() => {
    // Load previous total from localStorage on first mount
    const storedPrevTotal = localStorage.getItem("prevTotalBalance");
    if (storedPrevTotal !== null) {
      prevTotalRef.current = parseFloat(storedPrevTotal);
    }

    const unsubscribe = onSnapshot(collection(db, "bubbles"), (snapshot) => {
      const newTotal = snapshot.docs.reduce((sum, doc) => {
        const data = doc.data();
        return sum + (data.amount || 0);
      }, 0);

      const prevTotal = prevTotalRef.current;

      console.log("Previous Total:", prevTotal);
      console.log("New Total:", newTotal);

      if (prevTotal !== 0 && prevTotal !== newTotal) {
        const change = ((newTotal - prevTotal) / prevTotal) * 100;
        console.log("Percent Change:", change.toFixed(2));
        setPercentChange(change.toFixed(2));
      }

      setCurrentTotal(newTotal);
      prevTotalRef.current = newTotal;

      // Save newTotal to localStorage for future sessions
      localStorage.setItem("prevTotalBalance", newTotal.toString());
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-green-400 p-6 rounded-2xl mb-6 shadow-lg relative text-white">
      <div>
        <p className="text-sm opacity-75 mb-1">Total Balance</p>
        <h2 className="text-3xl font-bold">
          ₹{currentTotal.toLocaleString("en-IN")}
        </h2>
        <p className="text-xs opacity-70">Updated just now</p>
      </div>

      {percentChange !== null && (
        <div
          className={`absolute right-4 top-4 text-xs font-medium ${
            parseFloat(percentChange) > 0
              ? "text-green-800"
              : parseFloat(percentChange) < 0
              ? "text-red-800"
              : "text-yellow-100"
          }`}
        >
          {parseFloat(percentChange) >= 0 ? "+" : ""}
          {percentChange}%{" "}
          {parseFloat(percentChange) > 0
            ? "↑"
            : parseFloat(percentChange) < 0
            ? "↓"
            : ""}
        </div>
      )}
    </div>
  );
}
