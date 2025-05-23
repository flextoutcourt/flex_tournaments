// app/tournament/[id]/live/components/ErrorDisplay.tsx
import React from 'react';
import { FaRegFrown } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface ErrorDisplayProps {
  message: string;
  onClose?: () => void; // Optionnel, pour fermer l'onglet/la page
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onClose = () => window.close() }) => (
  <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 p-8 rounded-xl shadow-2xl"
    >
      <FaRegFrown className="h-20 w-20 text-red-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-3 text-red-400">Erreur</h1>
      <p className="text-red-300 max-w-md mb-6">{message}</p>
      <button
        onClick={onClose}
        className="mt-6 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg transition-transform hover:scale-105"
      >
        Fermer
      </button>
    </motion.div>
  </div>
);

export default ErrorDisplay;