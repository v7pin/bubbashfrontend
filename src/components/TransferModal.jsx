import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import TransferSuccess from "./TransferSuccess.jsx";

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

export default function TransferModal({ open, setOpen, bubbles }) {
  const [fromIndex, setFromIndex] = useState(0);
  const [toIndex, setToIndex] = useState(1);
  const [amount, setAmount] = useState("");
  const [transferStage, setTransferStage] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const fromBubble = bubbles[fromIndex];
  const toBubble = bubbles[toIndex];

  const handleTransfer = async () => {
    if (!fromBubble || !toBubble || !amount) return alert("Fill all fields.");
    if (fromBubble.id === toBubble.id)
      return alert("Select different bubbles.");
    if (fromBubble.frozen)
      return alert(
        `The bubble "${fromBubble.name}" is frozen. Cannot transfer from it.`
      );
    if (parseFloat(amount) > fromBubble.amount)
      return alert("Insufficient balance!");

    setTransferStage(1); // start

    setTimeout(async () => {
      await updateDoc(doc(db, "bubbles", fromBubble.id), {
        amount: fromBubble.amount - parseFloat(amount),
      });
      setTransferStage(2);

      setTimeout(async () => {
        await updateDoc(doc(db, "bubbles", toBubble.id), {
          amount: toBubble.amount + parseFloat(amount),
        });
        setTransferStage(3);
        setShowSuccess(true);

        setTimeout(() => {
          setAmount("");
          setShowSuccess(false);
          setOpen(false);
          setTransferStage(0);
        }, 2500);
      }, 800);
    }, 800);
  };

  const BubbleCard = ({ bubble }) => (
    <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-xl border border-white/20">
      <img
        src={colorImages[bubble.color]}
        alt={bubble.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-3 px-2 text-white text-center">
        <div className="text-base">{bubble.emoji}</div>
        <div className="text-xs font-semibold leading-tight truncate w-full">
          {bubble.name}
        </div>
        <div className="text-[11px]">₹{bubble.amount}</div>
      </div>
      {bubble.frozen && (
        <div className="absolute top-1 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-md">
          Frozen
        </div>
      )}
    </div>
  );

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="z-50 relative"
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-[#12121c] rounded-2xl w-full max-w-xl p-6 space-y-6 text-white shadow-2xl relative">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Transfer Between Bubbles</h2>
            <button onClick={() => setOpen(false)}>
              <X className="text-gray-300 hover:text-white transition" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8 w-full">
            <div className="flex flex-col items-center gap-2 w-full md:w-auto">
              <p className="text-sm text-teal-400 font-medium">From</p>
              <div className="flex items-center gap-2 max-w-[90vw] overflow-hidden">
                <button
                  onClick={() =>
                    setFromIndex((prev) =>
                      prev === 0 ? bubbles.length - 1 : prev - 1
                    )
                  }
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
                >
                  <ChevronLeft />
                </button>
                <BubbleCard bubble={fromBubble} />
                <button
                  onClick={() =>
                    setFromIndex((prev) => (prev + 1) % bubbles.length)
                  }
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>

            <div className="text-2xl mt-6 md:mt-10 text-gray-400">⇌</div>

            <div className="flex flex-col items-center gap-2 w-full md:w-auto">
              <p className="text-sm text-yellow-400 font-medium">To</p>
              <div className="flex items-center gap-2 max-w-[90vw] overflow-hidden">
                <button
                  onClick={() =>
                    setToIndex((prev) =>
                      prev === 0 ? bubbles.length - 1 : prev - 1
                    )
                  }
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
                >
                  <ChevronLeft />
                </button>
                <BubbleCard bubble={toBubble} />
                <button
                  onClick={() =>
                    setToIndex((prev) => (prev + 1) % bubbles.length)
                  }
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>

          <input
            type="number"
            placeholder="Enter amount (₹)"
            className="w-full bg-[#1f1f2e] p-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            onClick={handleTransfer}
            disabled={fromBubble?.frozen}
            className={`w-full py-3 rounded-full font-semibold shadow-md transition ${
              fromBubble?.frozen
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-500 to-blue-500 hover:scale-105 active:scale-95"
            }`}
          >
            {fromBubble?.frozen ? "Frozen Bubble ❄️" : "Move Funds"}
          </button>

          {/* Animations */}
          <AnimatePresence>
            {transferStage > 0 && !showSuccess && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/90 rounded-2xl z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div className="flex flex-col items-center gap-4">
                  {transferStage === 1 && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-4xl"
                    >
                      💳
                    </motion.div>
                  )}
                  {transferStage === 2 && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-4xl"
                    >
                      🔄
                    </motion.div>
                  )}
                  {transferStage === 3 && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-4xl text-green-400"
                    >
                      ✅
                    </motion.div>
                  )}
                  <p className="text-sm text-gray-300">
                    {transferStage === 1 && "Debiting from source..."}
                    {transferStage === 2 && "Transferring..."}
                    {transferStage === 3 && "Crediting to destination..."}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {showSuccess && (
            <TransferSuccess
              fromBubble={fromBubble}
              toBubble={toBubble}
              amount={parseFloat(amount)}
            />
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
