import React, { useState } from "react";
import { Bot, X } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);

  const handleChat = async () => {
    if (!userInput.trim()) return;

    setLoadingChat(true);
    setChatResponse("");

    // Fake AI response for now – replace with OpenAI / API call if needed
    setTimeout(() => {
      setChatResponse(
        `Here's a helpful tip based on your message: "${userInput}" 🤖💡`
      );
      setLoadingChat(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating icon to open the chatbot */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-purple-600 text-white p-3 rounded-full shadow-lg z-50 hover:bg-purple-700 transition"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}

      {/* Modal when open */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-[90%] max-w-md p-6 rounded-2xl shadow-2xl relative"
          >
            {/* Close chatbot button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>

            <h3 className="text-lg font-semibold mb-3 text-purple-700 flex items-center gap-2">
              <Bot className="w-5 h-5" />
              SmartBot Chat
            </h3>

            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              rows={3}
              placeholder="Ask me anything about your spending..."
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
                <div className="text-gray-500">Generating advice...</div>
              ) : (
                chatResponse && (
                  <div className="bg-purple-50 p-3 rounded-md border border-purple-200 mt-2">
                    {chatResponse}
                  </div>
                )
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
