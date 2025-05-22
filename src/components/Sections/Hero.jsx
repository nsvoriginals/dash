"use client";

import Button from "../Home/Button";
import Pointer from "../Home/Pointer";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import cursorYouImage from "../../assets/images/cursor-you.svg";

export default function Hero() {
    // Use useRef instead of useAnimate to fix the weak map key error
    const leftPointerRef = useRef(null);
    const rightPointerRef = useRef(null);

    // Animation variants for the pointers
    const leftPointerVariants = {
        initial: { opacity: 0, x: -200, y: 100 },
        animate: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration: 1.5,
                times: [0, 0.3, 0.7, 1],
                x: { times: [0, 0.3, 0.7, 1], values: [-200, -100, 0, 0] },
                y: { times: [0, 0.3, 0.7, 1], values: [100, 0, 16, 0] },
            }
        }
    };

    const rightPointerVariants = {
        initial: { opacity: 0, x: 275, y: 100 },
        animate: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                delay: 1.5,
                duration: 1.5,
                times: [0, 0.3, 0.7, 1],
                x: { times: [0, 0.3, 0.7, 1], values: [275, 175, 0, 0] },
                y: { times: [0, 0.3, 0.7, 1], values: [100, 0, 20, 0] },
            }
        }
    };

    return (
        <section
            className="py-24 overflow-x-hidden"
            style={{
                cursor: `url(${cursorYouImage}), auto`,
            }}
        >
            <div className="container relative mx-auto px-6 sm:px-8 max-w-7xl">
                <motion.div
                    ref={leftPointerRef}
                    variants={leftPointerVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute left-56 top-96 hidden lg:block"
                >
                    <Pointer name="Mohan" color="red" />
                </motion.div>
               
                <motion.div
                    ref={rightPointerRef}
                    variants={rightPointerVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute right-80 -top-4 hidden lg:block"
                >
                    <Pointer name="Jayanth" />
                </motion.div>
                <div className="flex justify-center">
                    <div className="inline-flex py-1 px-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full text-neutral-950 font-semibold">
                        ✨ Version V1 Released
                    </div>
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-center mt-6">
                    Ace your interviews <br />every single time
                </h1>
                <p className="text-center text-lg sm:text-xl text-white/80 mt-8 max-w-2xl mx-auto px-4">
                    🚀 Just share your skills and goals—we handle the rest. No lengthy setups, no delays. Get matched with dream jobs, tools, and growth opportunities instantly. Your future starts now! 
                </p>
                <form className="flex flex-col md:flex-row border border-white/15 rounded-full mt-8 p-1 md:p-2 max-w-lg mx-auto justify-between">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="bg-transparent px-4 py-3 md:py-0 w-full outline-none"
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        className="whitespace-nowrap mt-2 md:mt-0"
                        size="sm"
                    >
                        Sign Up
                    </Button>
                </form>
            </div>
        </section>
    );
}