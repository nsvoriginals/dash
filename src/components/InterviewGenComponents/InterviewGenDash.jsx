import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuestionCard } from "./QuestionCard";

// Sample mock data for interview questions
const mockQuestions = [
  {
    question: "What are the key differences between React hooks and class components?",
    expected_answer: "React hooks allow functional components to use state and lifecycle features previously only available in class components. They're more concise, avoid the complexity of 'this', enable better code reuse through custom hooks, and make related logic easier to keep together.",
    difficulty: "Medium",
    type: "Technical",
    skill_tested: "React"
  },
  {
    question: "Explain how blockchain consensus mechanisms work and compare Proof of Work vs Proof of Stake.",
    expected_answer: "Consensus mechanisms are protocols that ensure all nodes in a blockchain network agree on the current state. Proof of Work requires miners to solve complex puzzles, consuming significant energy but providing strong security. Proof of Stake selects validators based on the amount of cryptocurrency they stake, which is more energy-efficient but potentially less decentralized.",
    difficulty: "Hard",
    type: "Technical",
    skill_tested: "Blockchain"
  },
  {
    question: "Describe a challenging project you worked on and how you overcame obstacles.",
    expected_answer: "Look for answers that demonstrate problem-solving, resilience, teamwork, and project management skills. Candidates should explain the challenge, their approach, actions taken, and results achieved.",
    difficulty: "Medium",
    type: "Behavioral",
    skill_tested: "Problem Solving"
  },
  {
    question: "How would you design a distributed system that needs to handle millions of concurrent users?",
    expected_answer: "Good answers should cover scalability approaches (horizontal vs vertical), load balancing, caching strategies, database sharding, microservices architecture, fault tolerance, and consistency models like eventual consistency vs strong consistency.",
    difficulty: "Hard",
    type: "System Design",
    skill_tested: "Distributed Systems"
  },
  {
    question: "What strategies do you use to stay updated with rapidly evolving technologies in your field?",
    expected_answer: "Look for mentions of following tech blogs/newsletters, participating in online communities, contributing to open source, attending conferences/meetups, taking courses, building side projects, and having a systematic approach to continuous learning.",
    difficulty: "Easy",
    type: "Behavioral",
    skill_tested: "Continuous Learning"
  }
];

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

export default function InterviewQuestionsGenerator() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("mid");
  const [skills, setSkills] = useState("");
  const [questions, setQuestions] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!role.trim()) {
      alert("Please enter a job role");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, you would make an API call to generate questions based on inputs
      setQuestions(mockQuestions);
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  const handleReset = () => {
    setSubmitted(false);
    setRole("");
    setSkills("");
    setExperience("mid");
    setQuestions([]);
  };

  const exportToPDF = () => {
    // Mock function - in a real app this would use jsPDF or another library
    alert("PDF export functionality would be implemented here");
  };

  // Loading state
  if (loading) return (
    <main className="flex-1 bg-[#131515] overflow-auto">
      <div className="flex items-center justify-center h-full text-white">
        <div className="animate-pulse text-xl">Generating interview questions...</div>
      </div>
    </main>
  );

  return (
    <main className="flex-1 bg-[#131515] overflow-auto min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={submitted ? "results" : "form"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full p-6"
        >
          <div className="max-w-6xl mx-auto">
            {!submitted ? (
              // INPUT FORM
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg max-w-2xl mx-auto mt-10"
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
                  Interview Questions Generator
                </h1>
                <p className="text-gray-300 mb-8 text-center">
                  Enter job details to generate tailored interview questions for your next hire.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Job Role */}
                  <div className="space-y-2">
                    <label className="block text-white font-medium">Job Role</label>
                    <input
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      placeholder="e.g. Frontend Developer, Blockchain Engineer"
                    />
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-2">
                    <label className="block text-white font-medium">Experience Level</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['junior', 'mid', 'senior'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setExperience(level)}
                          className={`py-2 rounded-lg transition-colors ${
                            experience === level 
                              ? 'bg-[#00b4d8]  text-white' 
                              : 'bg-[#2b2b2b] text-gray-300 hover:bg-[#3b3b3b]'
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Special Skills */}
                  <div className="space-y-2">
                    <label className="block text-white font-medium">Special Skills (Optional)</label>
                    <textarea
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full h-32 bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      placeholder="e.g. React, TypeScript, Blockchain, Smart Contracts"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    text="Generate Questions" 
                    onClick={handleSubmit}
                    className="w-full py-3 bg-[#00b4d8]  text-white hover:bg-indigo-700"
                    disabled={!role.trim()}
                  />
                </form>
              </motion.div>
            ) : (
              // RESULTS DISPLAY
              <>
                <div className="flex justify-between items-center mb-8">
                  <Button
                    text="Generate New Questions"
                    onClick={handleReset}
                    className="bg-gray-700 text-white hover:bg-gray-600"
                  />
                  <motion.h2 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl font-bold text-white"
                  >
                    Interview Questions
                  </motion.h2>
                  <div className="w-24" />
                </div>

                <motion.div
                  className="max-h-[70vh] overflow-y-auto mt-4 pb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {questions.map((question, index) => (
                    <motion.div
                      key={index}
                      className="mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 50 }}
                    >
                      <QuestionCard
                        no={index + 1}
                        question={question.question}
                        answer={question.expected_answer}
                        difficulty={question.difficulty}
                        type={question.type}
                        skills={question.skill_tested}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                <Button
                  onClick={exportToPDF}
                  text="Export as PDF"
                  className="w-full  text-white p-2 rounded-lg hover:bg-indigo-700 mt-4"
                />
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}