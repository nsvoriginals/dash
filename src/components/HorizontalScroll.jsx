import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function Hsc() {
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    // Calculate the exact scroll distance needed
    const getScrollDistance = () => {
      return contentRef.current.scrollWidth - containerRef.current.offsetWidth + window.innerWidth * 0.3;
    };

    // Optimize animations for performance
    gsap.config({
      force3D: true,
      autoSleep: 60
    });

    // Buttery smooth horizontal scroll
    const scrollTween = gsap.to(contentRef.current, {
      x: () => -getScrollDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${getScrollDistance() * 1.0}`,
        scrub: 0.8, // Perfect balance between smoothness and responsiveness
        pin: true,
        anticipatePin: 1,
        markers: false,
        invalidateOnRefresh: true
      }
    });

    // Creamy background transition
    gsap.to(containerRef.current, {
      backgroundColor: "#000",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 30%",
        end: "bottom 30%",
        scrub: 0.8,
        invalidateOnRefresh: true,
      }
    });

    // Silky text color transition
    gsap.to(contentRef.current.querySelector("h1"), {
      color: "#fff",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 40%",
        end: "bottom 40%",
        invalidateOnRefresh: true,
        scrub: 0.8,
      }
    });

    // Smooth entrance animation
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: 1.2,
      ease: "expo.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "top 80%",
        toggleActions: "play none none none",
        invalidateOnRefresh: true,
      }
    });

    return () => scrollTween.kill();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-screen h-screen overflow-hidden bg-white relative"
      style={{
        backfaceVisibility: "hidden",
        transformStyle: "preserve-3d"
      }}
    >
      <div 
        ref={contentRef}
        className="h-full flex items-center pl-[10vw] pr-[50vw] will-change-transform"
        style={{
          minWidth: "fit-content",
          transform: "translateZ(0)"
        }}
      >
        <h1 
          className="text-[10rem] md:text-[20rem] font-extrabold leading-[0.8] text-black whitespace-nowrap will-change-transform"
          style={{
            display: "inline-block",
            transform: "translateZ(0)"
          }}
        >
          Fine Tuning Web Experiences with AtlasAI
        </h1>
        <div className="text-white m-10">⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⢀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⠤⠐⢈⣨⣦⣄⡀⣄
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⠀⠀⠀⠀⠀⠀⢀⡠⠴⠚⠁⢀⣠⠶⠋⠁⠈⠉⠉⠁
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠁⢀⡴⢻⠀⠀⢀⣠⠴⠊⠉⠀⣠⣴⠞⠋⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠀⠀⢀⣾⣴⣾⠔⠚⠍⠀⢂⣤⡶⠟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⡤⠤⠔⠚⠉⠀⣀⢤⠚⢷⣾⡉⠂⠀⣈⣶⣾⠟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣀⣤⠤⠖⠒⠋⠉⠁⣀⡤⠤⠒⠒⢊⡉⠀⠈⠻⣶⡿⣯⡴⣪⣵⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⣰⠞⠉⠀⠀⠀⠀⠀⢰⠋⠀⢀⡀⣴⣄⠈⠻⣾⣶⡄⠀⠉⠋⠀⠙⠮⠅⣀⣀⡠⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢸⠃⠀⠀⠀⠀⠀⠀⠀⣈⡉⢻⣾⣿⣾⡿⣿⣷⡀⠉⠁⢀⣠⠆⠀⠀⣀⡠⣤⣰⡤⠟⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣾⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⣄⢻⣟⣮⣹⠾⠬⠓⣖⠚⢉⠇⣤⡾⠛⣋⣉⣉⡠⠤⠚⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠣⣧⠾⢇⠀⠀⠻⠿⠃⠎⣸⣿⠟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢇⢻⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⡇⢀⠚⣧⠀⣰⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠘⣆⢹⣧⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣇⠀⠀⠀⡴⣻⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠈⠯⣏⠙⢷⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢆⡤⠊⣴⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠈⠳⣄⠈⠛⠦⣄⣀⠀⠀⠀⠀⠀⠀⣀⡴⢺⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠈⠙⠦⣄⡀⠉⠛⠒⠲⠶⣖⠋⣩⡶⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠓⠒⠶⠶⠶⠚⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀</div>
      </div>
    </div>
  );
}