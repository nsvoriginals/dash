import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeBuilderDash() {
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);
  const [userId] = useState(1); // TODO: Replace with actual user ID from auth system
  const [resumeId, setResumeId] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [htmlUrl, setHtmlUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewHtml, setPreviewHtml] = useState(null);
  const [pdfAvailable, setPdfAvailable] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: "",
    experience: [
      { 
        company: "", 
        position: "", 
        duration: "", 
        description: "" 
      }
    ],
    education: [
      { 
        institution: "", 
        degree: "", 
        year: "", 
        description: "",
        url: "",
        area: "",
        studyType: "",
        startDate: "",
        endDate: "",
        score: "",
        courses: []
      }
    ],
    projects: [
      { 
        title: "", 
        description: "", 
        technologies: "", 
        link: "",
        name: "",
        startDate: "",
        endDate: "",
        highlights: [],
        url: ""
      }
    ],
    hobbies: ""
  });

  // Fetch resume data from backend
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        setLoading(true);
        // Get the latest resume for the user
        const response = await fetch(`http://localhost:8000/api/resumes/?user_id=${userId}&latest=true`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
        });
        
        if (response.ok) {
          const resume = await response.json();
          if (resume) {
            setResumeId(resume.id);
            setHtmlUrl(resume.formats?.html || null);
            setPreviewUrl(resume.preview_url || null);
            setPdfUrl(resume.formats?.pdf || null);
            setPdfAvailable(!!resume.formats?.pdf);
            setPublished(true);

            // Format the data for the form
            const formattedData = {
              name: resume.name || "",
              email: resume.email || "",
              phone: resume.phone || "",
              location: resume.location || "",
              bio: resume.bio || "",
              skills: resume.skills || "",
              experience: Array.isArray(resume.experience) && resume.experience.length > 0 
                ? resume.experience 
                : [{ company: "", position: "", duration: "", description: "" }],
              education: Array.isArray(resume.education) && resume.education.length > 0 
                ? resume.education 
                : [{ institution: "", degree: "", year: "", description: "", url: "", area: "", studyType: "", startDate: "", endDate: "", score: "", courses: [] }],
              projects: Array.isArray(resume.projects) && resume.projects.length > 0 
                ? resume.projects 
                : [{ title: "", description: "", technologies: "", link: "", name: "", startDate: "", endDate: "", highlights: [], url: "" }],
              hobbies: resume.hobbies || ""
            };

            setFormData(formattedData);

            // Fetch preview HTML if available
            if (resume.preview_url) {
              const previewResponse = await fetch(`http://localhost:8000${resume.preview_url}`, {
                headers: {
                  'Accept': 'text/html',
                },
                credentials: 'include',
              });
              if (previewResponse.ok) {
                const html = await previewResponse.text();
                setPreviewHtml(html);
              }
            }
          }
        } else if (response.status === 404) {
          // If no resume found, fall back to localStorage
          console.log("No resume found in backend, falling back to localStorage");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch resume");
        }
      } catch (error) {
        console.error("Error fetching resume data:", error);
        setError(error.message || "Failed to load resume data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [userId]);

  // Load data from localStorage as fallback
  useEffect(() => {
    if (!loading && !published) {
      const savedData = localStorage.getItem("resumeData");
      const publishStatus = localStorage.getItem("resumePublished");
      
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          // Ensure all required fields are present with default values
          setFormData({
            name: parsedData.name || "",
            email: parsedData.email || "",
            phone: parsedData.phone || "",
            location: parsedData.location || "",
            bio: parsedData.bio || "",
            skills: parsedData.skills || "",
            experience: Array.isArray(parsedData.experience) && parsedData.experience.length > 0 
              ? parsedData.experience 
              : [{ company: "", position: "", duration: "", description: "" }],
            education: Array.isArray(parsedData.education) && parsedData.education.length > 0 
              ? parsedData.education 
              : [{ institution: "", degree: "", year: "", description: "", url: "", area: "", studyType: "", startDate: "", endDate: "", score: "", courses: [] }],
            projects: Array.isArray(parsedData.projects) && parsedData.projects.length > 0 
              ? parsedData.projects 
              : [{ title: "", description: "", technologies: "", link: "", name: "", startDate: "", endDate: "", highlights: [], url: "" }],
            hobbies: parsedData.hobbies || ""
          });
        } catch (error) {
          console.error("Error parsing saved data:", error);
        }
      }
      
      if (publishStatus === "true") {
        setPublished(true);
      }
    }
  }, [loading, published]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value || "" // Ensure empty string if value is null/undefined
    }));
  };

  // Handle array field changes (experience, education, projects)
  const handleArrayChange = (e, index, arrayName) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const currentArray = Array.isArray(prevData[arrayName]) ? prevData[arrayName] : [];
      const newArray = [...currentArray];
      
      // Ensure the index exists
      if (!newArray[index]) {
        newArray[index] = {};
      }
      
      newArray[index] = {
        ...newArray[index],
        [name]: value || "" // Ensure empty string if value is null/undefined
      };
      
      return {
        ...prevData,
        [arrayName]: newArray
      };
    });
  };

  // Add new item to arrays (experience, education, projects)
  const addItem = (arrayName) => {
    let newItem = {};
    
    if (arrayName === "experience") {
      newItem = { company: "", position: "", duration: "", description: "" };
    } else if (arrayName === "education") {
      newItem = { institution: "", degree: "", year: "", description: "", url: "", area: "", studyType: "", startDate: "", endDate: "", score: "", courses: [] };
    } else if (arrayName === "projects") {
      newItem = { title: "", description: "", technologies: "", link: "", name: "", startDate: "", endDate: "", highlights: [], url: "" };
    }
    
    setFormData(prevData => {
      const currentArray = Array.isArray(prevData[arrayName]) ? prevData[arrayName] : [];
      return {
        ...prevData,
        [arrayName]: [...currentArray, newItem]
      };
    });
  };

  // Remove item from arrays (experience, education, projects)
  const removeItem = (index, arrayName) => {
    setFormData(prevData => {
      const currentArray = Array.isArray(prevData[arrayName]) ? prevData[arrayName] : [];
      const newArray = [...currentArray];
      newArray.splice(index, 1);
      
      // Ensure at least one item remains
      if (newArray.length === 0) {
        if (arrayName === "experience") {
          newArray.push({ company: "", position: "", duration: "", description: "" });
        } else if (arrayName === "education") {
          newArray.push({ institution: "", degree: "", year: "", description: "", url: "", area: "", studyType: "", startDate: "", endDate: "", score: "", courses: [] });
        } else if (arrayName === "projects") {
          newArray.push({ title: "", description: "", technologies: "", link: "", name: "", startDate: "", endDate: "", highlights: [], url: "" });
        }
      }
      
      return {
        ...prevData,
        [arrayName]: newArray
      };
    });
  };

  // Handle publish action
  const handlePublish = async () => {
    setPublishing(true);
    setError(null);
    try {
      // First save to localStorage
      localStorage.setItem("resumeData", JSON.stringify(formData));
      localStorage.setItem("resumePublished", "true");

      // Format the data for the API
      const resumeData = {
        user_id: userId,
        name: formData.name || "",
        email: formData.email || "",
        phone: formData.phone || "",
        location: formData.location || "",
        bio: formData.bio || "",
        skills: typeof formData.skills === 'string' ? formData.skills : 
               Array.isArray(formData.skills) ? formData.skills.join(', ') : 
               safeSplit(formData.skills).join(', '),
        experience: formData.experience.map(exp => ({
          company: exp.company || '',
          position: exp.position || '',
          duration: exp.duration || '',
          description: exp.description || ''
        })),
        education: formData.education.map(edu => ({
          institution: edu.institution || '',
          degree: edu.degree || '',
          year: edu.year || '',
          description: edu.description || '',
          url: edu.url || '',
          area: edu.area || '',
          studyType: edu.studyType || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          score: edu.score || '',
          courses: Array.isArray(edu.courses) ? edu.courses : []
        })),
        projects: formData.projects.map(proj => ({
          title: proj.title || '',
          description: proj.description || '',
          technologies: proj.technologies || '',
          link: proj.link || '',
          name: proj.name || '',
          startDate: proj.startDate || '',
          endDate: proj.endDate || '',
          highlights: Array.isArray(proj.highlights) ? proj.highlights : [],
          url: proj.url || ''
        })),
        hobbies: formData.hobbies || "",
        template_name: "Professional"
      };

      // Send to backend API
      const response = await fetch(`http://localhost:8000/api/resumes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create resume");
      }

      const data = await response.json();
      setResumeId(data.id);
      setHtmlUrl(data.formats?.html || null);
      setPreviewUrl(data.preview_url || null);
      setPdfUrl(data.formats?.pdf || null);
      setPdfAvailable(!!data.formats?.pdf);
      setPublished(true);

      // Fetch preview HTML
      if (data.preview_url) {
        const previewResponse = await fetch(`http://localhost:8000${data.preview_url}`, {
          headers: {
            'Accept': 'text/html',
          },
          credentials: 'include',
        });
        if (previewResponse.ok) {
          const html = await previewResponse.text();
          setPreviewHtml(html);
        }
      }

    } catch (error) {
      console.error("Error publishing resume:", error);
      setError(error.message || "Failed to publish resume. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  // Handle PDF download using browser's print functionality
  const handleDownloadPDF = async () => {
    if (!previewHtml) return;
    
    try {
      setPublishing(true);
      
      // Create a new window with the HTML content
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error("Please allow popups for this website");
      }

      // Add print-specific styles
      const printStyles = `
        <style>
          @media print {
            body {
              margin: 0;
              padding: 20px;
              font-family: "Times New Roman", serif;
            }
            @page {
              size: A4;
              margin: 0;
            }
            .no-print {
              display: none !important;
            }
            a {
              text-decoration: none;
              color: black;
            }
          }
        </style>
      `;

      // Write the content to the new window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${formData.name}'s Resume</title>
            ${printStyles}
          </head>
          <body>
            ${previewHtml}
            <div class="no-print" style="position: fixed; top: 10px; right: 10px;">
              <button onclick="window.print()">Print / Save as PDF</button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();

      // Wait for content to load
      printWindow.onload = () => {
        // Automatically trigger print dialog
        printWindow.print();
        // Close the window after printing
        printWindow.onafterprint = () => {
          printWindow.close();
          setPublishing(false);
        };
      };
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError(error.message || "Failed to generate PDF. Please try again.");
      setPublishing(false);
    }
  };

  // Handle HTML download
  const handleDownloadHTML = async () => {
    if (!htmlUrl) return;
    
    try {
      setPublishing(true);
      const htmlResponse = await fetch(`http://localhost:8000${htmlUrl}`);
      
      if (!htmlResponse.ok) {
        throw new Error("Failed to download HTML");
      }

      const htmlBlob = await htmlResponse.blob();
      const url = window.URL.createObjectURL(htmlBlob);
      
      // Create and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_${resumeId}.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading HTML:", error);
      setError(error.message || "Failed to download HTML. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  // Handle HTML preview
  const handleViewHTML = async () => {
    if (!previewUrl) return;
    
    try {
      setPublishing(true);
      const htmlResponse = await fetch(`http://localhost:8000${previewUrl}`);
      
      if (!htmlResponse.ok) {
        throw new Error("Failed to load HTML preview");
      }

      const html = await htmlResponse.text();
      setPreviewHtml(html);
    } catch (error) {
      console.error("Error loading HTML preview:", error);
      setError(error.message || "Failed to load HTML preview. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // Handle unpublish action
  const handleUnpublish = () => {
    localStorage.setItem("resumePublished", "false");
    setPublished(false);
  };

  // Button component
  const Button = ({ text, onClick, variant = 'primary', className = '', disabled = false }) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors";
    const variantStyles = variant === 'secondary' 
      ? "bg-gray-700 text-white hover:bg-gray-600" 
      : "bg-indigo-600 text-white hover:bg-indigo-700";
    const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";
    
    return (
      <button 
        onClick={onClick}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles} ${disabledStyles} ${className}`}
      >
        {text}
      </button>
    );
  };

  // Validation for publish button
  const isFormValid = () => {
    const name = typeof formData.name === 'string' ? formData.name.trim() : '';
    const email = typeof formData.email === 'string' ? formData.email.trim() : '';
    const skills = typeof formData.skills === 'string' ? formData.skills.trim() : '';
    
    return name !== '' && email !== '' && skills !== '';
  };

  // Helper function to safely split strings
  const safeSplit = (str, delimiter = ',') => {
    if (!str || typeof str !== 'string') return [];
    return str.split(delimiter).filter(item => item.trim());
  };

  // Loading state
  if (loading) return (
    <main className="flex-1 bg-[#131515] overflow-auto">
      <div className="flex items-center justify-center h-full text-white">
        <div className="animate-pulse text-xl">Loading resume builder...</div>
      </div>
    </main>
  );

  return (
    <main className="flex-1 bg-[#131515] overflow-auto min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={published ? "view" : "form"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full p-6"
        >
          <div className="max-w-6xl mx-auto">
            {!published ? (
              // INPUT FORM
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg mx-auto mt-6 mb-10"
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
                  Create Your Resume
                </h1>
                <p className="text-gray-300 mb-8 text-center">
                  Fill in your details to create a professional resume.
                </p>
                
                <form className="space-y-6">
                  {/* Personal Details Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Personal Details</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-white font-medium">Full Name*</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-white font-medium">Email Address*</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          placeholder="john.doe@example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-white font-medium">Phone Number</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-white font-medium">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          placeholder="New York, NY"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-white font-medium">Bio / Summary</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full h-24 bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="Write a brief introduction about yourself..."
                      />
                    </div>
                  </div>
                  
                  {/* Skills Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Skills*</h2>
                    <div className="space-y-2">
                      <label className="block text-white font-medium">List your skills (separated by commas)</label>
                      <textarea
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        className="w-full h-24 bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="JavaScript, React, Node.js, CSS, HTML, etc."
                      />
                    </div>
                  </div>
                  
                  {/* Experience Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                      <h2 className="text-xl font-semibold text-white">Experience</h2>
                      <Button 
                        text="Add Experience" 
                        onClick={() => addItem("experience")}
                        variant="secondary"
                        className="text-sm px-3 py-1"
                      />
                    </div>
                    
                    {formData.experience.map((exp, index) => (
                      <div key={index} className="bg-[#242424] p-4 rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-white font-medium">Experience #{index + 1}</h3>
                          {formData.experience.length > 1 && (
                            <button
                              onClick={() => removeItem(index, "experience")}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-white font-medium">Company</label>
                            <input
                              type="text"
                              name="company"
                              value={exp.company}
                              onChange={(e) => handleArrayChange(e, index, "experience")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="Company Name"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-white font-medium">Position</label>
                            <input
                              type="text"
                              name="position"
                              value={exp.position}
                              onChange={(e) => handleArrayChange(e, index, "experience")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="Job Title"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-white font-medium">Duration</label>
                          <input
                            type="text"
                            name="duration"
                            value={exp.duration}
                            onChange={(e) => handleArrayChange(e, index, "experience")}
                            className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="Jan 2020 - Present"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-white font-medium">Description</label>
                          <textarea
                            name="description"
                            value={exp.description}
                            onChange={(e) => handleArrayChange(e, index, "experience")}
                            className="w-full h-24 bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="Describe your responsibilities and achievements..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Education Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                      <h2 className="text-xl font-semibold text-white">Education</h2>
                      <Button 
                        text="Add Education" 
                        onClick={() => addItem("education")}
                        variant="secondary"
                        className="text-sm px-3 py-1"
                      />
                    </div>
                    
                    {formData.education.map((edu, index) => (
                      <div key={index} className="bg-[#242424] p-4 rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-white font-medium">Education #{index + 1}</h3>
                          {formData.education.length > 1 && (
                            <button
                              onClick={() => removeItem(index, "education")}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-white font-medium">Institution</label>
                            <input
                              type="text"
                              name="institution"
                              value={edu.institution}
                              onChange={(e) => handleArrayChange(e, index, "education")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="University Name"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-white font-medium">Degree</label>
                            <input
                              type="text"
                              name="degree"
                              value={edu.degree}
                              onChange={(e) => handleArrayChange(e, index, "education")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="Bachelor of Science"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-white font-medium">Year</label>
                          <input
                            type="text"
                            name="year"
                            value={edu.year}
                            onChange={(e) => handleArrayChange(e, index, "education")}
                            className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="2016 - 2020"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-white font-medium">Description</label>
                          <textarea
                            name="description"
                            value={edu.description}
                            onChange={(e) => handleArrayChange(e, index, "education")}
                            className="w-full h-24 bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="Describe your studies, achievements, etc."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Projects Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                      <h2 className="text-xl font-semibold text-white">Projects</h2>
                      <Button 
                        text="Add Project" 
                        onClick={() => addItem("projects")}
                        variant="secondary"
                        className="text-sm px-3 py-1"
                      />
                    </div>
                    
                    {formData.projects.map((project, index) => (
                      <div key={index} className="bg-[#242424] p-4 rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-white font-medium">Project #{index + 1}</h3>
                          {formData.projects.length > 1 && (
                            <button
                              onClick={() => removeItem(index, "projects")}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-white font-medium">Project Title</label>
                          <input
                            type="text"
                            name="title"
                            value={project.title}
                            onChange={(e) => handleArrayChange(e, index, "projects")}
                            className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="Project Name"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-white font-medium">Description</label>
                          <textarea
                            name="description"
                            value={project.description}
                            onChange={(e) => handleArrayChange(e, index, "projects")}
                            className="w-full h-24 bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="Describe your project..."
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-white font-medium">Technologies Used</label>
                          <input
                            type="text"
                            name="technologies"
                            value={project.technologies}
                            onChange={(e) => handleArrayChange(e, index, "projects")}
                            className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="React, Node.js, MongoDB, etc."
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-white font-medium">Project Link</label>
                          <input
                            type="url"
                            name="link"
                            value={project.link}
                            onChange={(e) => handleArrayChange(e, index, "projects")}
                            className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="https://github.com/username/project"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Hobbies Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Hobbies & Interests</h2>
                    
                    <div className="space-y-2">
                      <label className="block text-white font-medium">Hobbies (separated by commas)</label>
                      <textarea
                        name="hobbies"
                        value={formData.hobbies}
                        onChange={handleChange}
                        className="w-full h-24 bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="Reading, Hiking, Photography, etc."
                      />
                    </div>
                  </div>
                  
                 <div className="pt-6">
                                     <Button 
                                       text={publishing ? "Building Resume..." : "Build Resume"}
                                       onClick={handlePublish}
                                       className="w-full py-3"
                                       disabled={!isFormValid() || publishing}
                                     />
                                     {!isFormValid() && (
                                       <p className="text-red-400 text-sm mt-2 text-center">
                                         Please fill all required fields marked with *
                                       </p>
                                     )}
                                     {error && (
                                       <p className="text-red-400 text-sm mt-2 text-center">
                                         {error}
                                       </p>
                                     )}
                                   </div>
                                 </form>
                               </motion.div>
                             ) : (
                               // PUBLISHED PORTFOLIO VIEW
                               <>
                                 <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                                   <Button
                                     text="Modify Portfolio"
                                     onClick={handleUnpublish}
                                     variant="secondary"
                                     className="w-full sm:w-auto"
                                   />
                                   <motion.h2 
                                     initial={{ opacity: 0, scale: 0.8 }}
                                     animate={{ opacity: 1, scale: 1 }}
                                     transition={{ delay: 0.3 }}
                                     className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center"
                                   >
                                     {formData.name}'s Portfolio
                                   </motion.h2>
                                   <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                                     <Button
                                       text={publishing ? "Generating PDF..." : "Download as PDF"}
                                       onClick={handleDownloadPDF}
                                       disabled={publishing || !previewHtml}
                                       className="w-full sm:w-40"
                                     />
                                     <Button
                                       text={publishing ? "Loading Preview..." : "View HTML"}
                                       onClick={handleViewHTML}
                                       disabled={publishing || !previewUrl}
                                       variant="secondary"
                                       className="w-full sm:w-40"
                                     />
                                     <Button
                                       text={publishing ? "Downloading..." : "Download HTML"}
                                       onClick={handleDownloadHTML}
                                       disabled={publishing || !htmlUrl}
                                       variant="secondary"
                                       className="w-full sm:w-40"
                                     />
                                   </div>
                                 </div>
                 
                                 {previewHtml ? (
                                   <div 
                                     className="bg-white rounded-lg p-6 mt-6"
                                     dangerouslySetInnerHTML={{ __html: previewHtml }}
                                   />
                                 ) : (
                                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                                     {/* Left Column - Personal Info */}
                                     <div className="lg:col-span-1">
                                       <motion.div
                                         initial={{ opacity: 0, y: 50 }}
                                         animate={{ opacity: 1, y: 0 }}
                                         className="bg-[#1e1e1e] rounded-xl p-4 sm:p-6 h-full"
                                       >
                                         <div className="mx-auto w-32 h-32 sm:w-48 sm:h-48 mb-4 sm:mb-6 bg-indigo-600 rounded-full flex items-center justify-center">
                                           <span className="text-3xl sm:text-4xl font-bold text-white">
                                             {formData.name.split(' ').map(name => name[0]).join('')}
                                           </span>
                                         </div>

                                         <div className="space-y-4 text-center">
                                           <h2 className="text-xl sm:text-2xl font-semibold text-white">
                                             {formData.name}
                                           </h2>
                                           <p className="text-gray-300 text-base">
                                             {formData.bio || "No bio provided"}
                                           </p>
                                           
                                           <div className="pt-4 border-t border-gray-700">
                                             <div className="flex flex-col space-y-2">
                                               {formData.email && (
                                                 <p className="text-gray-300">
                                                   <span className="text-indigo-400">Email:</span> {formData.email}
                                                 </p>
                                               )}
                                               {formData.phone && (
                                                 <p className="text-gray-300">
                                                   <span className="text-indigo-400">Phone:</span> {formData.phone}
                                                 </p>
                                               )}
                                               {formData.location && (
                                                 <p className="text-gray-300">
                                                   <span className="text-indigo-400">Location:</span> {formData.location}
                                                 </p>
                                               )}
                                             </div>
                                           </div>
                                         </div>
                                       </motion.div>
                                     </div>

                                     {/* Right Column - Skills, Experience, etc. */}
                                     <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                                       {/* Skills Card */}
                                       <motion.div
                                         initial={{ opacity: 0, y: 50 }}
                                         animate={{ opacity: 1, y: 0 }}
                                         transition={{ delay: 0.2 }}
                                         className="bg-[#1e1e1e] rounded-xl shadow-lg p-4 sm:p-6"
                                       >
                                         <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                                           Skills & Expertise
                                         </h2>
                                         <div className="flex flex-wrap gap-2">
                                           {safeSplit(formData.skills).map((skill, idx) => (
                                             skill.trim() && (
                                               <motion.div
                                                 key={idx}
                                                 initial={{ scale: 0.8, opacity: 0 }}
                                                 animate={{ scale: 1, opacity: 1 }}
                                                 transition={{ delay: 0.3 + (idx * 0.05) }}
                                                 className={`px-3 py-1.5 rounded-full text-sm ${
                                                   idx % 3 === 0 ? 'bg-indigo-600 text-white' :
                                                   idx % 3 === 1 ? 'bg-pink-600 text-white' :
                                                   'bg-teal-600 text-white'
                                                 } font-medium`}
                                               >
                                                 {skill.trim()}
                                               </motion.div>
                                             )
                                           ))}
                                         </div>
                                       </motion.div>

                                       {/* Experience Card */}
                                       {Array.isArray(formData?.experience) && formData.experience?.some(exp => exp.company || exp.position) && (
                                         <motion.div
                                           initial={{ opacity: 0, y: 50 }}
                                           animate={{ opacity: 1, y: 0 }}
                                           transition={{ delay: 0.4 }}
                                           className="bg-[#1e1e1e] rounded-xl shadow-lg p-4 sm:p-6"
                                         >
                                           <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                                             Professional Experience
                                           </h2>
                                           <div className="space-y-4 sm:space-y-6">
                                             {formData.experience.map((exp, idx) =>
                                               (exp.company || exp.position) ? (
                                                 <motion.div
                                                   key={idx}
                                                   initial={{ x: -20, opacity: 0 }}
                                                   animate={{ x: 0, opacity: 1 }}
                                                   transition={{ delay: 0.5 + idx * 0.1 }}
                                                   className="border-l-2 border-indigo-600 pl-3 sm:pl-4 ml-2"
                                                 >
                                                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                                                     <h3 className="text-base sm:text-lg font-semibold text-white">
                                                       {exp.position || "Position"}
                                                     </h3>
                                                     <span className="text-indigo-400 text-sm mt-1 sm:mt-0">
                                                       {exp.duration || "Duration"}
                                                     </span>
                                                   </div>
                                                   <p className="text-gray-300 mb-1">
                                                     {exp.company || "Company"}
                                                   </p>
                                                   <p className="text-gray-400 text-sm">
                                                     {exp.description || "No description provided."}
                                                   </p>
                                                 </motion.div>
                                               ) : null
                                             )}
                                           </div>
                                         </motion.div>
                                       )}

                                       {/* Education Card */}
                                       {formData.education?.some(edu => edu.institution || edu.degree) && (
                                         <motion.div
                                           initial={{ opacity: 0, y: 50 }}
                                           animate={{ opacity: 1, y: 0 }}
                                           transition={{ delay: 0.6 }}
                                           className="bg-[#1e1e1e] rounded-xl shadow-lg p-4 sm:p-6"
                                         >
                                           <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                                             Education
                                           </h2>
                                           <div className="space-y-4 sm:space-y-6">
                                             {formData.education.map((edu, idx) => (
                                               (edu.institution || edu.degree) && (
                                                 <motion.div 
                                                   key={idx}
                                                   initial={{ x: -20, opacity: 0 }}
                                                   animate={{ x: 0, opacity: 1 }}
                                                   transition={{ delay: 0.7 + (idx * 0.1) }}
                                                   className="border-l-2 border-pink-600 pl-3 sm:pl-4 ml-2"
                                                 >
                                                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                                                     <h3 className="text-base sm:text-lg font-semibold text-white">{edu.degree || "Degree"}</h3>
                                                     <span className="text-pink-400 text-sm mt-1 sm:mt-0">{edu.year || "Year"}</span>
                                                   </div>
                                                   <p className="text-gray-300 mb-1">{edu.institution || "Institution"}</p>
                                                   <p className="text-gray-400 text-sm">{edu.description || "No description provided"}</p>
                                                 </motion.div>
                                               )
                                             ))}
                                           </div>
                                         </motion.div>
                                       )}

                                       {/* Projects Card */}
                                       {formData.projects?.some(project => project.title || project.description) && (
                                         <motion.div
                                           initial={{ opacity: 0, y: 50 }}
                                           animate={{ opacity: 1, y: 0 }}
                                           transition={{ delay: 0.7 }}
                                           className="bg-[#1e1e1e] rounded-xl shadow-lg p-4 sm:p-6"
                                         >
                                           <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                                             Projects
                                           </h2>
                                           <div className="space-y-4 sm:space-y-6">
                                             {formData.projects.map((project, idx) =>
                                               (project.title || project.description) ? (
                                                 <motion.div
                                                   key={idx}
                                                   initial={{ x: -20, opacity: 0 }}
                                                   animate={{ x: 0, opacity: 1 }}
                                                   transition={{ delay: 0.8 + idx * 0.1 }}
                                                   className="border-l-2 border-indigo-600 pl-3 sm:pl-4 ml-2"
                                                 >
                                                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                                                     <h3 className="text-base sm:text-lg font-semibold text-white">
                                                       {project.title || "Project Title"}
                                                     </h3>
                                                     {project.link && (
                                                       <a
                                                         href={project.link}
                                                         target="_blank"
                                                         rel="noopener noreferrer"
                                                         className="text-indigo-400 text-sm hover:text-indigo-300 mt-1 sm:mt-0"
                                                       >
                                                         View Project →
                                                       </a>
                                                     )}
                                                   </div>
                                                   <p className="text-gray-400 text-sm mb-2">
                                                     {project.technologies || "Technologies used"}
                                                   </p>
                                                   <p className="text-gray-300">
                                                     {project.description || "No description provided."}
                                                   </p>
                                                 </motion.div>
                                               ) : null
                                             )}
                                           </div>
                                         </motion.div>
                                       )}

                                       {/* Hobbies Card */}
                                       {formData.hobbies && (
                                         <motion.div
                                           initial={{ opacity: 0, y: 50 }}
                                           animate={{ opacity: 1, y: 0 }}
                                           transition={{ delay: 1.0 }}
                                           className="bg-indigo-600 rounded-xl p-4 sm:p-6 text-white"
                                         >
                                           <h2 className="text-xl sm:text-2xl font-bold mb-4">
                                             Hobbies & Interests
                                           </h2>
                                           <div className="flex flex-wrap gap-2">
                                             {formData.hobbies.split(',').map((hobby, idx) => (
                                               hobby.trim() && (
                                                 <motion.span
                                                   key={idx}
                                                   initial={{ scale: 0.8, opacity: 0 }}
                                                   animate={{ scale: 1, opacity: 1 }}
                                                   transition={{ delay: 1.1 + (idx * 0.05) }}
                                                   className="bg-white bg-opacity-20 px-3 py-1.5 rounded-full text-sm"
                                                 >
                                                   {hobby.trim()}
                                                 </motion.span>
                                               )
                                             ))}
                                           </div>
                                         </motion.div>
                                       )}
                                     </div>
                                   </div>
                                 )}
                               </>
                             )}
                           </div>
                         </motion.div>
                       </AnimatePresence>
                     </main>
                   );
                 }