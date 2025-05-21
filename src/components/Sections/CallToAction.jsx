"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function CallToAction() {
    const controls = useAnimationControls();
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const animate = async () => {
            while (true) {
                await controls.start({
                    x: "-50%",
                    transition: {
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "loop"
                    }
                });
            }
        };
        animate();
    }, [controls]);

    useEffect(() => {
        if (isHovered) {
            controls.set({ transition: { duration: 60 } });
        } else {
            controls.set({ transition: { duration: 30 } });
        }
    }, [isHovered, controls]);

    return (
        <section className="py-24">
            <div className="overflow-x-clip p-4 flex">
                <motion.div
                    animate={controls}
                    className="flex flex-none gap-16 pr-16 text-7xl md:text-8xl font-medium group cursor-pointer"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-16">
                            <span className="text-[#00b4d8] text-7xl">
                                &#10038;
                            </span>
                            <span className="group-hover:text-[#00b4d8]">
                                Try it for free
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
