import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { digitFlipVariants } from '@/animationVariants';

interface AnimatedScoreDigitProps {
  digit: number;
  accentColor: string;
}

const AnimatedScoreDigit: React.FC<AnimatedScoreDigitProps> = ({ digit, accentColor }) => {
  return (
    <div className={`relative inline-block w-8 h-14 flex items-center justify-center will-change-transform overflow-hidden`}>
      <AnimatePresence mode="sync">
        <motion.div
          key={`digit-${digit}`}
          variants={digitFlipVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`absolute inset-0 flex items-center justify-center text-3xl font-black text-${accentColor}-400 tabular-nums leading-none`}
        >
          {digit}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default React.memo(AnimatedScoreDigit);
