"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="page-transition-root" style={{ width: "100%", minWidth: 0 }}>
        {children}
      </div>
    );
  }

  const pageVariants = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
  };

  const pageTransition = {
    type: "tween",
    ease: [0.33, 0, 0.2, 1],
    duration: 0.16,
  };

  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div
        key={pathname}
        className="page-transition-root"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        style={{ width: "100%", minWidth: 0 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
