import React, { useState, useEffect } from "react";
import { Info, X } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import axios from "axios";
import { subDays } from "date-fns";

export default function AISuggestions() {
  const [bubbles, setBubbles] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBubble, setSelectedBubble] = useState(null);

  // Fetch bubbles real-time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "bubbles"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBubbles(data);
    });
    return () => unsub();
  }, []);

  // Fetch transactions real-time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "transactions"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (bubbles.length === 0) return;

    const spentMap = {};
    transactions.forEach((txn) => {
      if (!spentMap[txn.bubbleId]) spentMap[txn.bubbleId] = 0;
      spentMap[txn.bubbleId] += txn.amount;
    });

    const sevenDaysAgo = subDays(new Date(), 7);
    const dailySpendMap = {};

    bubbles.forEach((b) => {
      const recentTxns = transactions.filter(
        (txn) => txn.bubbleId === b.id && txn.timestamp?.toDate() > sevenDaysAgo
      );

      const totalRecentSpend = recentTxns.reduce((acc, t) => acc + t.amount, 0);
      dailySpendMap[b.id] = totalRecentSpend / 7 || 0;
    });

    const enrichedBubbles = bubbles.map((b) => {
      const spent = spentMap[b.id] || 0;
      const dailySpend = dailySpendMap[b.id] || 0;
      const balance = b.amount - spent;
      const daysLeft = dailySpend > 0 ? balance / dailySpend : Infinity;

      return {
        id: b.id,
        name: b.name,
        amount: b.amount,
        spent,
        dailySpend: dailySpend.toFixed(2),
        balance: balance.toFixed(2),
        daysLeft: daysLeft === Infinity ? "∞" : daysLeft.toFixed(1),
        frozen: b.frozen || false,
        emoji: b.emoji,
        color: b.color,
      };
    });

    const riskyBubble = enrichedBubbles.find(
      (b) => !b.frozen && b.daysLeft !== "∞" && parseFloat(b.daysLeft) < 5
    );
    if (riskyBubble) setSelectedBubble(riskyBubble);
    else setSelectedBubble(null);

    const fetchAISuggestion = async () => {
      try {
        const res = await axios.post(
          "https://bubbash-backend.vercel.app//api/get-suggestions",
          {
            bubbles: enrichedBubbles,
          }
        );
        setAiSuggestion(res.data.suggestion);
      } catch (err) {
        console.error("AI error:", err);
        setAiSuggestion("Failed to get AI suggestion");
      }
    };

    fetchAISuggestion();
  }, [bubbles, transactions]);

  return (
    <>
      {/* Full-width AI Card */}
      <div className="w-full  sm:px-8 my-8">
        <div className="p-[2px] rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-green-400 shadow-lg">
          <div className="bg-[#0f0f0f] rounded-2xl p-5 flex flex-col gap-4 w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                🤖 <span>AI-Powered Finance Assistant</span>
              </h3>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="text-gray-400 hover:text-white"
              >
                <Info size={20} />
              </button>
            </div>

            {/* Info */}
            {showInfo && (
              <div className="text-sm text-purple-300 leading-snug animate-fadeIn">
                AI watches your spending patterns and suggests smarter budgeting
                actions.
              </div>
            )}

            {/* AI Suggestion */}
            {aiSuggestion ? (
              <div className="bg-black/50 border border-pink-500 rounded-xl p-4 text-pink-200 text-[15px] leading-relaxed animate-fadeIn">
                {aiSuggestion}
              </div>
            ) : (
              <p className="text-pink-300 text-sm font-medium text-center animate-pulse">
                Generating suggestions...
              </p>
            )}

            {/* CTA */}
            {selectedBubble && (
              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 py-2 rounded-full text-white font-semibold transition hover:scale-[1.02]"
              >
                Top-up {selectedBubble.emoji} {selectedBubble.name}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedBubble && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-[#181818] border border-pink-600 rounded-2xl p-6 w-[90%] max-w-md text-white animate-fadeInScale relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-pink-400 hover:text-pink-200"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl font-bold mb-2 text-pink-300">
              Add Funds to {selectedBubble.name} 💸
            </h2>
            <p className="text-pink-200 mb-1">
              Balance: ₹{selectedBubble.balance} | Spent: ₹
              {selectedBubble.spent}
            </p>
            <p className="text-yellow-400 mb-4">
              📊 Daily Spend: ₹{selectedBubble.dailySpend}
            </p>

            <input
              type="number"
              defaultValue={2000}
              className="w-full px-4 py-2 rounded-lg bg-black bg-opacity-40 border border-pink-500 text-white placeholder-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400 mb-4"
              placeholder="Amount to add"
            />
            <button
              onClick={() => {
                alert(`Top-up initiated for ${selectedBubble.name}`);
                setShowModal(false);
              }}
              className="w-full bg-pink-600 hover:bg-pink-700 py-2 rounded-full font-semibold transition hover:scale-105 active:scale-95"
            >
              Confirm Top-Up
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {opacity: 0;}
          to {opacity: 1;}
        }
        @keyframes fadeInScale {
          from {opacity: 0; transform: scale(0.95);}
          to {opacity: 1; transform: scale(1);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
}
