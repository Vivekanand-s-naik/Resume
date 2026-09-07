import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile, usePrefersReducedMotion } from '../../hooks/useMediaQuery';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest('a, button, [role="button"], input, textarea, .cursor-pointer');
      setIsHovered(isInteractive);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isMobile, prefersReducedMotion, isVisible]);

  if (isMobile || prefersReducedMotion || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {/* Center sharp dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovered ? 0 : 1,
          opacity: 0.9,
        }}
        transition={{ type: 'spring', stiffness: 1000, damping: 50 }}
      />
      {/* Trailing orbital ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#00F0FF]/50 pointer-events-none"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovered ? 1.6 : 1,
          borderColor: isHovered ? '#B600A8' : '#00F0FF',
          backgroundColor: isHovered ? 'rgba(182, 0, 168, 0.1)' : 'rgba(0, 240, 255, 0)',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      />
    </div>
  );
};
