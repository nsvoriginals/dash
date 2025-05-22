import { useState } from "react";
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

export default function Sidebar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="fixed right-4 top-4 z-50 text-white p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-menu"
        >
          <line
            x1="3"
            y1="6"
            x2="21"
            y2="6"
            className={twMerge(
              "origin-left transition",
              isOpen && "rotate-45 -translate-y-1"
            )}
          />
          <line
            x1="3"
            y1="12"
            x2="21"
            y2="12"
            className={twMerge(
              "transition",
              isOpen && "opacity-0"
            )}
          />
          <line
            x1="3"
            y1="18"
            x2="21"
            y2="18"
            className={twMerge(
              "origin-left transition",
              isOpen && "-rotate-45 translate-y-1"
            )}
          />
        </svg>
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed left-0 top-0 h-full w-64 bg-neutral-950/95 backdrop-blur border-r border-white/15 z-40"
          >
            <div className="flex flex-col h-full p-6">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-8">
                <span className="text-xl font-semibold text-white">ATLAS</span>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    href={link.href}
                    key={link.label}
                    className="text-white/80 hover:text-white transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              {/* Auth Buttons */}
              <div className="mt-auto">
                {token ? (
                  <Button
                    onClick={() => {
                      navigate('/dashboard');
                      setIsOpen(false);
                    }}
                    variant="primary"
                    className="w-full"
                  >
                    Dashboard
                  </Button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => {
                        navigate('/signin');
                        setIsOpen(false);
                      }}
                      variant="secondary"
                      className="w-full"
                    >
                      Log In
                    </Button>
                    <Button
                      onClick={() => {
                        navigate('/signup');
                        setIsOpen(false);
                      }}
                      variant="primary"
                      className="w-full"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
} 