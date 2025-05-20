import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const useLenis = (options = {}) => {
  const lenisRef = useRef(null);
  
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    let lenis = null;
    let rafId;
    const initLenis = async () => {
      const { default: Lenis } = await import('@studio-freight/lenis');
    
      const lenis = new Lenis({
        lerp: 0.1,
        smooth: true,
        ...options
      });
      console.log('Lenis initialized');

      lenisRef.current = lenis;

      lenis.on('scroll', ScrollTrigger.update);

      const raf = (time) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
          return arguments.length 
            ? lenis?.scrollTo(value, { immediate: true })
            : lenis?.scroll;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
          };
        }
      });

      ScrollTrigger.addEventListener('refresh', () => lenis?.resize());
      ScrollTrigger.refresh();
    };

    initLenis();

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      ScrollTrigger.clearMatchMedia();
    };
  }, [options]);

  return lenisRef;
};