import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import redBubble from "../assets/red.png";
import yellowBubble from "../assets/yellow.png";
import greenBubble from "../assets/green.png";
import { db } from "../firebase";
import { getDocs, collection } from "firebase/firestore";

const ScanPayment = () => {
  const navigate = useNavigate();
  const [userBubbles, setUserBubbles] = useState([]);
  const [selectedBubbleId, setSelectedBubbleId] = useState(null);
  const [amount, setAmount] = useState("");

  const fetchBubbles = async () => {
    const snapshot = await getDocs(collection(db, "bubbles"));
    const bubbles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setUserBubbles(bubbles);
  };

  useEffect(() => {
    fetchBubbles();
  }, []);

  const getBubbleImage = (amount, spent) => {
    const percentLeft = ((amount - spent) / amount) * 100;
    if (percentLeft < 30) return redBubble;
    if (percentLeft <= 70) return yellowBubble;
    return greenBubble;
  };

  const handlePayment = () => {
    if (!selectedBubbleId || !amount) return;
    alert(`Paid ₹${amount} using bubble.`);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-violet-200 to-purple-300 p-6 font-['Poppins']">
      <div className="bg-white shadow-2xl rounded-3xl p-6 w-full max-w-md text-center">
        <button
          onClick={() => navigate("/")}
          className="flex items-center mb-4 text-violet-700 hover:underline"
        >
          <ArrowLeft className="mr-1" size={20} /> Back
        </button>

        <h1 className="text-2xl font-bold text-violet-800 mb-4">
          Choose Bubble & Pay
        </h1>

        <div className="grid grid-cols-2 gap-6 justify-items-center mb-6">
          {userBubbles.map((bubble) => {
            const bubbleImg = getBubbleImage(bubble.amount, bubble.spent);

            return (
              <div
                key={bubble.id}
                className={`relative w-28 h-28 cursor-pointer border-2 rounded-2xl transition-all duration-200 ${
                  selectedBubbleId === bubble.id
                    ? "border-violet-600"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedBubbleId(bubble.id)}
              >
                <img
                  src={bubbleImg}
                  alt="Bubble"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-1">
                  <div className="text-lg">{bubble.emoji}</div>
                  <div className="font-bold text-[11px] text-gray-800 truncate">
                    {bubble.label}
                  </div>
                  <div className="text-[10px] text-gray-700">
                    ₹{bubble.spent} / ₹{bubble.amount}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <input
          type="number"
          placeholder="Enter amount to pay"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-4 p-2 rounded-xl border border-gray-300 text-sm"
        />

        <button
          onClick={handlePayment}
          className="w-full bg-violet-600 text-white py-2 rounded-xl hover:bg-violet-700"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default ScanPayment;
