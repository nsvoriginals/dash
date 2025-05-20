import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export const Desc = () => {
  const triggerRef = useRef(null);
  const headingRef = useRef(null);
  const [wordsRef, setWordsRef] = useArrayRef();

  const descriptionText = "Atlas AI revolutionizes job preparation with AI-powered tools for interviews and resumes. Get personalized insights, ATS optimization, and salary data to excel in today's job market.";

  function useArrayRef() {
    const wordsRef = useRef([]);
    wordsRef.current = [];
    return [wordsRef, (ref) => ref && wordsRef.current.push(ref)];
  }

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Heading animation
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top bottom",
          end: "top center",
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
        }
      }
    );

    // Word-by-word animation
    gsap.to(wordsRef.current, {
      scrollTrigger: {
        trigger: triggerRef.current,
        scrub: true,
        start: "top 85%",
        end: "top 30%",
        invalidateOnRefresh: true,
      },
      opacity: 1,
      y: 0,
      stagger: 0.1,
      ease: "power2.out"
    });
  }, []);

  // Split text into word spans for both layers
  const renderWords = (isBackground = false) =>
    descriptionText.split(" ").map((word, index) => (
      <span
        key={index}
        ref={isBackground ? null : setWordsRef}
        className={`inline-block ${isBackground ? 'opacity-20' : 'opacity-0 translate-y-5'}`}
      >
        {word}&nbsp;
      </span>
    ));

  return (
    <div className="w-full min-h-[100vh] flex flex-col items-start justify-center font-satoshi gap-8 px-4 sm:px-8 py-12 sm:py-20">
      
      {/* Heading */}
      <h1
        ref={headingRef}
        className="text-left text-4xl sm:text-5xl md:text-[15vh] font-bold text-black leading-tight"
      >
        What is Atlas AI
      </h1>

      {/* Word-by-word description animation with shadow layer */}
      <div
        ref={triggerRef}
        className="relative w-full sm:w-[90%] md:w-[80%] lg:w-[90%] text-black text-base sm:text-lg md:text-5xl leading-relaxed text-left tracking-wider"
      >
        {/* Background layer using same span structure */}
        <p className="absolute top-0 left-0 w-full pointer-events-none select-none z-0">
          <span className="flex flex-wrap gap-x-2 gap-y-1">
            {renderWords(true)}
          </span>
        </p>

        {/* Animated overlay */}
        <p className="relative z-10 flex flex-wrap gap-x-2 gap-y-1">
          {renderWords(false)}
        </p>
      </div>
    </div>
  );
};