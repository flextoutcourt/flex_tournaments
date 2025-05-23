// app/tournament/[id]/live/animationVariants.ts
export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export const scoreVariants = {
  initial: { scale: 0.8, opacity: 0.5 },
  animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 400, damping: 10 } },
};

export const winnerMessageVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", delay: 0.2, duration: 0.8, bounce: 0.4 } },
};