// app/tournament/[id]/live/components/NoMatchScreen.tsx
import React from 'react';
import { FaClipboardList } from 'react-icons/fa';
import { motion } from 'framer-motion';

const NoMatchScreen: React.FC = () => (
  <motion.div
    key="no-match"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="text-center py-10"
  >
    <FaClipboardList className="h-20 w-20 text-gray-600 mx-auto mb-6" />
    <p className="text-2xl text-gray-500">Préparation ou fin du tournoi...</p>
  </motion.div>
);

export default NoMatchScreen;