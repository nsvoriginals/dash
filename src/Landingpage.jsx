import Navbar from "./components/Sections/Navbar";
import Hero from "./components/Sections/Hero";
import LogoTicker from "./components/Sections/LogoTicker";
import Introduction from "./components/Sections/Introduction";
import Features from "./components/Sections/Features";
import Integrations from "./components/Sections/Integrations";
import Faqs from "./components/Sections/Faqs";
import CallToAction from "./components/Sections/CallToAction";
import Footer from "./components/Sections/Footer";

export default function Home() {
    return (
      <div className="min-h-screen w-full flex flex-col bg-[#1A1A1A]">
        <Navbar />
        <div className="flex-1">
          <Hero />
          <LogoTicker />
          <Introduction />
          <Features />
          <Integrations />
          <Faqs />
          <CallToAction />
        </div>
        <Footer />
      </div>
    );
}
