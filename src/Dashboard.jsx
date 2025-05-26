import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ATSDash from "./components/ATSComponents/AtsDash";
import InterviewQuestionsGenerator from "./components/InterviewGenComponents/InterviewGenDash";
import ProfileDash from "./components/ProfileComponents/ProfileDash";
import PortfolioDash from "./components/PortfolioComponents/PortfolioDash";
import ResumeBuilderDash from "./components/ResumeBuildComponents/ResumeBuildDash";
import JobPortalDash from "./components/JobPortalComponents/JobPortalDash";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("ATS Metrics");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebarElement = document.getElementById('sidebar');
      const hamburgerButton = document.getElementById('hamburger-button');
      
      if (
        isSidebarOpen && 
        sidebarElement && 
        !sidebarElement.contains(event.target) && 
        hamburgerButton && 
        !hamburgerButton.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    // Only add listener on mobile screens
    if (window.innerWidth < 768) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Close sidebar when tab changes on mobile
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Interview Questions Generator":
        return <InterviewQuestionsGenerator />;
      case "ATS Metrics":
        return <ATSDash />;
      case "Resume Builder":
        return <ResumeBuilderDash/>;
     
      case "Job Portal":
        return <JobPortalDash/>;
      case "Profile":
        return <ProfileDash />;
      default:
        return (
          <div className="h-full flex items-center justify-center text-white text-2xl">
            Default Component
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      {/* Mobile overlay when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#131515]  z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        id="sidebar"
        className={`fixed md:static h-full z-30 md:z-auto`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange} 
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 overflow-y-auto bg-[#131515] w-full ${isSidebarOpen ? 'md:ml-0' : 'ml-0'}`}>
        {renderActiveTab()}
      </div>

      {/* Hamburger button for mobile */}
      <button
        id="hamburger-button"
        className="fixed top-4 right-4 z-40 md:hidden bg-[#131515] border-white text-white p-2 rounded shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        )}
      </button>
    </div>
  );
}