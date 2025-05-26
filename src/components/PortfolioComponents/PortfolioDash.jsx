import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PortfolioDash() {
  // Load data from localStorage on initial render
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: "",
    socialLinks: {
      linkedin: "",
      github: "",
      twitter: "",
      portfolio: ""
    },
    experience: [
      { company: "", position: "", duration: "", description: "" }
    ],
    education: [
      { institution: "", degree: "", year: "", description: "" }
    ],
    projects: [
      { title: "", description: "", technologies: "", link: "" }
    ],
    hobbies: ""
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("resumeData");
    const publishStatus = localStorage.getItem("portfolioPublished");
    
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    
    if (publishStatus === "true") {
      setPublished(true);
    }
    
    // Simulate loading state
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle social links changes
  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [name]: value
      }
    });
  };

  // Handle array field changes (experience, education, projects)
  const handleArrayChange = (e, index, arrayName) => {
    const { name, value } = e.target;
    const newArray = [...formData[arrayName]];
    newArray[index] = {
      ...newArray[index],
      [name]: value
    };
    
    setFormData({
      ...formData,
      [arrayName]: newArray
    });
  };

  // Add new item to arrays (experience, education, projects)
  const addItem = (arrayName) => {
    let newItem = {};
    
    if (arrayName === "experience") {
      newItem = { company: "", position: "", duration: "", description: "" };
    } else if (arrayName === "education") {
      newItem = { institution: "", degree: "", year: "", description: "" };
    } else if (arrayName === "projects") {
      newItem = { title: "", description: "", technologies: "", link: "" };
    }
    
    setFormData({
      ...formData,
      [arrayName]: [...formData[arrayName], newItem]
    });
  };

  // Remove item from arrays (experience, education, projects)
  const removeItem = (index, arrayName) => {
    const newArray = [...formData[arrayName]];
    newArray.splice(index, 1);
    
    // Don't allow empty arrays
    if (newArray.length === 0) {
      return;
    }
    
    setFormData({
      ...formData,
      [arrayName]: newArray
    });
  };

  // Handle publish action
  const handlePublish = () => {
    // Save to localStorage
    localStorage.setItem("portfolioData", JSON.stringify(formData));
    localStorage.setItem("portfolioPublished", "true");
    setPublished(true);
  };

  // Handle unpublish action
  const handleUnpublish = () => {
    localStorage.setItem("portfolioPublished", "false");
    setPublished(false);
  };

  // Button component consistent with the reference
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
      formData.name.trim() !== "" && 
      formData.email.trim() !== "" &&
      formData.skills.trim() !== ""
    );
  };

  // Loading state
  if (loading) return (
    <main className="flex-1 bg-[#131515] overflow-auto">
      <div className="flex items-center justify-center h-full text-white">
        <div className="animate-pulse text-xl">Loading portfolio dashboard...</div>
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
                  Create Your Portfolio
                </h1>
                <p className="text-gray-300 mb-8 text-center">
                  Fill in your details to create a professional portfolio that showcases your skills and experience.
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
                  
                  {/* Social Links Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Social Links</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-white font-medium">LinkedIn</label>
                        <input
                          type="url"
                          name="linkedin"
                          value={formData.socialLinks.linkedin}
                          onChange={handleSocialChange}
                          className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-white font-medium">GitHub</label>
                        <input
                          type="url"
                          name="github"
                          value={formData.socialLinks.github}
                          onChange={handleSocialChange}
                          className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          placeholder="https://github.com/username"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-white font-medium">Twitter</label>
                        <input
                          type="url"
                          name="twitter"
                          value={formData.socialLinks.twitter}
                          onChange={handleSocialChange}
                          className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-white font-medium">Portfolio Website</label>
                        <input
                          type="url"
                          name="portfolio"
                          value={formData.socialLinks.portfolio}
                          onChange={handleSocialChange}
                          className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
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
                    
                    {formData.projects.map((proj, index) => (
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
                            <label className="block text-white font-medium">Project Title</label>
                            <input
                              type="text"
                              name="title"
                              value={proj.title}
                              onChange={(e) => handleArrayChange(e, index, "projects")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="Project Name"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-white font-medium">Project Link</label>
                            <input
                              type="url"
                              name="link"
                              value={proj.link}
                              onChange={(e) => handleArrayChange(e, index, "projects")}
                              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="https://github.com/yourusername/project"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-white font-medium">Technologies Used</label>
                          <input
                            type="text"
                            name="technologies"
                            value={proj.technologies}
                            onChange={(e) => handleArrayChange(e, index, "projects")}
                            className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="React, Node.js, MongoDB"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-white font-medium">Project Description</label>
                          <textarea
                            name="description"
                            value={proj.description}
                            onChange={(e) => handleArrayChange(e, index, "projects")}
                            className="w-full h-24 bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="Describe what the project does and your role..."
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
                  
                  {/* Publish Button */}
                  <div className="pt-6">
                    <Button 
                      text="Publish Portfolio" 
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
              // PUBLISHED PORTFOLIO VIEW
              <>
                <div className="flex justify-between items-center mb-8">
                  <Button
                    text="Modify Portfolio"
                    onClick={handleUnpublish}
                    variant="secondary"
                  />
                  <motion.h2 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl font-bold text-white"
                  >
                    {formData.name}'s Portfolio
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
                        
                        {/* Social Links */}
                        <div className="pt-4 border-t border-gray-700">
                          <h3 className="text-lg font-medium text-white mb-3">Connect With Me</h3>
                          <div className="flex justify-center space-x-4">
                           {formData.socialLinks &&
  Object.entries(formData.socialLinks).map(([platform, url]) => (
    url && (
      <div key={platform} className="text-indigo-400 hover:text-indigo-300">
        {platform.charAt(0).toUpperCase() + platform.slice(1)}
      </div>
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
                        {formData.skills.split(',').map((skill, idx) => (
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
    className="bg-[#1e1e1e] rounded-xl shadow-lg p-6"
  >
    <h2 className="text-2xl font-bold text-white mb-6">
      Professional Experience
    </h2>
    <div className="space-y-6">
      {formData.experience.map((exp, idx) =>
        (exp.company || exp.position) ? (
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
                        className="bg-[#1e1e1e] rounded-xl shadow-lg p-6"
                      >
                        <h2 className="text-2xl font-bold text-white mb-6">
                          Education
                        </h2>
                        <div className="space-y-6">
                          {formData.education.map((edu, idx) => (
                            (edu.institution || edu.degree) && (
                              <motion.div 
                                key={idx}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7 + (idx * 0.1) }}
                                className="border-l-2 border-pink-600 pl-4 ml-2"
                              >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                                  <h3 className="text-lg font-semibold text-white">{edu.degree || "Degree"}</h3>
                                  <span className="text-pink-400 text-sm">{edu.year || "Year"}</span>
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
                    {Array.isArray(formData?.projects) && formData.projects.some(proj => proj.title || proj.description) && (
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
        (proj.title || proj.description) && (
          <motion.div
            key={idx}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.9 + (idx * 0.1) }}
            className="bg-[#242424] p-4 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-white mb-2">{proj.title || "Project Title"}</h3>
            {proj.technologies && (
              <div className="flex flex-wrap gap-1 mb-3">
                {proj.technologies.split(',').map((tech, techIdx) => (
                  tech.trim() && (
                    <span 
                      key={techIdx} 
                      className="bg-teal-600 bg-opacity-30 text-teal-300 text-xs px-2 py-1 rounded"
                    >
                      {tech.trim()}
                    </span>
                  )
                ))}
              </div>
            )}
            <p className="text-gray-400 text-sm mb-3">{proj.description || "No description provided"}</p>
            {proj.link && (
              <a href={proj.link} className="text-indigo-400 text-sm hover:underline">
                View Project →
              </a>
            )}
          </motion.div>
        )
      ))}
    </div>
  </motion.div>
)}


                    {/* Hobbies Card */}
                    {formData.hobbies && (
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        className="bg-indigo-600 rounded-xl p-6 text-white"
                      >
                        <h2 className="text-2xl font-bold mb-4">
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
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}