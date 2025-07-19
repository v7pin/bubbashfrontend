import { useState } from "react";
import axios from "axios";

export const useGenAISuggestion = () => {
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const getSuggestion = async (userId, bubbles) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3001/api/genai/suggestion",
        {
          userId,
          bubbles,
        }
      );
      setSuggestion(res.data.suggestion);
    } catch (err) {
      console.error("Failed to get GenAI tip:", err);
    }
    setLoading(false);
  };

  return { suggestion, getSuggestion, loading };
};
