// components/TransferModal.jsx

import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import CountUp from "react-countup";
import BubbleCarousel from "./BubbleCarousel";

export default function TransferModal({ open, setOpen, bubbles }) {
  const [fromIndex, setFromIndex] = useState(0);
  const [toIndex, setToIndex] = useState(1);
  const [amount, setAmount] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);

  useEffect(() => {
    if (bubbles.length > 0) {
      setFromAmount(bubbles[fromIndex]?.amount || 0);
      setToAmount(bubbles[toIndex]?.amount || 0);
    }
  }, [bubbles, fromIndex, toIndex]);

  const handleTransfer = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return alert("Enter a valid amount.");
    if (fromIndex === toIndex)
      return alert("Cannot transfer to the same bubble.");
    if (bubbles[fromIndex].amount < amt) return alert("Insufficient funds!");

    setIsTransferring(true);

    const newFromAmt = bubbles[fromIndex].amount - amt;
    const newToAmt = bubbles[toIndex].amount + amt;
    setFromAmount(newFromAmt);
    setToAmount(newToAmt);

    try {
      await updateDoc(doc(db, "bubbles", bubbles[fromIndex].id), {
        amount: newFromAmt,
      });
      await updateDoc(doc(db, "bubbles", bubbles[toIndex].id), {
        amount: newToAmt,
      });

      setTimeout(() => {
        setIsTransferring(false);
        setAmount("");
        setOpen(false);
      }, 3000);
    } catch (err) {
      console.error("Transfer failed:", err);
      alert("Transfer failed. Please try again.");
      setIsTransferring(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-[#13131a] border border-white/10 backdrop-blur-lg rounded-3xl w-full max-w-md p-6 text-white shadow-xl relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">🔁 Transfer Between Bubbles</h2>
            <button onClick={() => setOpen(false)}>
              <X className="text-gray-400 hover:text-white transition" />
            </button>
          </div>

          <div className="text-xs font-semibold text-cyan-400 mb-1">From</div>
          <BubbleCarousel
            bubbles={bubbles}
            selectedIndex={fromIndex}
            onChange={setFromIndex}
          />
          <div className="text-center text-base font-mono text-emerald-300 mt-1">
            ₹<CountUp end={fromAmount} duration={1.5} decimals={2} />
          </div>

          <div className="text-xs font-semibold text-yellow-400 mt-6 mb-1">
            To
          </div>
          <BubbleCarousel
            bubbles={bubbles}
            selectedIndex={toIndex}
            onChange={setToIndex}
          />
          <div className="text-center text-base font-mono text-fuchsia-300 mt-1">
            ₹<CountUp end={toAmount} duration={1.5} decimals={2} />
          </div>

          <input
            type="number"
            placeholder="Enter amount to transfer"
            className="w-full bg-[#20202c] border border-white/10 p-3 rounded-xl mt-6 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            onClick={handleTransfer}
            disabled={isTransferring}
            className="w-full mt-4 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 rounded-full font-bold text-white hover:scale-105 transition active:scale-95 shadow-md disabled:opacity-50"
          >
            ✨ Move Funds
          </button>

          {isTransferring && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-lg rounded-3xl z-20">
              <div className="text-center space-y-4 animate-fadeIn">
                <div className="text-5xl animate-pulse">⚡</div>
                <p className="text-md text-green-300">
                  Transferring funds securely...
                </p>
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </Dialog>
  );
}
