import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // <-- add this import

const firebaseConfig = {
  apiKey: "AIzaSyA6ZlfuE8S1fOsa8Bl0PvQdoDhmaYGcU4g",
  authDomain: "bubblemoney-6b1d4.firebaseapp.com",
  projectId: "bubblemoney-6b1d4",
  storageBucket: "bubblemoney-6b1d4.firebasestorage.app",
  messagingSenderId: "319131763402",
  appId: "1:319131763402:web:40bb837500d24096282a33",
  measurementId: "G-5N2EWP6EXB",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // <-- export auth instance
