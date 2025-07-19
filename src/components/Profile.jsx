import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) navigate("/login");
      else {
        setUser(currentUser);
        setName(currentUser.displayName || "");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleSave = async () => {
    if (auth.currentUser && name.trim() !== "") {
      try {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        setUser(auth.currentUser); // re-trigger React update
        setEditing(false);
      } catch (error) {
        console.error("Profile update failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-start pt-10 pb-12 px-4">
      {/* Logo and Welcome */}
      <div className="flex flex-col items-center mb-4 -mt-6">
        <img
          src={logo}
          alt="Bubbash Logo"
          className="w-52 h-52 drop-shadow-xl"
        />
        <h1 className="text-3xl font-bold text-white mt-2">
          Welcome to <span className="text-pink-500">Bubbash</span>
        </h1>
      </div>

      {/* Profile Card */}
      <div className="bg-[#1e1e1e] rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl border border-gray-800">
        <h2 className="text-xl font-semibold mb-1">👤 Your Profile</h2>
        <p className="text-gray-400 text-sm mb-6">
          Manage your personal info and settings
        </p>

        {/* Avatar and Info */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={
              user?.photoURL ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`
            }
            alt="profile"
            className="w-28 h-28 rounded-full border-4 border-pink-500 shadow-lg"
          />
          <div>
            {editing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter your name"
              />
            ) : (
              <h3 className="text-lg font-medium">
                {user?.displayName || "User"}
              </h3>
            )}
            <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 space-y-3">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="w-full bg-green-600 hover:bg-green-700 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                💾 Save Changes
              </button>
              <button
                onClick={() => {
                  setName(user?.displayName || "");
                  setEditing(false);
                }}
                className="w-full bg-gray-700 hover:bg-gray-600 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                ❌ Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="w-full bg-pink-600 hover:bg-pink-700 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              ✏️ Edit Profile
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
