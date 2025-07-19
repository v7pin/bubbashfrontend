import { useState } from "react";
import axios from "axios";

export default function useGeminiAI() {
  const [loading, setLoading] = useState(false);

  const getGeminiResponse = async (prompt) => {
    setLoading(true);
    try {
      const res = await axios.post("https://your-gemini-api.com/generate", {
        prompt,
      });
      return res.data.result || "No response";
    } catch (err) {
      console.error(err);
      return "Could not generate insights.";
    } finally {
      setLoading(false);
    }
  };

  return { getGeminiResponse, loading };
}
