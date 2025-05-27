import logoImage from "../../assets/logo1.svg";
import Button from "../Home/Button";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Features", href: "#features" },
  { label: "Integrations", href: "#integrations" },
  { label: "FAQs", href: "#faqs" },
];

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="py-4 lg:py-8 fixed w-full top-0 z-50">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="border border-white/15 rounded-[27px] md:rounded-full bg-neutral-950/70 backdrop-blur max-w-5xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-3 p-2 px-4 items-center">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <img src={logoImage} alt="company-logo" className="h-8 w-auto md:h-7" />
                <span className="text-xl font-semibold text-white">ATLAS</span>
              </div>

              {/* Desktop Nav Links */}
              <div className="lg:flex justify-center items-center hidden">
                <nav className="flex gap-4 font-medium">
                  {navLinks.map((link) => (
                    <a
                      href={link.href}
                      key={link.label}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Desktop Auth/Dashboard Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  className="md:hidden text-white"
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

                {token ? (
                  <Button
                    onClick={() => navigate('/dashboard')}
                    variant="primary"
                    className="hidden md:inline-flex items-center"
                  >
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => navigate('/signin')}
                      variant="secondary"
                      className="hidden md:inline-flex items-center"
                    >
                      Log In
                    </Button>
                    <Button
                      onClick={() => navigate('/signup')}
                      variant="primary"
                      className="hidden md:inline-flex items-center"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col items-center gap-4 py-4">
                    {navLinks.map((link) => (
                      <a
                        href={link.href}
                        key={link.label}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}

                    {token ? (
                      <Button
                        onClick={() => navigate('/dashboard')}
                        variant="primary"
                        className="w-full max-w-[200px]"
                      >
                        Dashboard
                      </Button>
                      
                      
                    ) : (
                      <div className="flex gap-4 w-full px-4">
                        <Button
                          onClick={() => navigate('/signin')}
                          variant="secondary"
                          className="w-full"
                        >
                          Log In
                        </Button>
                        <Button
                          onClick={() => navigate('/signup')}
                          variant="primary"
                          className="w-full"
                        >
                          Sign Up
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
      <div className="pb-[86px] md:pb-[98px] lg:pb-[130px]"></div>
    </>
  );
}