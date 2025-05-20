import React from "react";

export default function Sidebar({ activeTab, setActiveTab, isOpen, toggleSidebar }) {
  const menuItems = [
    "ATS Metrics",
    "Resume Builder",
    "Interview Questions Generator",
    "Portfolio",
    "Job Portal",
    "Profile"
  ];

  return (
    <div className={`bg-[#1A1A1A] text-white w-84 h-full flex flex-col  px-3 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      {/* User profile section */}
      <div className="p-6 flex items-center space-x-4 border-b border-gray-700">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-xl font-bold">U</span>
        </div>
        <div>
          <h3 className="font-semibold">User Name</h3>
          <p className="text-sm text-gray-400">Pro Member</p>
        </div>
      </div>

      {/* Menu items */}
      <nav className="flex-1 py-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item}>
              <button
                onClick={() => setActiveTab(item)}
                className={`w-full text-left py-3 px-6 flex items-center space-x-3 hover:bg-blue-600 transition-colors ${
                  activeTab === item ? "bg-blue-700 border-l-4 border-blue-400" : ""
                }`}
              >
                <div className="w-5 h-5">
                  {/* Add icons for tabs (same as before) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        item === "ATS Metrics"
                          ? "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          : item === "Resume Builder"
                          ? "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          : item === "Interview Questions Generator"
                          ? "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          : item === "Portfolio"
                          ? "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          : item === "Job Portal"
                          ? "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          : "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      }
                    />
                  </svg>
                </div>
                <span>{item}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section with settings and logout */}
      <div className="p-4 border-t border-gray-700">
        <button className="w-full py-2 px-4 rounded flex items-center space-x-3 hover:bg-gray-700 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}