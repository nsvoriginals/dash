import FeatureCard from "../Home/FeatureCard";
import Tag from "../Home/Tag";
import avatar1 from "../../assets/images/avatar-ashwin-santiago.jpg";
import avatar2 from "../../assets/images/avatar-florence-shaw.jpg";
import avatar3 from "../../assets/images/avatar-lula-meyers.jpg";
import avatar4 from "../../assets/images/avatar-owen-garcia.jpg";
import Avatar from "../Home/Avatar";
import Key from "../Home/Key";

const features = [
    "Asset Library",
    "Code Preview",
    "Flow Mode",
    "Smart Sync",
    "Auto Layout",
    "Fast Search",
    "Smart Guides",
];

export default function Features() {
    return (
        <section className="py-24 bg-black">
            <div className="container mx-auto px-4">
                <div className="flex justify-center">
                    <Tag>Features</Tag>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-center mt-6 max-w-2xl mx-auto">
                    Where power meets{" "}
                    <span className="text-[#5044e4]">simplicity</span>
                </h2>
                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-3">
                    <FeatureCard
                        title="Real-Time Collaboration"
                        description="Work together seamlessly with conflict-free team editing."
                        className="md:col-span-2 lg:col-span-1 group"
                    >
                        <div className="aspect-video flex items-center justify-center">
                            <Avatar className="z-40">
                                <img
                                    src={avatar1}
                                    alt="Ashwin Santiago"
                                    className="rounded-full w-full h-full object-cover"
                                />
                            </Avatar>
                            <Avatar className="-ml-6 border-indigo-500 z-30">
                                <img
                                    src={avatar2}
                                    alt="Florence Shaw"
                                    className="rounded-full w-full h-full object-cover"
                                />
                            </Avatar>
                            <Avatar className="-ml-6 border-amber-500 z-20">
                                <img
                                    src={avatar3}
                                    alt="Lula Meyers"
                                    className="rounded-full w-full h-full object-cover"
                                />
                            </Avatar>
                            <Avatar className="-ml-6 border-transparent group-hover:border-green-500 transition">
                                <div className="w-full h-full bg-neutral-700 rounded-full inline-flex items-center justify-center gap-1 relative">
                                    <img
                                        src={avatar4}
                                        alt="Owen Garcia"
                                        className="absolute w-full h-full rounded-full opacity-0 group-hover:opacity-100 transition object-cover"
                                    />
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <span
                                            className="w-1 h-1 rounded-full bg-white inline-flex"
                                            key={i}
                                        ></span>
                                    ))}
                                </div>
                            </Avatar>
                        </div>
                    </FeatureCard>

                    <FeatureCard
                        title="Interactive Prototyping"
                        description="Engage your clients with prototypes that react to user actions."
                        className="md:col-span-2 lg:col-span-1 group"
                    >
                        <div className="aspect-video flex items-center justify-center">
                            <p className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white/20 group-hover:text-white/10 transition text-center duration-500">
                                We've achieved{" "}
                                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent relative">
                                    <span>incredible</span>
                                    <video
                                        src="/assets/gif-incredible.mp4"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 rounded-2xl shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition duration-500 w-64"
                                    />
                                </span>{" "}
                                growth this year.
                            </p>
                        </div>
                    </FeatureCard>

                    <FeatureCard
                        title="Keyboard Quick Actions"
                        description="Powerful commands to help you create designs more quickly."
                        className="md:col-span-2 md:col-start-2 lg:col-span-1 lg:col-start-auto group"
                    >
                        <div className="aspect-video flex items-center justify-center gap-4">
                            <Key className="w-20 md:w-28 outline outline-2 outline-offset-4 outline-transparent group-hover:outline-lime-400 transition-all duration-500 group-hover:translate-y-1">
                                shift
                            </Key>
                            <Key className="outline outline-2 outline-offset-4 outline-transparent group-hover:outline-lime-400 transition-all duration-500 group-hover:translate-y-1 delay-150">
                                alt
                            </Key>
                            <Key className="outline outline-2 outline-offset-4 outline-transparent group-hover:outline-lime-400 transition-all duration-500 group-hover:translate-y-1 delay-300">
                                C
                            </Key>
                        </div>
                    </FeatureCard>
                </div>

                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                    {features.map((feature) => (
                        <div
                            key={feature}
                            className="bg-neutral-900 border border-white/10 inline-flex px-3 md:px-5 py-1.5 md:py-2 rounded-2xl gap-3 items-center hover:scale-105 transition duration-500 group"
                        >
                            <span className="bg-[#00b4d8] text-black w-5 h-5 rounded-full inline-flex items-center justify-center text-xl group-hover:rotate-45 transition duration-500">
                                &#10038;
                            </span>
                            <span className="font-medium text-sm md:text-lg">
                                {feature}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}