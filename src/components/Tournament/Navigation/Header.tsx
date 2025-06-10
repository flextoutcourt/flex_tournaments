// app/tournament/[id]/live/components/TournamentHeader.tsx
import React from 'react';
import { FaTwitch, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface TournamentHeaderProps {
  title: string | null;
  liveTwitchChannel: string | null;
  isTmiConnected: boolean;
  tmiError: string | null;
  generalError: string | null; // Pour afficher les erreurs générales sous le header
}

const TournamentHeader: React.FC<TournamentHeaderProps> = ({ title, liveTwitchChannel, isTmiConnected, tmiError, generalError }) => {
  const displayError = generalError || tmiError;

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-auto text-left mb-6 md:mb-10 fixed bottom-5 left-5 mx-auto p-2 bg-gray-900/80 backdrop-blur-md rounded-xl shadow-lg z-50"
    >
      <div className="flex items-center justify-center text-md sm:text-lg text-gray-300 bg-gray-800/50 px-4 py-2 rounded-lg shadow-md max-w-md mx-auto">
        <FaTwitch className="mr-2 text-purple-400 text-xl" /> Canal: <span className="font-semibold ml-1.5">{liveTwitchChannel || "N/A"}</span>
        <span className="mx-3 text-gray-600">|</span>
        {isTmiConnected ?
          <span className="text-green-400 flex items-center"><div className="h-2.5 w-2.5 bg-green-500 rounded-lg mr-2 animate-pulse"></div>Connecté</span> :
          <span className="text-yellow-400 flex items-center"><FaSpinner className="animate-spin mr-2" />Connexion...</span>
        }
      </div>
      {displayError && (
        <p className="text-red-300 max-w-md mt-3 text-sm bg-red-900/50 p-2 rounded-md mx-auto">
          {displayError}
        </p>
      )}
    </motion.header>
  );
};

export default TournamentHeader;