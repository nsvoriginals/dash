import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { atsAtom } from "../../store/AtsStore";
import axios from 'axios';
import AnimatedLoader from "../AnimatedLoader";

// CircularProgressbar component (simplified for this example)
const CircularProgressbar = ({ value, text, styles }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke={styles.trail.stroke}
          strokeWidth="5"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke={styles.path.stroke}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap={styles.path.strokeLinecap}
          transform="rotate(-90 50 50)"
        />
        <text
          x="50"
          y="50"
          fill={styles.text.fill}
          fontSize={styles.text.fontSize}
          fontWeight={styles.text.fontWeight}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {text}
        </text>
      </svg>
    </div>
  );
};

export default function ATSDash() {
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [atsData, setAtsData] = useAtom(atsAtom);

  // Simple Button component
  const Button = ({ text, onClick, variant = 'primary', className = '', disabled = false }) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors";
    const variantStyles = variant === 'secondary' 
      ? "bg-gray-700 text-white hover:bg-gray-600" 
      : "bg-[#00b4d8] text-white hover:bg-[#00b4d8]";
    const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";
    
    return (
      <button 
        onClick={onClick}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles} ${disabledStyles} ${className}`}
        type={onClick === handleSubmit ? "submit" : "button"}
      >
        {text}
      </button>
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setResumeFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!jobDescription.trim() || !resumeFile) {
      alert("Please enter a job description and upload your resume");
      return;
    }

    setLoading(true);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const formData = new FormData();
    formData.append("file", resumeFile);
    formData.append("job_description", jobDescription);

    try {
      const response = await axios.post(`${backendUrl}/ats/ats-details`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setAtsData(response.data.data);
        setPercentage(response.data.data.score || 0);
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting your data.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setJobDescription("");
    setResumeFile(null);
    setResumeFileName("");
    setPercentage(0);
  };

  // Loading state
  if (loading) return (
    <AnimatedLoader text="Analyzing your resume against job requirements..." size={64} />
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
                  ATS Resume Analyzer
                </h1>
                <p className="text-gray-300 mb-8 text-center">
                  Upload your resume and paste the job description to see how well your resume matches the requirements.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Resume Upload */}
                  <div className="space-y-2">
                    <label htmlFor="resume-upload" className="block text-white font-medium">
                      Upload Resume
                    </label>
                    <div className="flex items-center">
                      <input 
                        type="file" 
                        id="resume-upload"
                        accept=".pdf,.doc,.docx" 
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-400
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-medium
                          file:bg-[#00b4d8] file:text-white
                          hover:file:bg-[#00a0c0]
                          cursor-pointer" 
                      />
                    </div>
                    {resumeFileName && (
                      <p className="mt-2 text-sm text-[#00b4d8]">{resumeFileName}</p>
                    )}
                  </div>

                  {/* Job Description */}
                  <div className="space-y-2">
                    <label htmlFor="job-description" className="block text-white font-medium">
                      Job Description
                    </label>
                    <textarea
                      id="job-description"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="w-full min-h-[12rem] bg-[#2b2b2b] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00b4d8] focus:outline-none text-base"
                      placeholder="Paste the job description here..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={!jobDescription.trim() || !resumeFile}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      !jobDescription.trim() || !resumeFile
                        ? "opacity-50 cursor-not-allowed bg-gray-700 text-white"
                        : "bg-[#00b4d8] text-white hover:bg-[#00a0c0]"
                    }`}
                  >
                    Analyze Resume
                  </button>
                </form>
              </motion.div>
            ) : (
              // RESULTS DISPLAY
              <>
                <div className="flex justify-between items-center mb-8">
                  <Button
                    text="New Analysis"
                    onClick={handleReset}
                    variant="secondary"
                  />
                  <motion.h2 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl font-bold text-white"
                  >
                    ATS Analysis Results
                  </motion.h2>
                  <div className="w-24" />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Score Card */}
                  <div className="lg:col-span-1">
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#1e1e1e] rounded-xl p-6 h-full"
                    >
                      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
                        Resume Analysis
                      </h1>
                      
                      <div className="mx-auto w-48 h-48 mb-6">
                        <CircularProgressbar
                          value={atsData.ats_score}
                          text={`${atsData.ats_score}%`}
                          styles={{
                            path: {
                              stroke: `rgba(0, 180, 216, ${atsData.ats_score / 100})`,
                              strokeLinecap: 'round'
                            },
                            trail: {
                              stroke: '#2b2b2b'
                            },
                            text: {
                              fill: '#ffffff',
                              fontSize: '24px',
                              fontWeight: 'bold'
                            }
                          }}
                        />
                      </div>

                      <div className="space-y-4 text-center">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white">
                          {atsData.ats_score >= 70 ? 'Strong Match!' : 'Needs Optimization'}
                        </h2>
                        <p className="text-gray-300 text-base max-w-md mx-auto">
                          {atsData.resume_summary}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Column - Two Cards */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Improvements Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-[#1e1e1e] rounded-xl shadow-lg p-6"
                    >
                      <h2 className="text-2xl font-bold text-white mb-6">
                        Recommended Improvements
                      </h2>
                      <ul className="space-y-3">
                        {atsData.improvements.map((item, idx) => (
                          <motion.li 
                            key={idx}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 + (idx * 0.1) }}
                            className="flex items-start p-3 hover:bg-[#2b2b2b] rounded-lg transition-colors"
                          >
                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#00b4d8] flex items-center justify-center mr-3 mt-1" />
                            <p className="text-gray-300 text-sm sm:text-base">{item}</p>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    {/* Keywords Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-[#1e1e1e] rounded-xl shadow-lg p-6"
                    >
                      <h2 className="text-2xl font-bold text-white mb-6">
                        Missing Keywords
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {atsData.missing_keywords.map((skill, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5 + (idx * 0.05) }}
                            className={`px-3 py-1.5 rounded-full text-sm ${
                              idx % 3 === 0 ? 'bg-[#00b4d8] text-white' :
                              idx % 3 === 1 ? 'bg-[#00b4d8]/80 text-white' :
                              'bg-[#00b4d8]/60 text-white'
                            } font-medium`}
                          >
                            {skill}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* CTA Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-[#00b4d8] rounded-xl p-6 text-white"
                    >
                      <h2 className="text-2xl font-bold mb-4 text-center">
                        Ready to optimize your resume?
                      </h2>
                      <p className="text-white/90 mb-6 text-center">
                        Implement these suggestions to increase your chances of passing automated screening systems.
                      </p>
                      <div className="flex justify-center">
                        <Button
                          text="Download Optimized Resume"
                          onClick={() => {}}
                          className="mx-auto"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
