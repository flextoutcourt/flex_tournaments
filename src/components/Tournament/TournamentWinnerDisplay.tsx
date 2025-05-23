// app/tournament/[id]/live/components/TournamentWinnerDisplay.tsx
import React from 'react';
import { FaTrophy } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ConfettiEffect from './ConfettiEffect'; // Ajustez
import { Item } from '@/types';
import { winnerMessageVariants } from '@/animationVariants';

interface TournamentWinnerDisplayProps {
  winner: Item;
  showConfetti: boolean;
  onClosePage: () => void;
}

const TournamentWinnerDisplay: React.FC<TournamentWinnerDisplayProps> = ({ winner, showConfetti, onClosePage }) => {
  return (
    <motion.div
      key="winner"
      variants={winnerMessageVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="w-full max-w-lg bg-gray-800/90 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-2xl text-center"
    >
      {showConfetti && <ConfettiEffect />}
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 150 }}>
        <FaTrophy className="h-28 w-28 text-yellow-400 mx-auto mb-6" />
      </motion.div>
      <h2 className="text-3xl font-bold text-yellow-300 mb-4">VAINQUEUR DU TOURNOI !</h2>
      <motion.p
        className="text-5xl font-extrabold text-white py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {winner.name}
      </motion.p>
      <motion.button
        onClick={onClosePage}
        className="mt-10 px-8 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Fermer la Page
      </motion.button>
    </motion.div>
  );
};

export default TournamentWinnerDisplay;