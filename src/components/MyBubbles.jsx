import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Dialog } from "@headlessui/react";
import { X, Snowflake } from "lucide-react";
import BubbleHealthBar from "./BubbleHealthBar.jsx";
import TransferModal from "./TransferModal.jsx"; // Import this at top
import transferGlow from "../assets/transferGlow.json";
import Lottie from "lottie-react";
import pinkImg from "../assets/pinkb.png";
import blueImg from "../assets/blueb.png";
import purpleImg from "../assets/purpleb.png";
import greenImg from "../assets/greenb.png";
import yellowImg from "../assets/yellowb.png";
import orangeImg from "../assets/orangeb.png";

const emojis = ["🍕", "🎮", "👛", "🚗", "📊", "🏠", "🍸", "🧁", "🎵", "🎁"];
const colors = ["pink", "blue", "purple", "green", "yellow", "orange"];

const colorImages = {
  pink: pinkImg,
  blue: blueImg,
  purple: purpleImg,
  green: greenImg,
  yellow: yellowImg,
  orange: orangeImg,
};

const colorText = {
  pink: "text-pink-400",
  blue: "text-blue-400",
  purple: "text-purple-400",
  green: "text-green-400",
  yellow: "text-yellow-400",
  orange: "text-orange-400",
};

export default function MyBubbles() {
  const [bubbles, setBubbles] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [transferOpen, setTransferOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    emoji: "",
    total: "",
    color: "pink",
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "bubbles"), (snapshot) => {
      setBubbles(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleCreate = async () => {
    const { name, amount, emoji, color, total } = formData;
    if (!name || !amount || !emoji || !color) {
      alert("Please fill all fields.");
      return;
    }
    try {
      await addDoc(collection(db, "bubbles"), {
        name,
        amount: parseFloat(amount),
        emoji,
        total: total ? parseFloat(total) : 0,
        color,
        frozen: false,
      });
      setFormData({
        name: "",
        amount: "",
        emoji: "",
        total: "",
        color: "pink",
      });
      setOpen(false);
    } catch (error) {
      console.error("Error creating bubble:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "bubbles", confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error("Error deleting bubble:", error);
    }
  };

  const toggleFreeze = async (bubbleId, currentStatus) => {
    try {
      const ref = doc(db, "bubbles", bubbleId);
      await updateDoc(ref, { frozen: !currentStatus });
    } catch (error) {
      console.error("Error toggling freeze:", error);
    }
  };

  return (
    <div className="p-6 bg-[#0f0f1b] min-h-screen text-white">
      <style>
        {`
        @keyframes snowFall {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          100% {
            transform: translateY(120px);
            opacity: 0.6;
          }
        }
        .snowflake {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          opacity: 0.5;
          filter: blur(1px);
          animation: snowFall 2s linear infinite;
        }
                 @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }
        .floating {
          animation: float 4s ease-in-out infinite;
        }
        `}
      </style>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">My Bubbles</h2>
          <p className="text-sm text-gray-400">
            Manage your spending categories
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-full text-2xl font-medium shadow hover:scale-105 transition"
        >
          +
        </button>
      </div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold text-white">Active Bubbles</h3>
        <p className="text-sm text-gray-400">{bubbles.length} bubbles</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...bubbles, { isNew: true }].map((b, index) => {
          if (b.isNew) {
            return (
              <button
                key="new-bubble"
                onClick={() => setOpen(true)}
                className="bg-[#1a1a2e] hover:bg-[#25253a] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow"
              >
                <div className="w-20 h-20 mb-3 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-4xl">
                  +
                </div>
                <p className="text-sm font-semibold">Create New</p>
                <p className="text-xs text-gray-400">Add a category</p>
              </button>
            );
          }

          const percentage = b.total
            ? Math.min((b.amount / b.total) * 100, 100)
            : 0;

          return (
            <div
              key={b.id}
              className="bg-[#1a1a2e] rounded-2xl p-6 flex flex-col items-center text-center shadow relative hover:scale-105 transition"
            >
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-400"
                onClick={() => setConfirmDeleteId(b.id)}
              >
                ✖
              </button>

              <button
                className="absolute top-2 left-2 text-blue-300 hover:text-blue-500"
                onClick={() => toggleFreeze(b.id, b.frozen)}
                title={b.frozen ? "Unfreeze Bubble" : "Freeze Bubble"}
              >
                <Snowflake size={18} />
              </button>

              <div
                className={`relative w-20 h-20 mb-3 transition-all duration-500 ease-in-out ${
                  b.frozen ? "grayscale brightness-75 scale-95" : "scale-100"
                } ${!b.isNew ? "floating" : ""}`}
              >
                <img
                  src={colorImages[b.color]}
                  alt={`${b.color} bubble`}
                  className="w-20 h-20 rounded-full"
                />
                <span className="absolute inset-0 flex items-center justify-center text-3xl">
                  {b.emoji}
                </span>

                {b.frozen && (
                  <>
                    <div className="absolute top-[-5px] left-[-5px] bg-blue-500 text-white rounded-full p-1 animate-pulse ring-2 ring-blue-300 ring-offset-2 ring-offset-[#1a1a2e]">
                      <Snowflake size={12} />
                    </div>

                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="snowflake"
                        style={{
                          left: `${20 + i * 15}%`,
                          animationDelay: `${i * 0.4}s`,
                        }}
                      />
                    ))}
                  </>
                )}
              </div>

              <p className="text-base font-semibold">{b.name}</p>
              <p className={`text-lg font-bold ${colorText[b.color]}`}>
                ₹{b.amount}
              </p>
              <p className="text-xs text-gray-400">
                {percentage.toFixed(0)}% used
              </p>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setTransferOpen(true)}
        className="relative w-full py-3 px-5 rounded-full overflow-hidden mt-4 hover:scale-105 transition 0 shadow-lg flex items-center justify-center text-white font-semibold text-lg"
      >
        {/* Lottie Animation as Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Lottie animationData={transferGlow} loop autoPlay />
        </div>

        {/* Text Above Lottie */}
        <span className="relative z-10 text-white font-[arial] font-semibold">
          Transfer Between Bubbles
        </span>
      </button>

      <div className="bg-[#1a1a2e] mt-12 p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4 text-white">Bubble Health</h3>
        <div className="space-y-5">
          {bubbles.map((b) => (
            <BubbleHealthBar key={b.id} bubble={b} />
          ))}
        </div>
      </div>

      <TransferModal
        open={transferOpen}
        setOpen={setTransferOpen}
        bubbles={bubbles}
      />

      {/* Confirm Deletion Dialog */}
      <Dialog
        open={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/60" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-[#1a1a2e] p-6 rounded-xl max-w-sm w-full shadow">
            <Dialog.Title className="text-lg text-red-500 font-bold mb-2">
              Confirm Deletion
            </Dialog.Title>
            <p className="text-sm text-gray-300 mb-6">
              Are you sure you want to delete this bubble?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      {/* Create Bubble Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/60" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-[#1a1a2e] p-6 rounded-xl max-w-xl w-full space-y-4 shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <Dialog.Title className="text-white font-bold text-lg">
                  Create New Bubble
                </Dialog.Title>
                <p className="text-sm text-gray-400">
                  Set up a new spending category
                </p>
              </div>
              <button onClick={() => setOpen(false)}>
                <X className="text-white" />
              </button>
            </div>

            <input
              className="w-full p-2 rounded bg-[#2a2a3e] text-white"
              placeholder="e.g. Gym, Shopping"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              className="w-full p-2 rounded bg-[#2a2a3e] text-white"
              placeholder="Initial Amount (₹)"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />

            {/* Emoji Picker */}
            <div>
              <p className="text-sm text-white mb-1">Choose an Emoji</p>
              <div className="grid grid-cols-5 gap-2">
                {emojis.map((emo, i) => (
                  <button
                    key={i}
                    onClick={() => setFormData({ ...formData, emoji: emo })}
                    className={`p-2 text-2xl rounded-lg hover:bg-pink-700 ${
                      formData.emoji === emo ? "border-2 border-white" : ""
                    }`}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div>
              <p className="text-sm text-white mb-1">Bubble Color</p>
              <div className="flex gap-3">
                {colors.map((clr) => (
                  <button
                    key={clr}
                    className={`w-10 h-10 rounded-full border-1 ${
                      formData.color === clr
                        ? "border-white"
                        : "border-transparent"
                    }`}
                    style={{
                      backgroundImage: `url(${colorImages[clr]})`,
                      backgroundSize: "cover",
                    }}
                    onClick={() => setFormData({ ...formData, color: clr })}
                  />
                ))}
              </div>
            </div>

            <input
              className="w-full p-2 rounded bg-[#2a2a3e] text-white"
              placeholder="Monthly Limit (Optional)"
              type="number"
              value={formData.total}
              onChange={(e) =>
                setFormData({ ...formData, total: e.target.value })
              }
            />

            <button
              onClick={handleCreate}
              className="w-full py-2 rounded-full text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition"
            >
              Create Bubble
            </button>

            {/* Preview */}
            {formData.name && formData.amount && formData.emoji && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-400 mb-2">Preview</p>
                <div className="inline-block bg-[#12122a] rounded-xl p-4 w-44">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <img
                      src={colorImages[formData.color]}
                      alt="preview"
                      className="w-16 h-16 rounded-full"
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-2xl">
                      {formData.emoji}
                    </span>
                  </div>
                  <p className="font-semibold text-white">{formData.name}</p>
                  <p
                    className={`text-sm font-bold ${colorText[formData.color]}`}
                  >
                    ₹{formData.amount}
                  </p>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
