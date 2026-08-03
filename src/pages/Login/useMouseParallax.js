import { useState, useEffect } from "react";

/**
 * Custom hook to track mouse positions for parallax scrolling/hover effects
 * @param {number} sensitivity Multiplier for offset sensitivity
 * @returns {{x: number, y: number}} offset values in pixels
 */
export default function useMouseParallax(sensitivity = 30) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let frameId;

    const handleMouseMove = (e) => {
      // Use requestAnimationFrame to optimize rendering performance
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        const { innerWidth, innerHeight } = window;
        const normalizedX = (e.clientX / innerWidth) - 0.5; // -0.5 to 0.5
        const normalizedY = (e.clientY / innerHeight) - 0.5; // -0.5 to 0.5
        
        setOffset({
          x: Math.round(normalizedX * sensitivity * 100) / 100,
          y: Math.round(normalizedY * sensitivity * 100) / 100
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [sensitivity]);

  return offset;
}
