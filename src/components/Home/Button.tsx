import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import React from "react";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
}

export default function Button({
    variant = "primary",
    size = "md",
    className,
    children,
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-colors";
    
    const variants = {
        primary: "bg-[#00b4d8]  text-white hover:bg-[#4338ca]",
        secondary: "bg-neutral-900 text-white hover:bg-neutral-800",
        ghost: "text-white/50 hover:text-white hover:bg-white/5"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    return (
        <button
            className={twMerge(
                baseStyles,
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
