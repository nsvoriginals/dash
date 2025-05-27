import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      setLoading(true);
      
      try {
        const response = await axios.post(`http://localhost:8000/auth/login`, formData);
        const { access_token, username } = response.data;
        
        // Use the auth context to handle login
        login(access_token, username);
        
        // Redirect to the page they tried to visit or dashboard
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      } catch (error) {
        console.error("Login error:", error);
        setErrors({ form: "Invalid email or password. Please try again." });
      } finally {
        setLoading(false);
      }
    }
  };

  // Button component matching the ATS Dashboard style
  const Button = ({ text, onClick, type, className = '', disabled = false }) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors";
    const variantStyles = "bg-[#00b4d8] text-white hover:bg-[#00b4d8]/90";
    const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";
    
    return (
      <button 
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`${baseStyles} ${variantStyles} ${disabledStyles} ${className}`}
      >
        {loading ? "Signing In..." : text}
      </button>
    );
  };

  return (
    <main className="flex-1 bg-[#131515] min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1e1e1e] rounded-xl p-8 shadow-lg w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>
        
        {errors.form && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-6">
            <p className="text-red-400 text-center">{errors.form}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-white font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-[#2b2b2b] text-white rounded-lg px-4 py-3 md:p-3 focus:ring-2 focus:ring-[#00b4d8] focus:outline-none border border-gray-700 text-base"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>
          
          <div className="space-y-1">
            <label htmlFor="password" className="block text-white font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-[#2b2b2b] text-white rounded-lg px-4 py-3 md:p-3 focus:ring-2 focus:ring-[#00b4d8] focus:outline-none border border-gray-700 text-base"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>
          
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-[#00b4d8] hover:text-white">
              Forgot password?
            </Link>
          </div>
          
          <Button
            text="Sign In"
            type="submit"
            className="w-full py-3 mt-4"
            disabled={loading}
          />
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#00b4d8] hover:text-white font-medium">
              Create Account
            </Link>
          </p>
        </div>
        
        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#1e1e1e] text-gray-400">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            className="flex justify-center items-center py-2.5 px-4 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => console.log("Google sign in")}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
              />
              <path
                fill="#34A853"
                d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
              />
              <path
                fill="#4A90E2"
                d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
              />
              <path
                fill="#FBBC05"
                d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
              />
            </svg>
            <span className="text-white">Google</span>
          </button>
          
          <button
            className="flex justify-center items-center py-2.5 px-4 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => console.log("GitHub sign in")}
          >
            <svg className="w-5 h-5 mr-2" fill="white" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-white">GitHub</span>
          </button>
        </div>
      </motion.div>
    </main>
  );
}