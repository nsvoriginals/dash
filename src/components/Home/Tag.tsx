import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import React from "react";

export default function Tag(props: HTMLAttributes<HTMLDivElement>) {
    const { className, children, ...otherProps } = props;
    return (
        <div
            className={twMerge(
                "inline-flex border border-[#00b4d8] gap-2 text-[#00b4d8] px-3 py-1 rounded-full uppercase items-center",
                className
            )}
            {...otherProps}
        >
            <span>&#10038;</span>
            <span className="text-sm">{children}</span>
        </div>
    );
}
