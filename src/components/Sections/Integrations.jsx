import Tag from "../Home/Tag";
import figmaIcon from "../../assets/images/figma-logo.svg";
import notionIcon from "../../assets/images/notion-logo.svg";
import slackIcon from "../../assets/images/slack-logo.svg";
import relumeIcon from "../../assets/images/relume-logo.svg";
import framerIcon from "../../assets/images/framer-logo.svg";
import githubIcon from "../../assets/images/github-logo.svg";
import IntegrationsColumn from '../Home/IntegrationsColumn'
export default function Integrations() {
    return (
        <section className="py-24 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 items-center lg:gap-16">
                    <div>
                        <div className="flex justify-center lg:justify-start">
                            <Tag>Integrations</Tag>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mt-6 text-center lg:text-left">
                            Plays well with{" "}
                            <span className="text-[#00b4d8]">others</span>
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
        name: "Figma",
        icon: figmaIcon,
        description: "Figma is a collaborative interface design tool.",
    },
    {
        name: "Notion",
        icon: notionIcon,
        description: "Notion is an all-in-one workspace for notes and docs.",
    },
    {
        name: "Slack",
        icon: slackIcon,
        description: "Slack is a powerful team communication platform.",
    },
    {
        name: "Relume",
        icon: relumeIcon,
        description: "Relume is a no-code website builder and design system.",
    },
    {
        name: "Framer",
        icon: framerIcon,
        description: "Framer is a professional website prototyping tool.",
    },
    {
        name: "GitHub",
        icon: githubIcon,
        description: "GitHub is the leading platform for code collaboration.",
    },
];