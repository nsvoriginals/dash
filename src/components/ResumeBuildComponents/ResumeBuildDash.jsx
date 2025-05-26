import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";

export default function ResumeBuildDash() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    twitter: "",
    github: "",
    summary: "",
    experience: [],
    projects: [],
    education: [],
    skills: [],
    awards: [],
    languages: [],
    interests: [],
    hobbies: [],
    references: []
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (section, defaultItem = {}) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], defaultItem]
    }));
  };

  const removeArrayItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Submitting form data:', formData);

      // First, save the resume data
      const saveResponse = await fetch("http://localhost:8000/api/resumes/?user_id=1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          website: formData.website,
          twitter: formData.twitter,
          github: formData.github,
          summary: formData.summary,
          experience: formData.experience,
          projects: formData.projects,
          education: formData.education,
          skills: formData.skills,
          awards: formData.awards,
          languages: formData.languages,
          interests: formData.interests,
          hobbies: formData.hobbies,
          references: formData.references,
          template_name: "modern"
        }),
      });

      console.log('Save response status:', saveResponse.status);

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json().catch(() => null);
        console.error('Save response error:', errorData);
        throw new Error(errorData?.detail || `Failed to save resume data: ${saveResponse.status}`);
      }

      const saveData = await saveResponse.json();
      console.log('Save response data:', saveData);

      // Then, get the LaTeX formatted resume
      const latexResponse = await fetch("http://localhost:8000/api/resume/format-latex/?user_id=1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template_name: "modern"
        }),
      });

      console.log('LaTeX response status:', latexResponse.status);

      if (!latexResponse.ok) {
        const errorData = await latexResponse.json().catch(() => null);
        console.error('LaTeX response error:', errorData);
        throw new Error(errorData?.detail || `Failed to generate LaTeX resume: ${latexResponse.status}`);
      }

      const latexData = await latexResponse.json();
      console.log('LaTeX response data:', latexData);
      
      // Create and download the .tex file
      const blob = new Blob([latexData.formatted_latex], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.tex";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error("Error details:", error);
      setError(error.message || "An error occurred while processing your resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 bg-[#131515] overflow-auto min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
              Build Your Resume
            </h1>

            {error && (
              <div className="bg-red-500 text-white p-4 rounded-lg mb-6 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Website (optional)"
                    value={formData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    className="bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Twitter (optional)"
                    value={formData.twitter}
                    onChange={(e) => handleChange("twitter", e.target.value)}
                    className="bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="GitHub (optional)"
                    value={formData.github}
                    onChange={(e) => handleChange("github", e.target.value)}
                    className="bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <textarea
                  placeholder="Professional Summary"
                  value={formData.summary}
                  onChange={(e) => handleChange("summary", e.target.value)}
                  className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  rows="3"
                />
              </div>

              {/* Experience */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Experience</h2>
                  <button
                    type="button"
                    onClick={() => addArrayItem("experience", {
                      position: "",
                      company: "",
                      startDate: "",
                      endDate: "",
                      description: []
                    })}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Experience
                  </button>
                </div>
                {formData.experience.map((exp, index) => (
                  <div key={index} className="space-y-4 p-4 bg-[#2b2b2b] rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Position"
                        value={exp.position || ""}
                        onChange={(e) => handleArrayChange("experience", index, "position", e.target.value)}
                        className="bg-[#1e1e1e] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company || ""}
                        onChange={(e) => handleArrayChange("experience", index, "company", e.target.value)}
                        className="bg-[#1e1e1e] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Start Date (YYYY-MM)"
                        value={exp.startDate || ""}
                        onChange={(e) => handleArrayChange("experience", index, "startDate", e.target.value)}
                        className="bg-[#1e1e1e] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="End Date (YYYY-MM or Present)"
                        value={exp.endDate || ""}
                        onChange={(e) => handleArrayChange("experience", index, "endDate", e.target.value)}
                        className="bg-[#1e1e1e] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <textarea
                      placeholder="Description (one point per line)"
                      value={Array.isArray(exp.description) ? exp.description.join("\n") : ""}
                      onChange={(e) => handleArrayChange("experience", index, "description", e.target.value.split("\n").filter(d => d.trim()))}
                      className="w-full bg-[#1e1e1e] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      rows="3"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("experience", index)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Projects</h2>
                  <button
                    type="button"
                    onClick={() => addArrayItem("projects", {
                      title: "",
                      description: []
                    })}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Project
                  </button>
                </div>
                {formData.projects.map((project, index) => (
                  <div key={index} className="space-y-4 p-4 bg-[#2b2b2b] rounded-lg">
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={project.title || ""}
                      onChange={(e) => handleArrayChange("projects", index, "title", e.target.value)}
                      className="w-full bg-[#1e1e1e] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <textarea
                      placeholder="Description (one point per line)"
                      value={Array.isArray(project.description) ? project.description.join("\n") : ""}
                      onChange={(e) => handleArrayChange("projects", index, "description", e.target.value.split("\n").filter(d => d.trim()))}
                      className="w-full bg-[#1e1e1e] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      rows="3"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("projects", index)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Education</h2>
                  <button
                    type="button"
                    onClick={() => addArrayItem("education", {
                      institution: "",
                      degree: "",
                      status: "",
                      startDate: "",
                      endDate: ""
                    })}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Education
                  </button>
                </div>
                {formData.education.map((edu, index) => (
                  <div key={index} className="space-y-4 p-4 bg-[#2b2b2b] rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Institution"
                        value={edu.institution || ""}
                        onChange={(e) => handleArrayChange("education", index, "institution", e.target.value)}
                        className="bg-[#1e1e1e] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Degree"
                        value={edu.degree || ""}
                        onChange={(e) => handleArrayChange("education", index, "degree", e.target.value)}
                        className="bg-[#1e1e1e] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Status (e.g., completed, in progress)"
                        value={edu.status || ""}
                        onChange={(e) => handleArrayChange("education", index, "status", e.target.value)}
                        className="bg-[#1e1e1e] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Start Date (YYYY-MM)"
                        value={edu.startDate || ""}
                        onChange={(e) => handleArrayChange("education", index, "startDate", e.target.value)}
                        className="bg-[#1e1e1e] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="End Date (YYYY-MM)"
                        value={edu.endDate || ""}
                        onChange={(e) => handleArrayChange("education", index, "endDate", e.target.value)}
                        className="bg-[#1e1e1e] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("education", index)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Skills</h2>
                  <button
                    type="button"
                    onClick={() => addArrayItem("skills", {
                      category: "",
                      skills: []
                    })}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Skill Category
                  </button>
                </div>
                {formData.skills.map((skill, index) => (
                  <div key={index} className="space-y-4 p-4 bg-[#2b2b2b] rounded-lg">
                    <input
                      type="text"
                      placeholder="Category (e.g., Frontend, Backend)"
                      value={skill.category || ""}
                      onChange={(e) => handleArrayChange("skills", index, "category", e.target.value)}
                      className="w-full bg-[#1e1e1e] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Skills (comma-separated)"
                      value={Array.isArray(skill.skills) ? skill.skills.join(", ") : ""}
                      onChange={(e) => handleArrayChange("skills", index, "skills", e.target.value.split(",").map(s => s.trim()))}
                      className="w-full bg-[#1e1e1e] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("skills", index)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                    loading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {loading ? (
                    "Generating Resume..."
                  ) : (
                    <>
                      <FaDownload />
                      <span>Generate LaTeX Resume</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}