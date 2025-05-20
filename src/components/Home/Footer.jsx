import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function Footer() {
  const footerRef = useRef(null)
  const titleRef = useRef(null)
  const copyrightRef = useRef(null)
  const navItemsRef = useRef([])
  const containerRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Set initial states for footer elements
    gsap.set([titleRef.current, copyrightRef.current, ...navItemsRef.current], {
      y: 50,
      opacity: 0,
    })

    // Main animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 90%',
        end: 'top 40%',
        scrub: true,
        markers: false, // Set to true for debugging if needed
        invalidateOnRefresh: true,
      }
    })

    tl.to(titleRef.current, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
    }, 0.2)

    tl.to(copyrightRef.current, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
    }, 0.4)

    // Staggered animation for navigation items
    navItemsRef.current.forEach((item, i) => {
      tl.to(item, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      }, 0.5 + i * 0.1)
    })

    // Enhanced parallax effect for the title
    gsap.to(titleRef.current, {
      y: -100,  // Increased parallax distance
      ease: 'none',
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true,
        markers: false, // For debugging
        pin: false,     // Ensure no pinning is happening
      }
    })

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <footer
      ref={footerRef}
      className="relative w-full min-h-[60vh] sm:min-h-[80vh] bg-[#1e1e1e] text-white px-6 sm:px-12 py-20 flex flex-col justify-between overflow-hidden" // Updated background and text color
    >
      {/* Navigation Section */}
      <div className="flex flex-col sm:flex-row gap-10 sm:gap-20 text-sm sm:text-base">
        <div className="flex flex-col gap-2">
          <h3 className="mb-2 uppercase text-[#ffffff80] text-xs sm:text-sm">About</h3>
          {['Home', 'Projects', 'Our Mission', 'Contact Us'].map((item, i) => (
            <p
              key={`about-${i}`}
              ref={el => navItemsRef.current[i] = el}
              className="opacity-0"
            >
              {item}
            </p>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="mb-2 uppercase text-[#ffffff80] text-xs sm:text-sm">Education</h3>
          {['News', 'Learn', 'Certification', 'Publications'].map((item, i) => (
            <p
              key={`edu-${i}`}
              ref={el => navItemsRef.current[i + 4] = el}
              className="opacity-0"
            >
              {item}
            </p>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-32 sm:mt-48 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <h1
          ref={titleRef}
          className="text-[14vw] sm:text-[10vw] leading-[0.8] opacity-0 text-white transform translate-y-[50px]" // Updated text color
        >
          Atlas AI
        </h1>
        <p
          ref={copyrightRef}
          className="opacity-0 text-sm sm:text-base text-[#ffffff80]" // Updated text color
        >
          © 2025 Atlas AI
        </p>
      </div>
    </footer>
  )
}