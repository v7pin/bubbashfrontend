// src/pages/Scan.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";

import ScanStart from "../components/ScanStart";
import ScanPayment from "../components/ScanPayment";

const Scan = () => {
  const navigate = useNavigate();
  const [scanned, setScanned] = useState(false);
  const [bubbles, setBubbles] = useState([]);
  const [amount, setAmount] = useState("");
  const [selectedBubble, setSelectedBubble] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [paidBubble, setPaidBubble] = useState(null);

  useEffect(() => {
    const fetchBubbles = async () => {
      const snapshot = await getDocs(collection(db, "bubbles"));
      const bubbleList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBubbles(bubbleList);
    };
    fetchBubbles();
  }, []);

  const handleScan = () => {
    setScanned("loading");
    setTimeout(() => {
      setScanned("done");
    }, 2000);
  };

  const handlePayment = async () => {
    if (!amount || !selectedBubble) {
      return alert("Please enter amount and select a bubble");
    }

    const updatedBubbles = await Promise.all(
      bubbles.map(async (bubble) => {
        if (bubble.name === selectedBubble) {
          const remaining = bubble.amount - Number(amount);
          if (remaining < 0) {
            alert("Insufficient amount in bubble");
            return bubble;
          }

          const bubbleRef = doc(db, "bubbles", bubble.id);
          await updateDoc(bubbleRef, { amount: remaining });

          setPaidBubble({ ...bubble, amount: Number(amount) });
          setShowSuccess(true);
          return { ...bubble, amount: remaining };
        }
        return bubble;
      })
    );

    setBubbles(updatedBubbles);
    setAmount("");
    setSelectedBubble("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-violet-200 to-purple-300 p-6 font-['Poppins']">
      <div className="bg-white shadow-2xl rounded-3xl p-6 w-full max-w-md text-center relative overflow-hidden">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 text-violet-700 hover:underline flex items-center"
        >
          <ArrowLeft className="mr-1" size={20} /> Back
        </button>

        <AnimatePresence>
          {!scanned && scanned !== "loading" && (
            <ScanStart onScan={handleScan} />
          )}

          {scanned === "loading" && (
            <motion.div
              key="loading"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-12"
            >
              <div className="h-24 w-24 rounded-full border-4 border-dashed border-purple-500 animate-spin mb-4"></div>
              <p className="text-purple-700 font-medium">Scanning QR...</p>
            </motion.div>
          )}

          {scanned === "done" && !showSuccess && (
            <ScanPayment
              bubbles={bubbles}
              selectedBubble={selectedBubble}
              amount={amount}
              onBubbleSelect={setSelectedBubble}
              onAmountChange={setAmount}
              onPay={handlePayment}
            />
          )}

          {showSuccess && paidBubble && (
            <motion.div
              key="success"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-12"
            >
              <CheckCircle
                size={64}
                className="text-green-500 mb-4 animate-bounce"
              />
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Payment Successful!
              </h2>
              <p className="text-md text-gray-700 mb-2">
                ₹{paidBubble.amount} deducted from{" "}
                <strong>{paidBubble.name}</strong> bubble.
              </p>
              <motion.div
                className="mt-6 p-6 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white shadow-xl text-xl font-semibold"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1.1 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 1,
                }}
              >
                🎉 Bubble Updated!
              </motion.div>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setPaidBubble(null);
                  setScanned(false);
                }}
                className="mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-xl"
              >
                Make Another Payment
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Scan;
