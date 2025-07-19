import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase"; // make sure db is imported
import { collection, getDocs } from "firebase/firestore";
import TotalBalance from "./TotalBalance.jsx";
import BubbleQuickView from "./BubbleQuickView.jsx";
import AISuggestions from "./AISuggestions.jsx";
import RecentTransactions from "./RecentTransactions.jsx";

export default function HomeScreen() {
  const [displayName, setDisplayName] = useState("");
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setDisplayName(user.displayName || "User");

        // Fetch bubbles
        const querySnapshot = await getDocs(
          collection(db, "users", user.uid, "bubbles")
        );
        const fetchedBubbles = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBubbles(fetchedBubbles);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-1">
        Hey, Aman! <span className="wave">👋</span>
      </h1>
      <p className="text-sm text-gray-400 mb-6">
        Your bubbles are looking good today
      </p>
      <TotalBalance />
      <BubbleQuickView />
      <AISuggestions bubbles={bubbles} />
      <RecentTransactions />
    </>
  );
}
