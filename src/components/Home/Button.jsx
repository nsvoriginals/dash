import { BsArrowReturnRight } from "react-icons/bs";

export default function Button({ 
  text, 
  onClick,
  variant = "primary", // 'primary' | 'secondary'
  size = "medium",     // 'small' | 'medium' | 'large'
  fullWidth = false,
  withArrow = false
}) {
  // Base classes that apply to all buttons
  const baseClasses = "inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  // Variant styles
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600",
    secondary: "bg-transparent text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white"
  };

  // Size styles
  const sizeClasses = {
    small: "px-4 py-1.5 text-sm",
    medium: "px-8 py-2.5 text-base",
    large: "px-6 py-3 text-lg"
  };

  // Full width style
  const widthClass = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      onClick={onClick}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]} 
        ${widthClass}
      `}
    >
      {text}
      {withArrow && (
        <BsArrowReturnRight className="ml-2" />
      )}
    </button>
  );
}