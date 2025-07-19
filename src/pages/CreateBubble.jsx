import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateBubble = () => {
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Bubble ${name} with limit ₹${limit} created!`);
    navigate("/track");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-6">
      <h2 className="text-3xl font-semibold text-purple-700 mb-6">
        Create Bubble
      </h2>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="text"
          placeholder="Bubble Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-purple-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <input
          type="number"
          placeholder="Spending Limit (₹)"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="w-full px-4 py-2 border border-purple-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <button
          type="submit"
          className="w-full py-3 rounded-full bg-purple-500 text-white font-bold hover:bg-purple-600 transition"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateBubble;
