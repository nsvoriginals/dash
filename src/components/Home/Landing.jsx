import React, { useEffect, useRef } from 'react';

import Navbar from './Navbar';
import { Desc } from './Desc';
import { Features } from './Features';
import { Footer } from './Footer';
import { useLenis } from './useLenis';
import Hsc from '../HorizontalScroll';


function Landing() {
  const trailCount = 5;
  const dots = useRef(
    Array(trailCount).fill({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  );
  const dotRefs = useRef([]);
  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      dots.current[0] = { x: mousePos.current.x, y: mousePos.current.y };

      for (let i = 1; i < trailCount; i++) {
        const prev = dots.current[i - 1];
        const curr = dots.current[i];
        const ease = 0.1;
        dots.current[i] = {
          x: curr.x + (prev.x - curr.x) * ease,
          y: curr.y + (prev.y - curr.y) * ease,
        };
      }

      dots.current.forEach((dot, i) => {
        if (dotRefs.current[i]) {
          dotRefs.current[i].style.transform = `translate(${dot.x}px, ${dot.y}px) translate(-50%, -50%)`;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="bg-[#131515] font-satoshi relative m-0">
      <Navbar />

      <section className="bg-[#1e1e1e] bg-opacity-80 font-satoshi overflow-x-hidden min-h-screen flex items-center py-12 sm:py-16 lg:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col items-center text-center space-y-6 w-full">
            {/* Top Text */}
            <div className="reveal-container mb-2">
              <p className="flap-reveal text-sm sm:text-base md:text-lg font-semibold tracking-widest text-blue-500 uppercase">
                A Platform for your Future
              </p>
            </div>

            {/* Hero Title */}
            <div className="reveal-container mt-6 sm:mt-10">
              <h1 className="flap-reveal text-4xl sm:text-5xl md:text-6xl lg:text-9xl font-bold text-white leading-tight sm:leading-snug">
                <span className="inline-block text-blue-400 mr-2">Ace</span> your Interview,
              </h1>
            </div>

            {/* Subheading */}
            <div className="reveal-container mt-4 sm:mt-6">
              <span className="flap-reveal block text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Every. Single. Time.
              </span>
            </div>

            {/* Description */}
            <div className="reveal-container mt-3 sm:mt-6">
              <p className="flap-reveal text-base sm:text-lg md:text-xl text-white">
                Grow your career fast at the right place.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center mt-6 sm:mt-10">
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-black transition-all duration-200 bg-blue-300 rounded-full hover:bg-blue-400 focus:bg-blue-400"
              >
                Join for free
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 ml-4 sm:ml-6 -mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </a>
            </div>

            {/* Login Link */}
            <div className="mt-4">
              <p className="text-sm text-gray-300">
                Already joined us?{' '}
                <a href="#" className="text-blue-400 hover:underline">
                  Log in
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Desc />
      <Features />
      <div className="relative z-10 w-screen">
        <Hsc />
      </div>

      <Footer />
    </div>
  );
}

export default Landing;