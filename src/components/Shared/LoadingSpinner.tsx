// app/tournament/[id]/live/components/LoadingSpinner.tsx
import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white flex flex-col items-center justify-center p-4">
    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <FaSpinner className="animate-spin h-16 w-16 text-purple-300 mb-6" />
    </motion.div>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="text-2xl font-semibold"
    >
      Chargement du Tournoi...
    </motion.p>
  </div>
);

export default LoadingSpinner;