import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import React from "react";

export default function Avatar(props: HTMLAttributes<HTMLDivElement>) {
    const { className, children, ...otherProps } = props;
    return (
        <div
            className={twMerge(
                "size-20 rounded-full overflow-hidden border-4 border-[#5044e4] p-1 bg-neutral-900",
                className
            )}
            {...otherProps}
        >
            {children}
        </div>
    );
}
