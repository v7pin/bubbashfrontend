import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Sparkles, Bot, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import ChatbotWidget from "./ChatbotWidget";

export default function SmartRecommend() {
  const [bubbles, setBubbles] = useState([]);
  const [smartTips, setSmartTips] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);

  useEffect(() => {
    const fetchBubbles = async () => {
      const querySnapshot = await getDocs(collection(db, "bubbles"));
      const fetched = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() });
      });
      setBubbles(fetched);
      generateSmartTips(fetched);
    };

    fetchBubbles();
  }, []);

  const generateSmartTips = (bubbles) => {
    const tips = [];
    const sorted = [...bubbles].sort((a, b) => a.remaining - b.remaining);

    for (let bubble of sorted) {
      const usage = 1 - bubble.remaining / bubble.limit;

      if (usage > 0.7) {
        tips.push(
          `⚠️ Over 70% of your ${bubble.name} budget is used. Consider pausing spend here.`
        );
      } else if (bubble.remaining / bubble.limit > 0.9) {
        tips.push(
          `💡 You have over 90% of your ${bubble.name} budget left. Allocate it wisely!`
        );
      }
    }

    setSmartTips(tips);
  };

  const handleChat = async () => {
    if (!userInput.trim()) return;

    setLoadingChat(true);
    setChatResponse("");

    const context = bubbles
      .map((b) => `${b.name}: ₹${b.remaining} left of ₹${b.limit}`)
      .join(", ");

    const prompt = `Based on this spending data: ${context}, the user asked: "${userInput}". Give a helpful and friendly financial recommendation.`;

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );

      const data = await response.json();
      const message = data.choices?.[0]?.message?.content;
      setChatResponse(message || "No helpful advice found.");
    } catch (err) {
      console.error(err);
      setChatResponse("⚠️ Sorry, something went wrong. Try again later.");
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <motion.h2
        className="text-3xl font-bold text-center flex items-center justify-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Sparkles className="text-purple-600 w-6 h-6" />
        Smart Recommendations
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Tips Panel */}
        <motion.div
          className="bg-purple-100 rounded-2xl p-5 shadow-xl border border-purple-200"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-purple-900 mb-4">
            💡 Personalized Tips
          </h3>
          {smartTips.length === 0 ? (
            <p className="text-gray-600">Start spending to unlock insights!</p>
          ) : (
            <ul className="space-y-3 list-disc list-inside text-sm text-purple-900">
              {smartTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Chat Panel */}
        <motion.div
          className="bg-white rounded-2xl p-5 shadow-xl border border-purple-300"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-purple-700">
            <Bot className="w-5 h-5" /> Ask the SmartBot
          </h3>

          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            rows={3}
            placeholder="e.g. How can I manage my subscriptions?"
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-purple-500 text-sm mb-3"
          />

          <button
            onClick={handleChat}
            disabled={loadingChat}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loadingChat ? "Thinking..." : "Ask Bot"}
          </button>

          <div className="mt-4 min-h-[80px] text-sm">
            {loadingChat ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="animate-spin w-5 h-5" />
                Generating advice...
              </div>
            ) : (
              chatResponse && (
                <motion.div
                  className="bg-purple-50 p-3 rounded-md border border-purple-200 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {chatResponse}
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
