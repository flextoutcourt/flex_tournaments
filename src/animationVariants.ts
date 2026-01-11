// app/tournament/[id]/live/animationVariants.ts
export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export const scoreVariants = {
  initial: { scale: 0.8, opacity: 0.5, y: 10 },
  animate: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 10 } },
};

// Animation for score increment feedback
export const scoreIncrementVariants = {
  initial: { opacity: 0, y: 0, scale: 1 },
  animate: { 
    opacity: 1, 
    y: -30,
    scale: 1.2,
    transition: { duration: 0.6, ease: "easeOut" } 
  },
  exit: { 
    opacity: 0, 
    y: -60,
    transition: { duration: 0.3 } 
  },
};

// Animation for individual digit flipping (3D flip style)
export const digitFlipVariants = {
  initial: { opacity: 0, rotateX: -90, scale: 0.8 },
  animate: { 
    opacity: 1, 
    rotateX: 0,
    scale: 1,
    transition: { duration: 0.15, ease: "easeOut" } 
  },
  exit: { 
    opacity: 0, 
    rotateX: 90,
    scale: 0.8,
    transition: { duration: 0.1 } 
  },
};

export const winnerMessageVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", delay: 0.2, duration: 0.8, bounce: 0.4 } },
};