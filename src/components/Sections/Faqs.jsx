"use client";

import Tag from "../Home/Tag";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const faqs = [
    {
        question: "How is Layers different from other design tools?",
        answer: "Unlike traditional design tools, Layers prioritizes speed and simplicity without sacrificing power. Our intelligent interface adapts to your workflow, reducing clicks and keeping you in your creative flow.",
    },
    {
        question: "Is there a learning curve?",
        answer: "Layers is designed to feel intuitive from day one. Most designers are productive within hours, not weeks. We also provide interactive tutorials and comprehensive documentation to help you get started.",
    },
    {
        question: "How do you handle version control?",
        answer: "Every change in Layers is automatically saved and versioned. You can review history, restore previous versions, and create named versions for important milestones.",
    },
    {
        question: "Can I work offline?",
        answer: "Yes! Layers includes a robust offline mode. Changes sync automatically when you're back online, so you can keep working anywhere.",
    },
    {
        question: "How does Layers handle collaboration?",
        answer: "Layers is built for collaboration. You can invite team members to your projects, share feedback, and work together in real-time.",
    },
];

export default function Faqs() {
    const [selectedIndex, setSelectedIndex] = useState(null);

    const toggleFAQ = (index) => {
        setSelectedIndex(selectedIndex === index ? null : index);
    };

    return (
        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="flex justify-center">
                    <Tag>FAQs</Tag>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mt-6 text-center max-w-xl mx-auto">
                    Questions? We've got{" "}
                    <span className="text-[#00b4d8]">answers</span>
                </h2>
                <div className="mt-12 flex flex-col gap-4 max-w-xl mx-auto">
                    {faqs.map((faq, faqIndex) => (
                        <div
                            key={faqIndex}
                            className="bg-neutral-900 rounded-2xl border border-white/10 overflow-hidden"
                        >
                            <button
                                className="w-full flex justify-between items-center p-6 text-left"
                                onClick={() => toggleFAQ(faqIndex)}
                                aria-expanded={selectedIndex === faqIndex}
                                aria-controls={`faq-${faqIndex}`}
                            >
                                <h3 className="font-medium text-lg md:text-xl">
                                    {faq.question}
                                </h3>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={twMerge(
                                        "text-[#00b4d8] flex-shrink-0 transition-transform duration-300",
                                        selectedIndex === faqIndex && "rotate-45"
                                    )}
                                >
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </button>

                            <AnimatePresence>
                                {selectedIndex === faqIndex && (
                                    <motion.div
                                        id={`faq-${faqIndex}`}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: "auto",
                                            opacity: 1,
                                            transition: {
                                                height: { duration: 0.3 },
                                                opacity: { duration: 0.2, delay: 0.1 }
                                            }
                                        }}
                                        exit={{
                                            height: 0,
                                            opacity: 0,
                                            transition: {
                                                height: { duration: 0.2 },
                                                opacity: { duration: 0.1 }
                                            }
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 pt-0 text-white/70">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}