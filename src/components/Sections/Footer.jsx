import logoImage from "../../assets/logo1.svg";
import { motion } from "framer-motion";

const footerLinks = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
    { href: "#privacy", label: "Privacy Policy" },
    { href: "#terms", label: "Terms & Conditions" },
];

export default function Footer() {
    return (
        <footer className="py-12 border-t border-white/10 bg-black">
            <div className="container max-w-5xl mx-auto px-4">
                <div className="flex flex-col items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8">
                        <motion.div 
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <img
                                src={logoImage}
                                alt="company-logo"
                                className="h-8 w-auto md:h-7"
                            />
                            <span className="text-xl font-semibold text-white">ATLAS</span>
                        </motion.div>
                        
                        <nav className="flex flex-wrap justify-center gap-6 md:gap-8">
                            {footerLinks.map((link, index) => (
                                <motion.a
                                    key={link.href}
                                    href={link.href}
                                    className="text-white/60 hover:text-white transition-colors text-sm md:text-base"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                        </nav>
                    </div>
                    
                    <motion.div 
                        className="text-white/40 text-sm text-center border-t border-white/10 w-full pt-8"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        © {new Date().getFullYear()} ATLAS. All rights reserved.
                    </motion.div>
                </div>
            </div>
        </footer>
    );
}