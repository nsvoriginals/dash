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
    if (section === "projects") {
      defaultItem = {
        name: "",
        link: "",
        skills: [],
        description: [],
        duration: ""
      };
    }
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

  const generateLatex = (data) => {
    const formatDate = (date) => {
      if (!date) return '';
      return date.includes('Present') ? 'Present' : date;
    };

    const formatSkills = (skills) => {
      return skills.map(skill => {
        const skillList = skill.skills.join(', ');
        return `  \\item \\textbf{${skill.category}:} ${skillList}`;
      }).join('\n');
    };

    const formatExperience = (exp) => {
      return exp.map(job => `
\\vspace{0.5em}
\\resumeheading{${job.position}} \\duration{${formatDate(job.startDate)} — ${formatDate(job.endDate)}} \\\\
\\company{${job.company}} \\\\
\\begin{itemize}[leftmargin=1em]
${job.description.map(desc => `  \\item ${desc}`).join('\n')}
\\end{itemize}`).join('\n\n');
    };

    const formatProjects = (projects) => {
      return projects.map((project, index) => `
\\vspace{0.5em}
\\hspace{1em}\\resumeheading{\\large ${index + 1}. ${project.name}} \\duration{${project.duration}} \\\\
${project.link ? `\\hspace{1em}\\href{${project.link}}{Project Link} \\vspace{-0.5em}\\\\` : ''}
\\begin{itemize}[leftmargin=1.5em]
${project.skills.length > 0 ? `  \\item \\textbf{Technologies:} ${project.skills.join(', ')}` : ''}
${project.description.map(desc => `  \\item ${desc}`).join('\n')}
\\end{itemize}`).join('\n\n');
    };

    const formatEducation = (edu) => {
      return edu.map(ed => `
\\resumeheading{${ed.institution}} \\\\
${ed.degree} ${ed.status ? `(${ed.status})` : ''}`).join('\n\n');
    };

    // Generate sections only if they have content
    const sections = [];

    // Header and Summary are always included
    const header = `% ===== HEADER =====
\\begin{center}
    {\\LARGE \\textbf{\\color{primary}${data.name}}}\\\\[0.2em]
    {\\small
    \\contacticon{\\faMapMarker} ${data.location} \\quad \\textbar \\quad 
    \\contacticon{\\faEnvelope} \\href{mailto:${data.email}}{Email} \\quad \\textbar \\quad 
    \\contacticon{\\faPhone} ${data.phone}\\\\[0.2em]
    ${data.website ? `\\contacticon{\\faGlobe} \\href{${data.website}}{Website} \\quad \\textbar \\quad ` : ''}
    ${data.twitter ? `\\contacticon{\\faTwitter} \\href{https://twitter.com/${data.twitter.replace('@', '')}}{Twitter} \\quad \\textbar \\quad ` : ''}
    ${data.github ? `\\contacticon{\\faGithub} \\href{https://github.com/${data.github.replace('@', '')}}{GitHub}` : ''}
    }
\\end{center}

\\vspace{0.5em}

% ===== SUMMARY =====
\\noindent \\textbf{\\color{primary}Summary:} ${data.summary}`;

    sections.push(header);

    // Education section (moved to top)
    if (data.education.length > 0) {
      sections.push(`% ===== EDUCATION =====
\\section*{Education}
${formatEducation(data.education)}`);
    }

    // Experience section
    if (data.experience.length > 0) {
      sections.push(`% ===== EXPERIENCE =====
\\section*{Experience}
${formatExperience(data.experience)}`);
    }

    // Projects section
    if (data.projects.length > 0) {
      sections.push(`% ===== PROJECTS =====
\\section*{Projects}
${formatProjects(data.projects)}`);
    }

    // Skills section
    if (data.skills.length > 0) {
      sections.push(`% ===== SKILLS =====
\\section*{Technical Skills}
\\begin{itemize}[leftmargin=1.5em]
${formatSkills(data.skills)}
\\end{itemize}`);
    }

    // Optional sections
    if (data.awards.length > 0) {
      sections.push(`% ===== AWARDS =====
\\section*{Awards}
\\begin{itemize}
${data.awards.map(award => `  \\item ${award}`).join('\n')}
\\end{itemize}`);
    }

    if (data.languages.length > 0) {
      sections.push(`% ===== LANGUAGES =====
\\section*{Languages}
\\begin{itemize}
${data.languages.map(lang => `  \\item ${lang}`).join('\n')}
\\end{itemize}`);
    }

    if (data.interests.length > 0) {
      sections.push(`% ===== INTERESTS =====
\\section*{Interests}
\\begin{itemize}
${data.interests.map(interest => `  \\item ${interest}`).join('\n')}
\\end{itemize}`);
    }

    if (data.hobbies.length > 0) {
      sections.push(`% ===== HOBBIES =====
\\section*{Hobbies}
\\begin{itemize}[leftmargin=1.5em]
${data.hobbies.map(hobby => `  \\item ${hobby}`).join('\n')}
\\end{itemize}`);
    }

    if (data.references.length > 0) {
      sections.push(`% ===== REFERENCES =====
\\section*{References}
\\begin{itemize}
${data.references.map(ref => `  \\item ${ref}`).join('\n')}
\\end{itemize}`);
    }

    return `\\documentclass[a4paper,10pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage{url}
\\usepackage{fontawesome}

% Page layout
\\geometry{margin=0.75in}

% Colors
\\definecolor{primary}{RGB}{0, 51, 102}
\\definecolor{secondary}{RGB}{102, 102, 102}

% Hyperlink styling
\\hypersetup{
    colorlinks=true,
    urlcolor=black,
    linkcolor=black,
    citecolor=black
}

% Section formatting
\\titleformat{\\section}{\\large\\bfseries\\color{primary}}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{1em}{1em}

% Custom spacing
\\setlist[itemize]{
  topsep=4pt,
  partopsep=2pt,
  itemsep=3pt,
  parsep=0pt,
  leftmargin=1.5em,
  itemindent=0pt
}

% Custom commands
\\newcommand{\\resumeheading}[1]{\\textbf{\\color{black}#1}}
\\newcommand{\\company}[1]{\\textit{\\color{black}#1}}
\\newcommand{\\duration}[1]{\\hfill \\textit{\\color{black}#1}}
\\newcommand{\\contacticon}[1]{\\makebox[1em]{\\color{black}#1}}

\\begin{document}

${sections.join('\n\n')}

\\end{document}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Generating LaTeX resume...');
      
      // Generate LaTeX content
      const latexContent = generateLatex(formData);
      
      // Create and download the .tex file
      const blob = new Blob([latexContent], { type: 'text/plain' });
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
      setError(error.message || "An error occurred while generating your resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 bg-[#131515] min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1e1e1e] rounded-xl p-4 sm:p-6 shadow-lg w-full max-w-4xl overflow-y-auto max-h-[90vh]"
      >
        <h1 className="text-xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">
          Build Your Resume
        </h1>

        {error && (
          <div className="bg-red-500 text-white p-2 sm:p-4 rounded-lg mb-4 sm:mb-6 text-center text-sm sm:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Personal Information */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-base sm:text-xl font-semibold text-white">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full bg-[#2b2b2b] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full bg-[#2b2b2b] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full bg-[#2b2b2b] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full bg-[#2b2b2b] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
              />
              <input
                type="url"
                placeholder="Website (optional)"
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                className="w-full bg-[#2b2b2b] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
              />
              <input
                type="text"
                placeholder="Twitter (optional)"
                value={formData.twitter}
                onChange={(e) => handleChange("twitter", e.target.value)}
                className="w-full bg-[#2b2b2b] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
              />
              <input
                type="text"
                placeholder="GitHub (optional)"
                value={formData.github}
                onChange={(e) => handleChange("github", e.target.value)}
                className="w-full bg-[#2b2b2b] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
              />
            </div>
            <textarea
              placeholder="Professional Summary"
              value={formData.summary}
              onChange={(e) => handleChange("summary", e.target.value)}
              className="w-full bg-[#2b2b2b] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
              rows="3"
            />
          </div>

          {/* Experience */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <h2 className="text-base sm:text-xl font-semibold text-white">Experience</h2>
              <button
                type="button"
                onClick={() => addArrayItem("experience", {
                  position: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                  description: []
                })}
                className="w-full sm:w-auto bg-indigo-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
              >
                Add Experience
              </button>
            </div>
            {formData.experience.map((exp, index) => (
              <div key={index} className="space-y-2 sm:space-y-4 p-2 sm:p-4 bg-[#2b2b2b] rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <input
                    type="text"
                    placeholder="Position"
                    value={exp.position || ""}
                    onChange={(e) => handleArrayChange("experience", index, "position", e.target.value)}
                    className="w-full bg-[#1e1e1e] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company || ""}
                    onChange={(e) => handleArrayChange("experience", index, "company", e.target.value)}
                    className="w-full bg-[#1e1e1e] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Start Date (YYYY-MM)"
                    value={exp.startDate || ""}
                    onChange={(e) => handleArrayChange("experience", index, "startDate", e.target.value)}
                    className="w-full bg-[#1e1e1e] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="End Date (YYYY-MM or Present)"
                    value={exp.endDate || ""}
                    onChange={(e) => handleArrayChange("experience", index, "endDate", e.target.value)}
                    className="w-full bg-[#1e1e1e] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                  />
                </div>
                <textarea
                  placeholder="Description (one point per line)"
                  value={Array.isArray(exp.description) ? exp.description.join("\n") : ""}
                  onChange={(e) => handleArrayChange("experience", index, "description", e.target.value.split("\n").filter(d => d.trim()))}
                  className="w-full bg-[#1e1e1e] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                  rows="3"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("experience", index)}
                  className="w-full sm:w-auto bg-red-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <h2 className="text-base sm:text-xl font-semibold text-white">Projects</h2>
              <button
                type="button"
                onClick={() => addArrayItem("projects")}
                className="w-full sm:w-auto bg-indigo-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
              >
                Add Project
              </button>
            </div>
            {formData.projects.map((project, index) => (
              <div key={index} className="space-y-2 sm:space-y-4 p-2 sm:p-4 bg-[#2b2b2b] rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={project.name || ""}
                    onChange={(e) => handleArrayChange("projects", index, "name", e.target.value)}
                    className="w-full bg-[#1e1e1e] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                  />
                  <input
                    type="url"
                    placeholder="Project Link (optional)"
                    value={project.link || ""}
                    onChange={(e) => handleArrayChange("projects", index, "link", e.target.value)}
                    className="w-full bg-[#1e1e1e] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., Jan 2023 - Present)"
                    value={project.duration || ""}
                    onChange={(e) => handleArrayChange("projects", index, "duration", e.target.value)}
                    className="w-full bg-[#1e1e1e] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Skills (comma-separated)"
                    value={Array.isArray(project.skills) ? project.skills.join(", ") : ""}
                    onChange={(e) => handleArrayChange("projects", index, "skills", e.target.value.split(",").map(s => s.trim()))}
                    className="w-full bg-[#1e1e1e] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                  />
                </div>
                <textarea
                  placeholder="Description (one point per line)"
                  value={Array.isArray(project.description) ? project.description.join("\n") : ""}
                  onChange={(e) => handleArrayChange("projects", index, "description", e.target.value.split("\n").filter(d => d.trim()))}
                  className="w-full bg-[#1e1e1e] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                  rows="3"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("projects", index)}
                  className="w-full sm:w-auto bg-red-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <h2 className="text-base sm:text-xl font-semibold text-white">Education</h2>
              <button
                type="button"
                onClick={() => addArrayItem("education", {
                  institution: "",
                  degree: "",
                  status: "",
                  startDate: "",
                  endDate: ""
                })}
                className="w-full sm:w-auto bg-indigo-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
              >
                Add Education
              </button>
            </div>
            {formData.education.map((edu, index) => (
              <div key={index} className="space-y-2 sm:space-y-4 p-2 sm:p-4 bg-[#2b2b2b] rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <input
                    type="text"
                    placeholder="Institution"
                    value={edu.institution || ""}
                    onChange={(e) => handleArrayChange("education", index, "institution", e.target.value)}
                    className="w-full bg-[#1e1e1e] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree || ""}
                    onChange={(e) => handleArrayChange("education", index, "degree", e.target.value)}
                    className="w-full bg-[#1e1e1e] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Status (e.g., completed, in progress)"
                    value={edu.status || ""}
                    onChange={(e) => handleArrayChange("education", index, "status", e.target.value)}
                    className="w-full bg-[#1e1e1e] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Start Date (YYYY-MM)"
                    value={edu.startDate || ""}
                    onChange={(e) => handleArrayChange("education", index, "startDate", e.target.value)}
                    className="w-full bg-[#1e1e1e] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="End Date (YYYY-MM)"
                    value={edu.endDate || ""}
                    onChange={(e) => handleArrayChange("education", index, "endDate", e.target.value)}
                    className="w-full bg-[#1e1e1e] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem("education", index)}
                  className="w-full sm:w-auto bg-red-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <h2 className="text-base sm:text-xl font-semibold text-white">Skills</h2>
              <button
                type="button"
                onClick={() => addArrayItem("skills", {
                  category: "",
                  skills: []
                })}
                className="w-full sm:w-auto bg-indigo-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
              >
                Add Skill Category
              </button>
            </div>
            {formData.skills.map((skill, index) => (
              <div key={index} className="space-y-2 sm:space-y-4 p-2 sm:p-4 bg-[#2b2b2b] rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <input
                    type="text"
                    placeholder="Category (e.g., Frontend, Backend)"
                    value={skill.category || ""}
                    onChange={(e) => handleArrayChange("skills", index, "category", e.target.value)}
                    className="w-full bg-[#1e1e1e] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Skills (comma-separated)"
                    value={Array.isArray(skill.skills) ? skill.skills.join(", ") : ""}
                    onChange={(e) => handleArrayChange("skills", index, "skills", e.target.value.split(",").map(s => s.trim()).filter(s => s))}
                    className="w-full bg-[#1e1e1e] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem("skills", index)}
                  className="w-full sm:w-auto bg-red-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  Remove Category
                </button>
              </div>
            ))}
          </div>

          {/* Hobbies */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <h2 className="text-base sm:text-xl font-semibold text-white">Hobbies</h2>
              <button
                type="button"
                onClick={() => addArrayItem("hobbies", "")}
                className="w-full sm:w-auto bg-indigo-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
              >
                Add Hobby
              </button>
            </div>
            {formData.hobbies.map((hobby, index) => (
              <div key={index} className="space-y-2 sm:space-y-4 p-2 sm:p-4 bg-[#2b2b2b] rounded-lg">
                <div className="grid grid-cols-1 gap-2 sm:gap-4">
                  <input
                    type="text"
                    placeholder="Hobby (e.g., Photography, Hiking)"
                    value={hobby || ""}
                    onChange={(e) => {
                      const newHobbies = [...formData.hobbies];
                      newHobbies[index] = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        hobbies: newHobbies
                      }));
                    }}
                    className="w-full bg-[#1e1e1e] text-white rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem("hobbies", index)}
                  className="w-full sm:w-auto bg-red-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
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
              className={`flex items-center justify-center space-x-2 px-4 py-3 md:p-3 rounded-lg text-white font-medium transition-colors w-full sm:w-auto text-base ${
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
      </motion.div>
    </main>
  );
}