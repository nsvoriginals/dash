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
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, formData);
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
        
        </div>
        
        
      </motion.div>
    </main>
  );
}