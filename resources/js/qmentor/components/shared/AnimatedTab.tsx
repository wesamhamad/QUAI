import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface AnimatedTabProps {
  activeKey: string;
  children: ReactNode;
  className?: string;
  /** Vary animation feel per page type */
  variant?: 'fade' | 'slide' | 'scale';
}

const variants = {
  fade: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
  },
  slide: {
    initial: { opacity: 0, x: 12 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -12 },
    transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] },
  },
  scale: {
    initial: { opacity: 0, scale: 0.97 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.99 },
    transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] },
  },
};

/** Smooth transition for tab content changes */
export default function AnimatedTab({ activeKey, children, className = '', variant = 'fade' }: AnimatedTabProps) {
  const v = variants[variant];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeKey}
        initial={v.initial}
        animate={v.animate}
        exit={v.exit}
        transition={v.transition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
