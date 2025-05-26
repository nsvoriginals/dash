import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuestionCard } from "./QuestionCard";
import { useAtom } from "jotai";
import resumeAtom from '../../store/Resume' // Import the resumeAtom from your store
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

// Sample mock data for interview questions

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
  // Access and use resumeAtom from your store
  const [resumeData,setResumeData] = useAtom(resumeAtom);
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("mid");
  const [skills, setSkills] = useState("");
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

 if(resumeData=={}){
  setResumeData(localStorage.getItem("resumeData"))
 }

  // Auto-navigate option (commented out for now)
  /* 
  useEffect(() => {
    if (questions.length > 0) {
      navigate("/interview-questions", { state: { questions } });
    }
  }, [questions, navigate]);
  */


  // In the handleSubmit function, update the response handling:
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!role.trim()) {
    alert("Please enter a job role");
    return;
  }
  
  setLoading(true);
  
  try {
    // Prepare the data to send
    const requestData = {
      jobRole: role,
      experience: experience,
      topics: skills.trim() ? skills.split(',').map(item => item.trim()) : [], 
      resumeData: resumeData
    };

    const response = await fetch("http://localhost:8000/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    
    const data = await response.json();
    
    // Handle the response structure
    if (data.success && data.data?.interview_questions) {
      setQuestions(data.data.interview_questions);
      setSubmitted(true);
    } else {
      throw new Error("Invalid response format");
    }
    
  } catch (error) {
    console.error("Error generating questions:", error);
    alert("Failed to generate interview questions. Please try again.");
  } finally {
    setLoading(false);
  }
};

 
  const handleReset = () => {
    setSubmitted(false);
    setRole("");
    setSkills("");
    setExperience("mid");
    setQuestions([]);
  };

  // Loading state
  if (loading) return (
    <main className="flex-1 bg-[#131515] overflow-auto">
      <div className="flex items-center justify-center h-full text-white">
        <div className="animate-pulse text-xl">Generating interview questions...</div>
      </div>
    </main>
  );


  const exportToPDF = () => {
    const doc = new jsPDF();
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    
    const headerText = "Atlas AI";
    const headerWidth = doc.getTextWidth(headerText);
    const headerX = (doc.internal.pageSize.width - headerWidth) / 2;
    doc.text(headerText, headerX, 15);

    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    doc.rect(10, 20, pageWidth - 20, pageHeight - 30);

    doc.setFontSize(16);
    doc.text("Interview Questions", 14, 35);

    let yPosition = 45;
    const margin = 14;
    const lineHeight = 10;
    const maxWidth = 180;

    const wrapText = (text, x, y, maxWidth) => {
      let lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * lineHeight);
    };

    questions.forEach((question, index) => {
      yPosition = wrapText(`${index + 1}. ${question.question}`, margin, yPosition, maxWidth);
      yPosition = wrapText(`Expected Answer: ${question.expected_answer}`, margin, yPosition, maxWidth);
      yPosition = wrapText(`Difficulty: ${question.difficulty}`, margin, yPosition, maxWidth);
      yPosition = wrapText(`Type: ${question.type}`, margin, yPosition, maxWidth);
      yPosition = wrapText(`Skill Tested: ${question.skill_tested}`, margin, yPosition, maxWidth);
      yPosition += 10;

      if (yPosition > pageHeight - 20) {
        doc.addPage();
        doc.setFontSize(24);
        doc.text(headerText, headerX, 15);
        doc.rect(10, 20, pageWidth - 20, pageHeight - 30);
        doc.setFontSize(16);
        doc.text("Interview Questions", 14, 35);
        yPosition = 45;
      }
    });

    doc.save("interview_questions.pdf");
  };


  // Helper function to extract resume info for display (optional)
  const getResumeInfo = () => {
    const basicInfo = [];
    
    if (resumeData.basics && resumeData.basics.name) 
      basicInfo.push(`Name: ${resumeData.basics.name}`);
    
    if (resumeData.basics && resumeData.basics.label) 
      basicInfo.push(`Title: ${resumeData.basics.label}`);
    
    const skillsList = resumeData.skills?.map(skill => skill.name).join(", ") || "";
    if (skillsList) basicInfo.push(`Skills: ${skillsList}`);
    
    return basicInfo;
  };

  const resumeInfo = getResumeInfo();
  const hasResumeData = resumeInfo.length > 0;

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
                
                {/* Resume Data Alert/Info */}
                {hasResumeData && (
                  <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4 mb-6">
                    <h3 className="text-[#00b4d8] font-medium mb-2">Resume Data Detected</h3>
                    <div className="text-gray-300 text-sm">
                      {resumeInfo.map((info, index) => (
                        <div key={index} className="mb-1">{info}</div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      This data will be used to generate more personalized questions.
                    </div>
                  </div>
                )}
                
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
                              ? 'bg-[#00b4d8] text-white' 
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
                    <label className="block text-white font-medium">Special Skills/Topics (Optional)</label>
                    <textarea
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full h-32 bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      placeholder="e.g. React, TypeScript, Blockchain, Smart Contracts (comma separated)"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    text="Generate Questions" 
                    onClick={handleSubmit}
                    className="w-full py-3 bg-[#00b4d8] text-white hover:bg-indigo-700"
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
  <motion.div key={question.id || index} className="mb-4">
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

                <div className="flex mt-6 space-x-4">
                  <Button
                    onClick={exportToPDF}
                    text="Export as PDF"
                    className="flex-1 bg-[#00b4d8] text-white p-3 rounded-lg hover:bg-indigo-700"
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}