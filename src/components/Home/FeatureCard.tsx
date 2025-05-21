import { twMerge } from "tailwind-merge";
import React from "react";

export default function FeatureCard(props: {
    title: string;
    description: string;
    children?: React.ReactNode;
    className?: string;
}) {
    const { title, description, children, className } = props;
    return (
        <div
            className={twMerge(
                "bg-neutral-900 border border-[#5044e4]/20 p-6 rounded-3xl hover:border-[#5044e4]/40 transition-colors",
                className
            )}
        >
            <div className="aspect-video">{children}</div>
            <div>
                <h3 className="text-3-xl font-medium mt-6 text-white">{title}</h3>
                <p className="text-white/50 mt-2">{description}</p>
            </div>
        </div>
    );
}
