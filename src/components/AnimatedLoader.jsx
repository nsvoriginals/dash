import React from "react";
import { motion } from "framer-motion";

export default function AnimatedLoader({ text = "Loading...", size = 48, color = "#00b4d8" }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <motion.div
        className="flex items-center justify-center"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="6"
          />
          <motion.circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray="100"
            strokeDashoffset="60"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 60 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
      {text && (
        <div className="mt-4 text-white text-lg font-medium animate-pulse">{text}</div>
      )}
    </div>
  );
} 