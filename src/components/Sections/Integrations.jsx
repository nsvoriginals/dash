import Tag from "../Home/Tag";
import figmaIcon from "../../assets/images/react-2.svg";
import notionIcon from "../../assets/images/groq.svg";
import slackIcon from "../../assets/images/slack-logo.svg";
import relumeIcon from "../../assets/images/fastapi.svg";
import framerIcon from "../../assets/images/postgres.svg";
import githubIcon from "../../assets/images/github-logo.svg";
import IntegrationsColumn from '../Home/IntegrationsColumn'

const IntegrationIcon = ({ icon, name }) => {
    return (
        <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center">
            <img src={icon} alt={name} className="w-6 h-6" />
        </div>
    );
};

export default function Integrations() {
    return (
        <section className="py-24 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 items-center lg:gap-16">
                    <div>
                        <div className="flex justify-center lg:justify-start">
                            <Tag>Technologies</Tag>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mt-6 text-center lg:text-left">
                            Built from the{" "}
                            <span className="text-[#00b4d8]">ROBUST STACK</span>
                        </h2>
                        <p className="text-white/50 mt-4 text-lg text-center lg:text-left max-w-lg mx-auto lg:mx-0">
                            Lorem ipsum dolor, sit amet consectetur adipisicing
                            elit. Ipsa, adipisci eos facere minima dicta magni
                            provident nulla excepturi dolore neque, labore, ex
                            error.
                        </p>
                    </div>
                    <div>
                        <div className="h-[400px] lg:h-[800px] grid md:grid-cols-2 gap-4 mt-8 lg:mt-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
                            <IntegrationsColumn integrations={integrations} />
                            <IntegrationsColumn
                                integrations={integrations.slice().reverse()}
                                className="hidden md:flex"
                                reverse
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const integrations = [
    {
        name: "React",
        icon: figmaIcon,
        description: "React is a JavaScript library for building user interfaces.",
    },
    {
        name: "GSAP",
        icon: notionIcon,
        description: "GSAP is a powerful animation library for JavaScript.",
    },
    {
        name: "Jotai",
        icon: slackIcon,
        description: "Jotai is a simple, scalable state management library for React.",
    },
    {
        name: "FastAPI",
        icon: relumeIcon,
        description: "FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.8+.",
    },
    {
        name: "PostgreSQL",
        icon: framerIcon,
        description: "PostgreSQL is a powerful open-source relational database system.",
    },
    {
        name: "GROQ",
        icon: notionIcon,
        description: "GROQ is a powerful open-source LLM provider.",
    },
    {
        name: "Github",
        icon: githubIcon,
        description: "Github is the leading platform for code collaboration.",
    },
    
];