import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsTouchDevice, usePrefersReducedMotion } from '@/hooks/useMediaQuery';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'view' | 'drag'>('default');
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const isTouch = useIsTouchDevice();
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (isTouch || prefersReduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Inspect target element for contextual cursor modes
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const mode = cursorTarget.getAttribute('data-cursor');
        const text = cursorTarget.getAttribute('data-cursor-text') || '';
        if (mode === 'view') {
          setCursorType('view');
          setCursorText(text || 'VIEW');
        } else if (mode === 'drag') {
          setCursorType('drag');
          setCursorText(text || 'DRAG');
        } else {
          setCursorType('pointer');
          setCursorText('');
        }
      } else if (target.closest('a, button, input, select, [role="button"]')) {
        setCursorType('pointer');
        setCursorText('');
      } else {
        setCursorType('default');
        setCursorText('');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isTouch, prefersReduced, isVisible]);

  if (isTouch || prefersReduced || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Central crisp dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-titanium-100 mix-blend-difference"
        animate={{
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
          width: cursorType === 'pointer' ? 6 : 5,
          height: cursorType === 'pointer' ? 6 : 5,
          opacity: cursorType === 'view' ? 0 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 40,
          stiffness: 800,
          mass: 0.1,
        }}
      />

      {/* Trailing soft interaction ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full flex items-center justify-center border border-white/30 backdrop-blur-[1px]"
        animate={{
          x: mousePosition.x - (cursorType === 'view' ? 36 : cursorType === 'pointer' ? 22 : 16),
          y: mousePosition.y - (cursorType === 'view' ? 36 : cursorType === 'pointer' ? 22 : 16),
          width: cursorType === 'view' ? 72 : cursorType === 'pointer' ? 44 : 32,
          height: cursorType === 'view' ? 72 : cursorType === 'pointer' ? 44 : 32,
          backgroundColor:
            cursorType === 'view'
              ? 'rgba(255, 255, 255, 0.12)'
              : cursorType === 'pointer'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(255, 255, 255, 0.01)',
          borderColor:
            cursorType === 'view'
              ? 'rgba(255, 255, 255, 0.5)'
              : cursorType === 'pointer'
              ? 'rgba(255, 255, 255, 0.4)'
              : 'rgba(255, 255, 255, 0.2)',
        }}
        transition={{
          type: 'spring',
          damping: 28,
          stiffness: 300,
          mass: 0.3,
        }}
      >
        {cursorType === 'view' && (
          <span className="text-[10px] font-mono tracking-widest text-titanium-100 font-medium uppercase select-none">
            {cursorText}
          </span>
        )}
      </motion.div>
    </>
  );
};
