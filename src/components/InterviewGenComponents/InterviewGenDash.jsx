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

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
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


  // Helper function to extract resume info for display (optional)
  const getResumeInfo = () => {
    const basicInfo = [];
    
    if (resumeData.basics && resumeData.basics.name) 
      basicInfo.push(`Name: ${resumeData.basics.name}`);
    
    if (resumeData.basics && resumeData.basics.label) 
      basicInfo.push(`Title: ${resumeData.basics.label}`);
    
    const skillsList = resumeData.skills?.map(skill => skill.name).join(", ") || "";
    if (skillsList) basicInfo.push(`