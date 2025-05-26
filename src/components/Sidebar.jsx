import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "./Home/Button";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Features", href: "#features" },
  { label: "Integrations", href: "#integrations" },
  { label: "FAQs", href: "#faqs" },
];

export default function Sidebar({ onTabChange }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Close sidebar on desktop
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isOpen && !event.target.closest('.sidebar-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen && isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, isMobile]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isMobile]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
    // Close mobile menu when tab is selected
    if (isMobile) {
      setIsOpen(false);
    }
  };

  
const handleLogout = () => {
  localStorage.clear();
  setToken(null); // This will cause a re-render
  navigate("/");
};

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-[100] p-2 bg-[#1e1e1e] text-white rounded-lg border border-white/10 md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[90] md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(!isMobile || isOpen) && (
          <motion.div
            initial={isMobile ? { x: -280 } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -280 } : {}}
            transition={{ type: "tween", duration: 0.3 }}
            className={twMerge(
              "sidebar-container h-full bg-[#1e1e1e] border-r border-white/10 flex flex-col",
              isMobile 
                ? "fixed top-0 left-0 w-72 z-[95]" 
                : "w-64 relative"
            )}
          >
            {/* Logo */}
            <div className="p-4 border-b border-white/10">
              <h1 className="text-xl font-bold text-white">ATLAS</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-2 px-4">
                <li>
                  <button
                    onClick={() => handleTabClick("Profile")}
                    className={twMerge(
                      "w-full text-left px-4 py-2 rounded-lg transition-colors",
                      activeTab === "Profile"
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-white/5"
                    )}
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabClick("Resume Builder")}
                    className={twMerge(
                      "w-full text-left px-4 py-2 rounded-lg transition-colors",
                      activeTab === "Resume Builder"
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-white/5"
                    )}
                  >
                    Resume Builder
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabClick("ATS Metrics")}
                    className={twMerge(
                      "w-full text-left px-4 py-2 rounded-lg transition-colors",
                      activeTab === "ATS Metrics"
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-white/5"
                    )}
                  >
                    ATS Metrics
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabClick("Interview Questions Generator")}
                    className={twMerge(
                      "w-full text-left px-4 py-2 rounded-lg transition-colors",
                      activeTab === "Interview Questions Generator"
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-white/5"
                    )}
                  >
                    Interview Questions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabClick("Job Portal")}
                    className={twMerge(
                      "w-full text-left px-4 py-2 rounded-lg transition-colors",
                      activeTab === "Job Portal"
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-white/5"
                    )}
                  >
                    Job Portal
                  </button>
                </li>
              </ul>
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}