import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "./Button";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const links = ["Docs", "About", "Contact"];
  const token = localStorage.getItem("token");

  // Update active index based on current route
  useEffect(() => {
    const path = location.pathname.split('/')[1];
    const index = links.findIndex(link => link.toLowerCase() === path);
    if (index !== -1) setActiveIndex(index);
  }, [location]);

  return (
    <div className="sticky top-0 z-50 bg-[#1e1e1e]/80 backdrop-blur-lg border-b border-gray-700 shadow-sm max-w-screen-xl mx-auto py-4 md:py-6 px-4 md:px-10 flex items-center rounded-full">
      {/* Logo */}
      <h1 
        className="font-base text-2xl font-bold flex-1 md:mr-24 cursor-pointer text-white" 
        onClick={() => navigate('/')}
      >
        Atlas
      </h1>

      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-1 justify-center">
        <div className="flex items-center gap-8 lg:gap-10">
          {links.map((text, index) => (
            <Link
              key={index}
              className="relative font-base flex items-center gap-2 text-white"
              to={`/${text.toLowerCase()}`}
              onClick={() => setActiveIndex(index)}
            >
              <span
                className={`absolute -left-3 transition-all duration-300 ease-out transform ${
                  activeIndex === index ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-blue-400"></span>
              </span>
              <span className="pl-1">{text}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-700 hover:text-blue-500 focus:outline-none"
        >
          {isMobileMenuOpen ? <FiX size={24} className="text-white" /> : <FiMenu size={24} className="text-white" />}
        </button>
      </div>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex flex-1 justify-end gap-4 lg:gap-5">
        {!token ? (
          <>
            <Button onClick={() => navigate("/auth/signin")} text="Login" size="small" />
            <Button onClick={() => navigate("/auth/signup")} text="Register" size="small" variant="secondary" />
          </>
        ) : (
          <>
            <Button onClick={() => navigate("/user/profile")} text="Dashboard" size="small" />
            <Button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/auth/signin");
              }}
              text="Logout"
              size="small"
              variant="secondary"
            />
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#1e1e1e]/95 backdrop-blur-lg border-t border-gray-700 shadow-lg rounded-b-2xl md:hidden">
          <div className="px-6 py-4 space-y-4">
            {links.map((text, index) => (
              <Link
                key={index}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  activeIndex === index 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-300 hover:bg-gray-50'
                }`}
                to={`/${text.toLowerCase()}`}
                onClick={() => {
                  setActiveIndex(index);
                  setIsMobileMenuOpen(false);
                }}
              >
                <div className="flex items-center">
                  <span className={`inline-block h-2 w-2 rounded-full bg-blue-400 mr-3 ${
                    activeIndex === index ? "opacity-100" : "opacity-0"
                  }`}></span>
                  {text}
                </div>
              </Link>
            ))}

            <div className="pt-4 border-t border-gray-700 space-y-3">
              {!token ? (
                <>
                  <Button 
                    onClick={() => {
                      navigate("/auth/signin");
                      setIsMobileMenuOpen(false);
                    }} 
                    text="Login" 
                    fullWidth
                  />
                  <Button 
                    onClick={() => {
                      navigate("/auth/signup");
                      setIsMobileMenuOpen(false);
                    }} 
                    text="Register" 
                    fullWidth
                    variant="secondary"
                  />
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => {
                      navigate("/user/profile");
                      setIsMobileMenuOpen(false);
                    }} 
                    text="Dashboard" 
                    fullWidth
                  />
                  <Button
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/auth/signin");
                      setIsMobileMenuOpen(false);
                    }}
                    text="Logout"
                    fullWidth
                    variant="secondary"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}