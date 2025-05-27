import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { exportToPdf } from '../../lib/latex/resumeTemplate';

export default function ResumeBuilderDash() {
  localStorage.removeItem("resumeData");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    basics: {
      name: "",
      label: "",
      image: "",
      email: "",
      phone: "",
      url: "",
      summary: "",
      location: {
        address: "",
        postalCode: "",
        city: "",
        countryCode: "",
        region: ""
      },
      profiles: [
        {
          network: "",
          username: "",
          url: ""
        }
      ]
    },
    work: [],
    volunteer: [],
    education: [],
    awards: [],
    certificates: [],
    publications: [],
    skills: [],
    languages: [],
    interests: [],
    references: [],
    projects: []
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("resumeData");
    const publishStatus = localStorage.getItem("resumePublished");
    
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
    } else {
      // Set default data for new users with only one empty item for each section
      setFormData(prev => ({
        ...prev,
        work: [{ name: "", position: "", url: "", startDate: "", endDate: "", summary: "", highlights: [""] }],
        education: [{ institution: "", url: "", area: "", studyType: "", startDate: "", endDate: "", score: "", courses: [""] }],
        skills: [{ name: "", level: "", keywords: [""] }],
        projects: [{ name: "", startDate: "", endDate: "", description: "", highlights: [""], url: "" }]
      }));
    }
    
    if (publishStatus === "true") {
      setPublished(true);
    }
    
    // Simulate loading state
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  // Handle input changes for basics
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      basics: {
        ...prev.basics,
        [name]: value
      }
    }));
  };

  // Handle location changes
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      basics: {
        ...prev.basics,
        location: {
          ...prev.basics.location,
          [name]: value
        }
      }
    }));
  };

  // Handle array field changes (work, education, projects)
  const handleArrayChange = (e, index, arrayName) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index] = {
        ...newArray[index],
        [name]: value
      };
      return {
        ...prev,
        [arrayName]: newArray
      };
    });
  };

  // Add new item to arrays
  const addItem = (arrayName) => {
    let newItem = {};
    
    switch(arrayName) {
      case "work":
        newItem = {
          name: "",
          position: "",
          url: "",
          startDate: "",
          endDate: "",
          summary: "",
          highlights: [""]
        };
        break;
      case "volunteer":
        newItem = {
          organization: "",
          position: "",
          url: "",
          startDate: "",
          endDate: "",
          summary: "",
          highlights: [""]
        };
        break;
      case "education":
        newItem = {
          institution: "",
          url: "",
          area: "",
          studyType: "",
          startDate: "",
          endDate: "",
          score: "",
          courses: [""]
        };
        break;
      case "awards":
        newItem = {
          title: "",
          date: "",
          awarder: "",
          summary: ""
        };
        break;
      case "certificates":
        newItem = {
          name: "",
          date: "",
          issuer: "",
          url: ""
        };
        break;
      case "publications":
        newItem = {
          name: "",
          publisher: "",
          releaseDate: "",
          url: "",
          summary: ""
        };
        break;
      case "skills":
        newItem = {
          name: "",
          level: "",
          keywords: [""]
        };
        break;
      case "languages":
        newItem = {
          language: "",
          fluency: ""
        };
        break;
      case "interests":
        newItem = {
          name: "",
          keywords: [""]
        };
        break;
      case "references":
        newItem = {
          name: "",
          reference: ""
        };
        break;
      case "projects":
        newItem = {
          name: "",
          startDate: "",
          endDate: "",
          description: "",
          highlights: [""],
          url: ""
        };
        break;
      default:
        return;
    }
    
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], newItem]
    }));
  };

  // Remove item from arrays
  const removeItem = (index, arrayName) => {
    setFormData(prev => {
      const newArray = [...prev[arrayName]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [arrayName]: newArray
      };
    });
  };

  // Handle publish action
  const handlePublish = () => {
    localStorage.setItem("resumeData", JSON.stringify(formData));
    localStorage.setItem("resumePublished", "true");
    setPublished(true);
  };

  // Handle unpublish action
  const handleUnpublish = () => {
    localStorage.setItem("resumePublished", "false");
    setPublished(false);
  };

  // Add export to PDF function
  const handleExportPdf = async () => {
    try {
      await exportToPdf(formData);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
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
    return (
      formData.basics.name.trim() !== "" && 
      formData.basics.email.trim() !== "" &&
      formData.skills[0]?.keywords.length > 0
    );
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
                          value={formData.basics.name}
                          onChange={handleBasicChange}
                          className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-white font-medium">Professional Title</label>
                        <input
                          type="text"
                          name="label"
                          value={formData.basics.label}
                          onChange={handleBasicChange}
                          className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          placeholder="Software Engineer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-white font-medium">Email Address*</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.basics.email}
                          onChange={handleBasicChange}
                          className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          placeholder="john.doe@example.com"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-white font-medium">Phone Number</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.basics.phone}
                          onChange={handleBasicChange}
                          className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-white font-medium">Website</label>
                        <input
                          type="url"
                          name="url"
                          value={formData.basics.url}
                          onChange={handleBasicChange}
                          className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          placeholder="https://johndoe.com"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-white font-medium">Profile Image URL</label>
                        <input
                          type="url"
                          name="image"
                          value={formData.basics.image}
                          onChange={handleBasicChange}
                          className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          placeholder="https://example.com/profile.jpg"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-white font-medium">Bio / Summary</label>
                      <textarea
                        name="summary"
                        value={formData.basics.summary}
                        onChange={handleBasicChange}
                        className="w-full h-24 bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="Write a brief introduction about yourself..."
                      />
                    </div>

                    {/* Location Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Location</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-white font-medium">Address</label>
                          <input
                            type="text"
                            name="address"
                            value={formData.basics.location.address}
                            onChange={handleLocationChange}
                            className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="123 Main St"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-white font-medium">Postal Code</label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.basics.location.postalCode}
                            onChange={handleLocationChange}
                            className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="12345"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="block text-white font-medium">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.basics.location.city}
                            onChange={handleLocationChange}
                            className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="New York"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-white font-medium">Region</label>
                          <input
                            type="text"
                            name="region"
                            value={formData.basics.location.region}
                            onChange={handleLocationChange}
                            className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="NY"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-white font-medium">Country Code</label>
                          <input
                            type="text"
                            name="countryCode"
                            value={formData.basics.location.countryCode}
                            onChange={handleLocationChange}
                            className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="US"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Social Profiles */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">Social Profiles</h3>
                        <Button 
                          text="Add Profile" 
                          onClick={() => addItem("profiles")}
                          variant="secondary"
                          className="text-sm px-3 py-1"
                        />
                      </div>
                      
                      {formData.basics.profiles.map((profile, index) => (
                        <div key={index} className="bg-[#242424] p-4 rounded-lg space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-white font-medium">Profile #{index + 1}</h4>
                            {formData.basics.profiles.length > 1 && (
                              <button
                                onClick={() => {
                                  const newProfiles = [...formData.basics.profiles];
                                  newProfiles.splice(index, 1);
                                  setFormData(prev => ({
                                    ...prev,
                                    basics: {
                                      ...prev.basics,
                                      profiles: newProfiles
                                    }
                                  }));
                                }}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block text-white font-medium">Network</label>
                              <input
                                type="text"
                                name="network"
                                value={profile.network}
                                onChange={(e) => {
                                  const newProfiles = [...formData.basics.profiles];
                                  newProfiles[index] = {
                                    ...newProfiles[index],
                                    network: e.target.value
                                  };
                                  setFormData(prev => ({
                                    ...prev,
                                    basics: {
                                      ...prev.basics,
                                      profiles: newProfiles
                                    }
                                  }));
                                }}
                                className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="LinkedIn"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="block text-white font-medium">Username</label>
                              <input
                                type="text"
                                name="username"
                                value={profile.username}
                                onChange={(e) => {
                                  const newProfiles = [...formData.basics.profiles];
                                  newProfiles[index] = {
                                    ...newProfiles[index],
                                    username: e.target.value
                                  };
                                  setFormData(prev => ({
                                    ...prev,
                                    basics: {
                                      ...prev.basics,
                                      profiles: newProfiles
                                    }
                                  }));
                                }}
                                className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="johndoe"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-white font-medium">URL</label>
                            <input
                              type="url"
                              name="url"
                              value={profile.url}
                              onChange={(e) => {
                                const newProfiles = [...formData.basics.profiles];
                                newProfiles[index] = {
                                  ...newProfiles[index],
                                  url: e.target.value
                                };
                                setFormData(prev => ({
                                  ...prev,
                                  basics: {
                                    ...prev.basics,
                                    profiles: newProfiles
                                  }
                                }));
                              }}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="https://linkedin.com/in/johndoe"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Experience Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                      <h2 className="text-xl font-semibold text-white">Experience</h2>
                      <Button 
                        text="Add Experience" 
                        onClick={() => addItem("work")}
                        variant="secondary"
                        className="text-sm px-3 py-1"
                      />
                    </div>
                    
                    {formData.work.map((exp, index) => (
                      <div key={index} className="bg-[#242424] p-4 rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-white font-medium">Experience #{index + 1}</h3>
                          {formData.work.length > 1 && (
                            <button
                              onClick={() => removeItem(index, "work")}
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
                              name="name"
                              value={exp.name}
                              onChange={(e) => handleArrayChange(e, index, "work")}
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
                              onChange={(e) => handleArrayChange(e, index, "work")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="Job Title"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-white font-medium">Start Date</label>
                            <input
                              type="text"
                              name="startDate"
                              value={exp.startDate}
                              onChange={(e) => handleArrayChange(e, index, "work")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="Jan 2020"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-white font-medium">End Date</label>
                            <input
                              type="text"
                              name="endDate"
                              value={exp.endDate}
                              onChange={(e) => handleArrayChange(e, index, "work")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="Present"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-white font-medium">Description</label>
                          <textarea
                            name="summary"
                            value={exp.summary}
                            onChange={(e) => handleArrayChange(e, index, "work")}
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
                              name="studyType"
                              value={edu.studyType}
                              onChange={(e) => handleArrayChange(e, index, "education")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="Bachelor of Science"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-white font-medium">Field of Study</label>
                            <input
                              type="text"
                              name="area"
                              value={edu.area}
                              onChange={(e) => handleArrayChange(e, index, "education")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="Computer Science"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-white font-medium">Score</label>
                            <input
                              type="text"
                              name="score"
                              value={edu.score}
                              onChange={(e) => handleArrayChange(e, index, "education")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="GPA: 3.8"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-white font-medium">Start Date</label>
                            <input
                              type="text"
                              name="startDate"
                              value={edu.startDate}
                              onChange={(e) => handleArrayChange(e, index, "education")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="2016"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-white font-medium">End Date</label>
                            <input
                              type="text"
                              name="endDate"
                              value={edu.endDate}
                              onChange={(e) => handleArrayChange(e, index, "education")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="2020"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Skills Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Skills*</h2>
                    <div className="space-y-2">
                      <label className="block text-white font-medium">List your skills (separated by commas)</label>
                      <textarea
                        name="keywords"
                        value={formData.skills[0]?.keywords.join(', ') || ''}
                        onChange={(e) => {
                          const keywords = e.target.value.split(',').map(k => k.trim());
                          setFormData(prev => ({
                            ...prev,
                            skills: [{
                              name: "Technical Skills",
                              level: "Expert",
                              keywords
                            }]
                          }));
                        }}
                        className="w-full h-24 bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="JavaScript, React, Node.js, CSS, HTML, etc."
                      />
                    </div>
                  </div>

                  {/* Languages Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                      <h2 className="text-xl font-semibold text-white">Languages</h2>
                      <Button 
                        text="Add Language" 
                        onClick={() => addItem("languages")}
                        variant="secondary"
                        className="text-sm px-3 py-1"
                      />
                    </div>
                    
                    {formData.languages.map((lang, index) => (
                      <div key={index} className="bg-[#242424] p-4 rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-white font-medium">Language #{index + 1}</h3>
                          {formData.languages.length > 1 && (
                            <button
                              onClick={() => removeItem(index, "languages")}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-white font-medium">Language</label>
                            <input
                              type="text"
                              name="language"
                              value={lang.language}
                              onChange={(e) => handleArrayChange(e, index, "languages")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="English"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-white font-medium">Fluency</label>
                            <input
                              type="text"
                              name="fluency"
                              value={lang.fluency}
                              onChange={(e) => handleArrayChange(e, index, "languages")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="Native"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Awards Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                      <h2 className="text-xl font-semibold text-white">Awards</h2>
                      <Button 
                        text="Add Award" 
                        onClick={() => addItem("awards")}
                        variant="secondary"
                        className="text-sm px-3 py-1"
                      />
                    </div>
                    
                    {formData.awards.map((award, index) => (
                      <div key={index} className="bg-[#242424] p-4 rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-white font-medium">Award #{index + 1}</h3>
                          {formData.awards.length > 1 && (
                            <button
                              onClick={() => removeItem(index, "awards")}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-white font-medium">Title</label>
                            <input
                              type="text"
                              name="title"
                              value={award.title}
                              onChange={(e) => handleArrayChange(e, index, "awards")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="Employee of the Year"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-white font-medium">Date</label>
                            <input
                              type="text"
                              name="date"
                              value={award.date}
                              onChange={(e) => handleArrayChange(e, index, "awards")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="2023"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-white font-medium">Description</label>
                          <textarea
                            name="summary"
                            value={award.summary}
                            onChange={(e) => handleArrayChange(e, index, "awards")}
                            className="w-full h-24 bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="Describe the award and its significance..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Interests Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Interests</h2>
                    <div className="space-y-2">
                      <label className="block text-white font-medium">List your interests (separated by commas)</label>
                      <textarea
                        name="interests"
                        value={formData.interests.join(', ')}
                        onChange={(e) => {
                          const interests = e.target.value.split(',').map(i => i.trim());
                          setFormData(prev => ({
                            ...prev,
                            interests
                          }));
                        }}
                        className="w-full h-24 bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="Reading, Hiking, Photography, etc."
                      />
                    </div>
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
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-white font-medium">Project Name</label>
                            <input
                              type="text"
                              name="name"
                              value={project.name}
                              onChange={(e) => handleArrayChange(e, index, "projects")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="Project Name"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-white font-medium">Project URL</label>
                            <input
                              type="url"
                              name="url"
                              value={project.url}
                              onChange={(e) => handleArrayChange(e, index, "projects")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="https://github.com/username/project"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-white font-medium">Start Date</label>
                            <input
                              type="text"
                              name="startDate"
                              value={project.startDate}
                              onChange={(e) => handleArrayChange(e, index, "projects")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="Jan 2023"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-white font-medium">End Date</label>
                            <input
                              type="text"
                              name="endDate"
                              value={project.endDate}
                              onChange={(e) => handleArrayChange(e, index, "projects")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="Present"
                            />
                          </div>
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
                          <label className="block text-white font-medium">Highlights</label>
                          <textarea
                            name="highlights"
                            value={project.highlights.join('\n')}
                            onChange={(e) => {
                              const highlights = e.target.value.split('\n').filter(h => h.trim());
                              setFormData(prev => {
                                const newProjects = [...prev.projects];
                                newProjects[index] = {
                                  ...newProjects[index],
                                  highlights
                                };
                                return {
                                  ...prev,
                                  projects: newProjects
                                };
                              });
                            }}
                            className="w-full h-24 bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="Enter each highlight on a new line"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-6">
                    <Button 
                      text="Publish Resume" 
                      onClick={handlePublish}
                      className="w-full py-3"
                      disabled={!isFormValid()}
                    />
                    {!isFormValid() && (
                      <p className="text-red-400 text-sm mt-2 text-center">
                        Please fill all required fields marked with *
                      </p>
                    )}
                  </div>
                </form>
              </motion.div>
            ) : (
              <>
                <div className="flex justify-end mb-4">
                  <Button
                    text="Export as PDF"
                    onClick={handleExportPdf}
                    variant="secondary"
                    className="mr-2"
                  />
                  <Button
                    text="Edit Resume"
                    onClick={handleUnpublish}
                    variant="primary"
                  />
                </div>
                <div className="flex justify-between items-center mb-8">
                  <motion.h2 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl font-bold text-white"
                  >
                    {formData.basics.name}'s Portfolio
                  </motion.h2>
                  <div className="w-24" />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Personal Info */}
                  <div className="lg:col-span-1">
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#1e1e1e] rounded-xl p-6 h-full"
                    >
                      <div className="mx-auto w-48 h-48 mb-6 bg-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {formData.basics.name.split(' ').map(name => name[0]).join('')}
                        </span>
                      </div>

                      <div className="space-y-4 text-center">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white">
                          {formData.basics.name}
                        </h2>
                        <p className="text-gray-300 text-base">
                          {formData.basics.summary || "No bio provided"}
                        </p>
                        
                        <div className="pt-4 border-t border-gray-700">
                          <div className="flex flex-col space-y-2">
                            {formData.basics.email && (
                              <p className="text-gray-300">
                                <span className="text-indigo-400">Email:</span> {formData.basics.email}
                              </p>
                            )}
                            {formData.basics.phone && (
                              <p className="text-gray-300">
                                <span className="text-indigo-400">Phone:</span> {formData.basics.phone}
                              </p>
                            )}
                            {formData.basics.location.city && (
                              <p className="text-gray-300">
                                <span className="text-indigo-400">Location:</span> {formData.basics.location.city}, {formData.basics.location.countryCode}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Social Links */}
                        <div className="pt-4 border-t border-gray-700">
                          <h3 className="text-lg font-medium text-white mb-3">Connect With Me</h3>
                          <div className="flex justify-center space-x-4">
                            {formData.basics.profiles.map((profile, index) => (
                              profile?.network && (
                                <a 
                                  key={index} 
                                  href={profile.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-indigo-400 hover:text-indigo-300"
                                >
                                  {profile.network}
                                </a>
                              )
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Column - Skills, Experience, etc. */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Skills Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-[#1e1e1e] rounded-xl shadow-lg p-6"
                    >
                      <h2 className="text-2xl font-bold text-white mb-6">
                        Skills & Expertise
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills[0]?.keywords.map((skill, idx) => (
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
                    {Array.isArray(formData.work) && formData.work?.some(exp => exp.name || exp.position) && (
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-[#1e1e1e] rounded-xl shadow-lg p-6"
                      >
                        <h2 className="text-2xl font-bold text-white mb-6">
                          Professional Experience
                        </h2>
                        <div className="space-y-6">
                          {formData.work.map((exp, idx) =>
                            (exp.name || exp.position) ? (
                              <motion.div
                                key={idx}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 + idx * 0.1 }}
                                className="border-l-2 border-indigo-600 pl-4 ml-2"
                              >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                                  <h3 className="text-lg font-semibold text-white">
                                    {exp.position || "Position"}
                                  </h3>
                                  <span className="text-indigo-400 text-sm">
                                    {exp.startDate || "Start Date"} - {exp.endDate || "End Date"}
                                  </span>
                                </div>
                                <p className="text-gray-300 mb-1">
                                  {exp.name || "Company"}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  {exp.summary || "No summary provided."}
                                </p>
                              </motion.div>
                            ) : null
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Education Card */}
                    {formData.education?.some(edu => edu.institution || edu.studyType) && (
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-[#1e1e1e] rounded-xl shadow-lg p-6"
                      >
                        <h2 className="text-2xl font-bold text-white mb-6">
                          Education
                        </h2>
                        <div className="space-y-6">
                          {formData.education.map((edu, idx) => (
                            (edu.institution || edu.studyType) && (
                              <motion.div 
                                key={idx}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7 + (idx * 0.1) }}
                                className="border-l-2 border-pink-600 pl-4 ml-2"
                              >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                                  <h3 className="text-lg font-semibold text-white">{edu.studyType || "Degree"}</h3>
                                  <span className="text-pink-400 text-sm">{edu.startDate || "Start Date"} - {edu.endDate || "End Date"}</span>
                                </div>
                                <p className="text-gray-300 mb-1">{edu.institution || "Institution"}</p>
                                <p className="text-gray-400 text-sm">{edu.area || "No area provided"}</p>
                              </motion.div>
                            )
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Projects Card */}
                    {Array.isArray(formData.projects) && formData.projects.some(proj => proj.name || proj.description) && (
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-[#1e1e1e] rounded-xl shadow-lg p-6"
                      >
                        <h2 className="text-2xl font-bold text-white mb-6">
                          Projects
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {formData.projects.map((proj, idx) => (
                            (proj.name || proj.description) && (
                              <motion.div
                                key={idx}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.9 + (idx * 0.1) }}
                                className="bg-[#242424] p-4 rounded-lg"
                              >
                                <h3 className="text-lg font-semibold text-white mb-2">{proj.name || "Project Title"}</h3>
                                <p className="text-gray-400 text-sm mb-3">{proj.description || "No description provided"}</p>
                                {proj.url && (
                                  <a href={proj.url} className="text-indigo-400 text-sm hover:underline">
                                    View Project →
                                  </a>
                                )}
                              </motion.div>
                            )
                          ))}
                        </div>
                      </motion.div>
                    )}
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