import React from 'react';

export const Button = ({ text, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors";
  const variantStyles = variant === 'secondary' 
    ? "bg-gray-700 text-white hover:bg-gray-600" 
    : "bg-indigo-600 text-white hover:bg-indigo-700";
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${disabledStyles} ${className}`}
    >
      {text}
    </button>
  );
}; 