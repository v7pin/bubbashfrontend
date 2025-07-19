import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Snowflake, X } from "lucide-react";
import bubbleImg from "../assets/yellow.png";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import SmartRecommendation from "./SmartRecommendation";
import TrackSpending from "./TrackSpending";

const emojiList = ["🍕", "🎮", "✈️", "🛍️", "📚", "💡", "💻", "🍿"];

const Bubble = () => {
  const navigate = useNavigate();
  const [userBubbles, setUserBubbles] = useState([]);
  const [newBubble, setNewBubble] = useState({
    label: "",
    amount: "",
    emoji: emojiList[0],
  });
  const [showModal, setShowModal] = useState(false);
  const [showAddBubble, setShowAddBubble] = useState(false);
  const [showTrackSpending, setShowTrackSpending] = useState(false);

  const fetchBubbles = async () => {
    const snapshot = await getDocs(collection(db, "bubbles"));
    const bubbles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setUserBubbles(bubbles);
  };

  useEffect(() => {
    fetchBubbles();
  }, []);

  const handleAddBubble = async () => {
    if (!newBubble.label || !newBubble.amount) return;
    const newEntry = {
      ...newBubble,
      amount: parseInt(newBubble.amount),
      frozen: false,
    };
    const docRef = await addDoc(collection(db, "bubbles"), newEntry);
    setUserBubbles([...userBubbles, { ...newEntry, id: docRef.id }]);
    setNewBubble({ label: "", amount: "", emoji: emojiList[0] });
    setShowAddBubble(false);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "bubbles", id));
    setUserBubbles(userBubbles.filter((b) => b.id !== id));
  };

  const handleFreeze = async (id) => {
    const bubble = userBubbles.find((b) => b.id === id);
    await updateDoc(doc(db, "bubbles", id), { frozen: !bubble.frozen });
    setUserBubbles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, frozen: !b.frozen } : b))
    );
  };

  const getBubbleSize = (amount) => {
    const minSize = 50;
    const maxSize = 120;
    const cappedAmount = Math.min(amount, 5000);
    return minSize + (cappedAmount / 5000) * (maxSize - minSize);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-violet-200 to-purple-300 p-6 font-['Poppins']">
      <div className="bg-white shadow-2xl rounded-3xl p-6 w-full max-w-md text-center relative z-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center mb-4 text-violet-700 hover:underline"
        >
          <ArrowLeft className="mr-1" size={20} /> Back
        </button>

        <h1 className="text-2xl font-bold text-violet-800 mb-2">My Bubble</h1>
        <p className="text-sm text-gray-600 mb-4">
          Create & manage your spending bubbles
        </p>

        {/* Smart AI Recommendations Button */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-medium shadow-md hover:scale-105 transition-transform duration-300"
          >
            📍 Smart Recommendations
          </button>
        </div>

        {/* Bubbles Display */}
        <div className="grid grid-cols-2 gap-6 justify-items-center mb-8">
          {userBubbles.map((bubble) => {
            const size = getBubbleSize(bubble.amount);
            return (
              <div
                key={bubble.id}
                className="relative flex flex-col items-center"
              >
                <div className="relative" style={{ width: size, height: size }}>
                  <img
                    src={bubbleImg}
                    alt="Bubble"
                    className="w-full h-full object-contain transition-all duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xl">
                    {bubble.emoji}
                  </div>
                  <div className="absolute top-1 right-1 flex gap-1 z-20">
                    <button onClick={() => handleFreeze(bubble.id)}>
                      <Snowflake
                        size={16}
                        className={`${
                          bubble.frozen ? "text-blue-600" : "text-gray-400"
                        } hover:text-blue-800`}
                      />
                    </button>
                    <button onClick={() => handleDelete(bubble.id)}>
                      <Trash2
                        size={16}
                        className="text-red-500 hover:text-red-700"
                      />
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-800 font-semibold">
                  {bubble.label}
                </div>
                <div className="text-xs text-gray-600">₹{bubble.amount}</div>
                {bubble.frozen && (
                  <div className="text-blue-600 text-xs mt-1">Frozen</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Bubble Button */}
        <div className="mb-4">
          <button
            onClick={() => setShowAddBubble(true)}
            className="px-4 py-2 bg-violet-600 text-white rounded-full shadow hover:bg-violet-700"
          >
            ➕ Add New Bubble
          </button>
        </div>

        {/* Track Spending Button */}
        <div className="mb-4">
          <button
            onClick={() => setShowTrackSpending(true)}
            className="px-4 py-2 bg-purple-500 text-white rounded-full shadow hover:bg-purple-600"
          >
            📊 Track Spending
          </button>
        </div>
      </div>

      {/* Add Bubble Modal */}
      {showAddBubble && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAddBubble(false)}
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold text-violet-700 mb-4">
              Add New Bubble
            </h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Label (e.g. Gym)"
                value={newBubble.label}
                onChange={(e) =>
                  setNewBubble({ ...newBubble, label: e.target.value })
                }
                className="flex-1 p-2 rounded-xl border border-gray-300 text-sm"
              />
              <input
                type="number"
                placeholder="Limit ₹"
                value={newBubble.amount}
                onChange={(e) =>
                  setNewBubble({ ...newBubble, amount: e.target.value })
                }
                className="w-24 p-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center mb-3">
              {emojiList.map((emoji) => (
                <button
                  key={emoji}
                  className={`text-xl rounded-full p-1 border ${
                    newBubble.emoji === emoji
                      ? "bg-violet-200 border-violet-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => setNewBubble({ ...newBubble, emoji })}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <button
              onClick={handleAddBubble}
              className="w-full bg-violet-600 text-white py-2 rounded-xl hover:bg-violet-700"
            >
              Add Bubble
            </button>
          </div>
        </div>
      )}

      {/* Smart Recommendations Modal */}
      {showModal && (
        <SmartRecommendation
          userBubbles={userBubbles}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Track Spending Modal */}
      {showTrackSpending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowTrackSpending(false)}
            >
              <X size={20} />
            </button>
            <TrackSpending onClose={() => setShowTrackSpending(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Bubble;
