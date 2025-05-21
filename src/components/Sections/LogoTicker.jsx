"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import quantumLogo from "../../assets/images/quantum.svg";
import acmeLogo from "../../assets/images/acme-corp.svg";
import echoValleyLogo from "../../assets/images/echo-valley.svg";
import pulseLogo from "../../assets/images/pulse.svg";
import outsideLogo from "../../assets/images/outside.svg";
import apexLogo from "../../assets/images/apex.svg";
import celestialLogo from "../../assets/images/celestial.svg";
import twiceLogo from "../../assets/images/twice.svg";

const logos = [
    { name: "Quantum", image: quantumLogo },
    { name: "Acme Corp", image: acmeLogo },
    { name: "Echo Valley", image: echoValleyLogo },
    { name: "Pulse", image: pulseLogo },
    { name: "Outside", image: outsideLogo },
    { name: "Apex", image: apexLogo },
    { name: "Celestial", image: celestialLogo },
    { name: "Twice", image: twiceLogo },
];

export default function LogoTicker() {
    return (
        <section className="py-12 w-full bg-black">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-medium text-center mb-8 text-white/80">
                    Trusted by the best
                </h2>
                <div className="relative w-full overflow-hidden">
                    <motion.div
                        className="flex gap-8 items-center"
                        animate={{
                            x: [0, -1000],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 20,
                                ease: "linear",
                            },
                        }}
                    >
                        {[...logos, ...logos].map((logo, index) => (
                            <Fragment key={index}>
                                <img
                                    src={logo.image}
                                    alt={logo.name}
                                    className="h-8 md:h-10 opacity-50 hover:opacity-100 transition-opacity duration-300"
                                />
                            </Fragment>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
