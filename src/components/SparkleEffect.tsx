
import React, { useEffect, useRef } from 'react';

interface Sparkle {
  x: number;
  y: number;
  size: number;
  duration: number;
}

interface SparkleEffectProps {
  trigger: boolean;
  targetRef: React.RefObject<HTMLElement>;
}

const SparkleEffect: React.FC<SparkleEffectProps> = ({ trigger, targetRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<Sparkle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (trigger && targetRef.current && containerRef.current) {
      // Clear existing sparkles
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
      
      const targetRect = targetRef.current.getBoundingClientRect();
      sparklesRef.current = [];
      
      // Create 15-25 sparkles around the button
      const sparkleCount = Math.floor(Math.random() * 10) + 15;
      
      for (let i = 0; i < sparkleCount; i++) {
        // Position sparkles randomly around the button
        const x = Math.random() * targetRect.width * 1.5 + targetRect.left - targetRect.width * 0.25;
        const y = Math.random() * targetRect.height * 1.5 + targetRect.top - targetRect.height * 0.25;
        const size = Math.random() * 10 + 5;
        const duration = Math.random() * 1000 + 1000;
        
        const sparkleElement = document.createElement('div');
        sparkleElement.className = 'sparkle';
        sparkleElement.style.width = `${size}px`;
        sparkleElement.style.height = `${size}px`;
        sparkleElement.style.left = `${x}px`;
        sparkleElement.style.top = `${y}px`;
        sparkleElement.style.opacity = '0';
        
        containerRef.current.appendChild(sparkleElement);
        
        // Animate the sparkle
        const sparkle = { x, y, size, duration };
        sparklesRef.current.push(sparkle);
        
        let startTime: number | null = null;
        
        const animateSparkle = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = elapsed / duration;
          
          if (progress < 1) {
            // Fade in and out with a peak in the middle
            let opacity;
            if (progress < 0.5) {
              opacity = progress * 2;
            } else {
              opacity = (1 - progress) * 2;
            }
            
            sparkleElement.style.opacity = opacity.toString();
            sparkleElement.style.transform = `scale(${progress < 0.5 ? progress * 2 : (1 - progress) * 2})`;
            
            requestAnimationFrame(animateSparkle);
          } else {
            // Remove the sparkle element when animation is complete
            if (containerRef.current && sparkleElement.parentNode === containerRef.current) {
              containerRef.current.removeChild(sparkleElement);
            }
          }
        };
        
        requestAnimationFrame(animateSparkle);
      }
    }
    
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [trigger, targetRef]);
  
  return <div ref={containerRef} className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-50"></div>;
};

export default SparkleEffect;
