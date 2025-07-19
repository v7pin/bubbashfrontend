import React from "react";
import { motion } from "framer-motion";
import pinkImg from "../assets/pinkb.png";
import blueImg from "../assets/blueb.png";
import purpleImg from "../assets/purpleb.png";
import greenImg from "../assets/greenb.png";
import yellowImg from "../assets/yellowb.png";
import orangeImg from "../assets/orangeb.png";

const colorImages = {
  pink: pinkImg,
  blue: blueImg,
  purple: purpleImg,
  green: greenImg,
  yellow: yellowImg,
  orange: orangeImg,
};

export default function TransferSuccess({ fromBubble, toBubble, amount }) {
  const Bubble = ({ bubble, animateProps }) => (
    <motion.div
      className="relative w-20 h-20 rounded-full bg-cover bg-center flex items-center justify-center text-white text-center text-xs font-semibold shadow-lg"
      style={{
        backgroundImage: `url(${colorImages[bubble.color]})`,
      }}
      animate={animateProps}
      transition={{ duration: 1, repeat: Infinity }}
    >
      <div className="flex flex-col items-center justify-center leading-tight">
        <div className="text-xl">{bubble.emoji}</div>
        <div className="text-[10px] mt-0.5 px-1 truncate max-w-[60px]">
          {bubble.name}
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80 rounded-2xl text-white"
    >
      <div className="flex items-center gap-10">
        {/* From Bubble */}
        <Bubble
          bubble={fromBubble}
          animateProps={{ scale: [1, 0.9, 1], opacity: [1, 0.6, 1] }}
        />

        {/* Transfer Amount */}
        <motion.div
          className="text-2xl font-bold text-green-400"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ₹{amount}
        </motion.div>

        {/* To Bubble */}
        <Bubble
          bubble={toBubble}
          animateProps={{ scale: [0.9, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        />
      </div>

      <p className="mt-5 text-green-300 font-medium text-sm">
        Funds transferred successfully!
      </p>
    </motion.div>
  );
}
