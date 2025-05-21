import React, { useState } from "react";
import { motion } from "framer-motion";

// Simple Button component
const Button = ({ text, onClick, className = '', disabled = false }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors";
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${disabledStyles} ${className}`}
    >
      {text}
    </button>
  );
};

export default function ProfileDashboard() {
  const [name, setName] = useState("John Doe");
  const [isEditing, setIsEditing] = useState(false);
  const [resume, setResume] = useState(null);
  const [resumeDetails, setResumeDetails] = useState("No resume uploaded.");

  const handleResumeChange = (e) => {
    if (e.target.files[0]) {
      setResume(e.target.files[0]);
      setResumeDetails("Uploaded: " + e.target.files[0].name);
    }
  };

  return (
    <main className="flex-1 bg-[#131515] overflow-auto min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg max-w-2xl mx-auto mt-10"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
          Profile Dashboard
        </h1>

        <div className="mb-6">
          <label className="block text-white font-medium">Name</label>
          {isEditing ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          ) : (
            <p className="text-white">{name}</p>
          )}
          <Button 
            text={isEditing ? "Save" : "Edit"}
            onClick={() => setIsEditing(!isEditing)}
            className="mt-2 bg-[#00b4d8]  text-white hover:bg-[#00b4d8] "
          />
        </div>

        <div className="mb-6">
          <label className="block text-white font-medium">Resume</label>
          <p className="text-white">{resumeDetails}</p>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeChange}
            className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none mt-2"
          />
        </div>
      </motion.div>
    </main>
  );
}