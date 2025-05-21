import React from "react";
import { motion } from "framer-motion";

export const QuestionCard = ({ no, question, answer, difficulty, type, skills }) => {
  const [expanded, setExpanded] = React.useState(false);
const difficultyColor = 
  (difficulty?.toLowerCase() === "easy") ? "bg-green-500" :
  (difficulty?.toLowerCase() === "medium") ? "bg-yellow-500" :
  (difficulty?.toLowerCase() === "hard") ? "bg-red-500" :
  "bg-gray-500";

const typeColor =
  (type?.toLowerCase() === "technical") ? "bg-indigo-500" :
  (type?.toLowerCase() === "behavioral") ? "bg-purple-500" :
  (type?.toLowerCase() === "system design") ? "bg-blue-500" :
  "bg-gray-500";

  return (
    <motion.div
      layout
      className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg"
    >
      {/* Question Header */}
      <div className="p-5 border-b border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-semibold text-white">Question {no}</h3>
          <div className="flex space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${difficultyColor}`}>
              {difficulty}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${typeColor}`}>
              {type}
            </span>
          </div>
        </div>
        <p className="text-gray-200">{question}</p>
      </div>

      {/* Skills Tested */}
      <div className="px-5 py-3 bg-[#252525] border-b border-gray-700">
        <div className="flex items-center">
          <span className="text-sm text-gray-400 mr-2">Skills Tested:</span>
          <span className="px-2 py-1 bg-teal-600 text-xs font-medium rounded-full text-white">
            {skills}
          </span>
        </div>
      </div>

      {/* Toggle Answer Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-3 text-left flex justify-between items-center hover:bg-[#2a2a2a] transition-colors"
      >
        <span className="text-gray-300 font-medium">
          {expanded ? "Hide Answer" : "Show Expected Answer"}
        </span>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-400"
          animate={{ rotate: expanded ? 180 : 0 }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </motion.svg>
      </button>

      {/* Answer Content */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="p-5 bg-[#252525] text-gray-300">
          <p>{answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};