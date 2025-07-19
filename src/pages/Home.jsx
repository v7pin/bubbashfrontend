// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-purple-200">
      <div className="bg-white bg-opacity-50 shadow-2xl rounded-3xl px-10 py-12 text-center max-w-md w-full">
        <h1 className="text-5xl font-extrabold  text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-500 to-indigo-500 mb-3 animate-pulse">
          Money Bubble
        </h1>
        <p className="text-gray-700 text-md mb-8">Smart UPI for Gen Z 💸</p>

        <button
          onClick={() => navigate("/scan")}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl shadow-md transition mb-4"
        >
          Scan Now
        </button>

        <button
          onClick={() => navigate("/bubble")}
          className="w-full bg-white text-purple-700 border border-purple-400 hover:bg-purple-100 font-semibold py-3 rounded-xl shadow-sm transition mb-4"
        >
          My Bubble
        </button>

        <button
          onClick={() => navigate("/track")}
          className="w-full bg-purple-800 hover:bg-purple-900 text-white font-semibold py-3 rounded-xl shadow-lg transition"
        >
          Track Spending
        </button>
      </div>
    </div>
  );
}
