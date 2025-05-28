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
  const [resumeData, setResumeData] = useAtom(resumeAtom);
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("mid");
  const [skills, setSkills] = useState("");
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  // Initialize resumeData from localStorage if empty
  useEffect(() => {
    if (!resumeData || Object.keys(resumeData).length === 0) {
      const savedData = localStorage.getItem("resumeData");
      if (savedData) {
        try {
          setResumeData(JSON.parse(savedData));
        } catch (error) {
          console.error("Error parsing resume data:", error);
        }
      }
    }
  }, [resumeData, setResumeData]);

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

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      credentials: 'include',
      mode: 'cors',
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


  // Helper function to extract resume info for display
  const getResumeInfo = () => {
    const basicInfo = [];
    
    if (resumeData?.basics?.name) {
      basicInfo.push(`Name: ${resumeData.basics.name}`);
    }
    
    if (resumeData?.basics?.label) {
      basicInfo.push(`Title: ${resumeData.basics.label}`);
    }
    
    const skillsList = resumeData?.skills?.map(skill => skill.name).join(", ") || "";
    if (skillsList) {
      basicInfo.push(`Skills: ${skillsList}`);
    }
    
    return basicInfo.join("\n");
  };

  return (
    <main className="flex-1 bg-[#131515] overflow-auto">
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
                  Enter job details to generate relevant interview questions.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Job Role */}
                  <div className="space-y-2">
                    <label htmlFor="role" className="block text-white font-medium">
                      Job Role
                    </label>
                    <input
                      type="text"
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-[#2b2b2b] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00b4d8] focus:outline-none"
                      placeholder="e.g., Software Engineer"
                    />
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-2">
                    <label htmlFor="experience" className="block text-white font-medium">
                      Experience Level
                    </label>
                    <select
                      id="experience"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full bg-[#2b2b2b] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00b4d8] focus:outline-none"
                    >
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                    </select>
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <label htmlFor="skills" className="block text-white font-medium">
                      Skills (comma-separated)
                    </label>
                    <textarea
                      id="skills"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full bg-[#2b2b2b] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00b4d8] focus:outline-none"
                      placeholder="e.g., JavaScript, React, Node.js"
                      rows="3"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    text="Generate Questions"
                    type="submit"
                    className="w-full bg-[#00b4d8] text-white hover:bg-[#00b4d8]/90"
                    disabled={!role.trim()}
                  />
                </form>
              </motion.div>
            ) : (
              // RESULTS DISPLAY
              <>
                <div className="flex justify-between items-center mb-8">
                  <Button
                    text="New Questions"
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
                  <Button
                    text="Export PDF"
                    onClick={exportToPDF}
                    className="bg-[#00b4d8] text-white hover:bg-[#00b4d8]/90"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {questions.map((question, index) => (
                    <QuestionCard
                      key={index}
                      question={question}
                      index={index + 1}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}