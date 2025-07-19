import React, { useState } from "react";
import BottomNav from "./components/BottomNav.jsx";

import HomeScreen from "./components/HomeScreen.jsx";
import MyBubbles from "./components/MyBubbles.jsx";
import ScanPay from "./components/ScanPay.jsx";
import Stats from "./components/Stats.jsx";
import Profile from "./components/Profile.jsx";

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Home":
        return <HomeScreen />;
      case "My Bubbles":
        return <MyBubbles />;
      case "Scan & Pay":
        return <ScanPay />;
      case "Stats":
        return <Stats />;
      case "Profile":
        return <Profile />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white pb-20 px-4 pt-6 font-sans">
      {renderActiveTab()}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <BottomNav onTabChange={(label) => setActiveTab(label)} />
      </div>
    </div>
  );
}
