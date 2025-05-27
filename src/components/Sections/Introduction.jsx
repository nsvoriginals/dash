"use client";

import Tag from "../Home/Tag";
import { useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

const text = `Companion for acing interviews like never before.We've seen the problem .`;
const words = text.split(" ");

export default function Introduction() {
    const scrollTargetRef = useRef(null);
    const [currentWord, setCurrentWord] = useState(0);

    const { scrollYProgress } = useScroll({
        target: scrollTargetRef,
        offset: ["start end", "end end"],
    });

    const wordIndex = useTransform(scrollYProgress, [0, 1], [0, words.length]);

    useEffect(() => {
        const unsubscribe = wordIndex.on("change", (latest) => {
            setCurrentWord(Math.floor(latest));
        });
        return () => unsubscribe();
    }, [wordIndex]);

    return (
        <section className="py-28 lg:py-40">
            <div className="container mx-auto px-4">
                <div className="sticky top-20 md:top-30 lg:top-[140px] h-[80vh] flex items-center justify-center">
                    <div className="w-full max-w-5xl px-4">
                        <div className="flex justify-center mb-8">
                            <Tag>Introducing ATLAS AI</Tag>
                        </div>
                        <div className="text-4xl md:text-6xl lg:text-7xl font-medium space-y-6">
                            <p className="text-center leading-tight">
                                Your interview process deserves better.
                            </p>
                            <p className="text-center leading-tight">
                                {words.map((word, wordIndex) => (
                                    <span
                                        key={wordIndex}
                                        className={twMerge(
                                            "transition duration-500 text-white/15",
                                            wordIndex < currentWord && "text-white"
                                        )}
                                    >{`${word} `}</span>
                                ))}
                            </p>
                            <p className="text-[#00b4d8] text-center leading-tight">
                                That&apos;s why we built ATLAS
                            </p>
                        </div>
                    </div>
                </div>
                <div className="h-[150vh]" ref={scrollTargetRef}></div>
            </div>
        </section>
    );
}