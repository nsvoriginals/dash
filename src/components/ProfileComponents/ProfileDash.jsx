import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAtom } from "jotai";
import resumeAtom from "../../store/Resume";
import AnimatedLoader from "../AnimatedLoader";

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
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeDetails, setResumeDetails] = useState("No resume uploaded.");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const [resumeData, setResumeData] = useAtom(resumeAtom);

  useEffect(() => {
    const loadResumeData = () => {
      try {
        const savedData = localStorage.getItem('resumeData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setResumeData(parsedData);
          setResumeDetails("Resume loaded from local storage");
          setUploadSuccess(true);
          
          if (parsedData.basics?.name) {
            setName(parsedData.basics.name);
          }
        }

        fetchResumeFromBackend();
      } catch (error) {
        console.error('Failed to load resume data:', error);
        setUploadError("Failed to load resume data");
      }
    };

    loadResumeData();
  }, [setResumeData]);

  const fetchResumeFromBackend = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/resumes/latest`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setResumeData(data);
        setResumeDetails("Resume loaded from server");
        setUploadSuccess(true);
        
        if (data.basics?.name) {
          setName(data.basics.name);
        }

        localStorage.setItem('resumeData', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Failed to fetch resume from backend:', error);
    }
  };

  const handleResumeChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setResumeDetails("Selected: " + file.name);
      setUploadSuccess(false);
    }
  };

  const uploadResume = async () => {
    if (!resumeFile) {
      setUploadError("Please select a resume file first");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    
    try {
      const formData = new FormData();
      formData.append("file", resumeFile);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/resume/upload`, 
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        setResumeData(response.data);
        localStorage.setItem('resumeData', JSON.stringify(response.data));
      }

      setResumeDetails(`Uploaded: ${resumeFile.name} (Success!)`);
      setUploadSuccess(true);
      console.log("Upload successful:", response.data);
      
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError(error.response?.data?.detail || "Failed to upload resume");
      setResumeDetails("Upload failed: " + resumeFile.name);
    } finally {
      setIsUploading(false);
    }
  };

  const handleNameSave = () => {
    setIsEditing(false);
    if (resumeData) {
      const updatedData = {
        ...resumeData,
        basics: {
          ...resumeData.basics,
          name: name
        }
      };
      setResumeData(updatedData);
      localStorage.setItem('resumeData', JSON.stringify(updatedData));
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
            <div className="flex gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <Button 
                text="Save"
                onClick={handleNameSave}
                className="bg-[#00b4d8] text-white hover:bg-[#00b4d8]"
              />
            </div>
          ) : (
            <div className="flex gap-2">
              <p className="flex-1 text-white">{name}</p>
              <Button 
                text="Edit"
                onClick={() => setIsEditing(true)}
                className="bg-[#00b4d8] text-white hover:bg-[#00b4d8]"
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-white font-medium">Resume</label>
          <p className={`text-white ${uploadSuccess ? "text-green-400" : ""}`}>
            {resumeDetails}
          </p>
          
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeChange}
            className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none mt-2"
            disabled={isUploading}
          />
          
          {resumeFile && (
            <Button
              text={isUploading ? "Uploading..." : "Upload Resume"}
              onClick={uploadResume}
              className="mt-2 bg-[#00b4d8] text-white hover:bg-[#00b4d8] w-full"
              disabled={isUploading || uploadSuccess}
            />
          )}
          
          {uploadError && (
            <p className="text-red-400 mt-2">{uploadError}</p>
          )}
        </div>

        {resumeData && (
          <div className="mt-6 p-4 bg-[#2b2b2b] rounded-lg">
            <h2 className="text-white font-medium mb-2">Resume Data:</h2>
            {resumeData.basics && (
              <>
                <p className="text-white">Name: {resumeData.basics.name}</p>
                <p className="text-white">Email: {resumeData.basics.email}</p>
                {resumeData.basics.location && (
                  <p className="text-white">Location: {resumeData.basics.location.address}</p>
                )}
              </>
            )}
            {resumeData.work && resumeData.work.length > 0 && (
              <p className="text-white">Current Position: {resumeData.work[0].position}</p>
            )}
            {resumeData.skills && resumeData.skills.length > 0 && (
              <p className="text-white">Skills: {resumeData.skills.map(skill => skill.name).join(", ")}</p>
            )}
          </div>
        )}
      </motion.div>
    </main>
  );
}