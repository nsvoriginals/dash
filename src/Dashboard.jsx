import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ATSDash from "./components/ATSComponents/AtsDash";
import InterviewQuestionsGenerator from "./components/InterviewGenComponents/InterviewGenDash";
import ProfileDash from "./components/ProfileComponents/ProfileDash";
import PortfolioDash from "./components/PortfolioComponents/PortfolioDash";
import ResumeBuilderDash from "./components/ResumeBuildComponents/ResumeBuildDash";
import JobPortalDash from "./components/JobPortalComponents/JobPortalDash";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Profile Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Interview Questions Generator":
        return <InterviewQuestionsGenerator />;
      case "ATS Metrics":
        return <ATSDash />;
      case "Resume Builder":
        return <ResumeBuilderDash />;
      case "Job Portal":
        return <JobPortalDash />;
      case "Profile":
        return <ProfileDash />;
      default:
        return <ProfileDash/>
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-Tensor">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange} 
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Area */}
      <div className={`
        flex-1 
        overflow-y-auto 
        bg-[#131515] 
        transition-all duration-300
        ${isSidebarOpen ? 'md:ml-0' : 'ml-0'}
      `}>
        {/* Mobile Header with Hamburger */}
        <div className="md:hidden bg-[#1A1A1A] p-4 flex justify-between items-center border-b border-gray-700">
          <h1 className="text-white text-xl font-semibold">Dashboard</h1>
          <button
            className="text-white p-2 hover:bg-gray-700 rounded transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16m-7 6h7" 
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="h-full">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
}