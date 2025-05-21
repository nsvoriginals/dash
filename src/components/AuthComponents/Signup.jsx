import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      setLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success! In a real app, you would redirect to login or dashboard here
        console.log("Signup successful", formData);
        // navigate("/signin");
      } catch (error) {
        console.error("Signup error:", error);
        setErrors({ form: "An error occurred during signup. Please try again." });
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
        {loading ? "Creating Account..." : text}
      </button>
    );
  };

  // Input field component
  const InputField = ({ label, type, name, value, onChange, error }) => (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-white font-medium">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-[#00b4d8] focus:outline-none border border-gray-700"
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );

  return (
    <main className="flex-1 bg-[#131515] min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1e1e1e] rounded-xl p-8 shadow-lg w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-2">Sign up to start optimizing your resume</p>
        </div>
        
        {errors.form && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-6">
            <p className="text-red-400 text-center">{errors.form}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
          />
          
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          
          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
          
          <Button
            text="Create Account"
            type="submit"
            className="w-full py-3 mt-6"
            disabled={loading}
          />
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link to="/signin" className="text-[#00b4d8] hover:text-white font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}