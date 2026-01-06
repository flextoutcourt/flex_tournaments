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

const TournamentHeader: React.FC<TournamentHeaderProps> = ({ title: _title, liveTwitchChannel, isTmiConnected, tmiError, generalError }) => {
  const displayError = generalError || tmiError;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-auto text-left mb-3 fixed top-4 left-4 p-1.5 bg-slate-900/90 backdrop-blur-md rounded-lg shadow-lg z-50"
    >
      <div className="flex items-center justify-center text-xs text-gray-300 bg-slate-800/50 px-3 py-1.5 rounded-md shadow-md">
        <FaTwitch className="mr-1.5 text-purple-400 text-sm" /> 
        <span className="text-gray-400">Canal:</span>
        <span className="font-semibold ml-1">{liveTwitchChannel || "N/A"}</span>
        <span className="mx-2 text-gray-600">|</span>
        {isTmiConnected ?
          <span className="text-green-400 flex items-center">
            <div className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
            Connecté
          </span> :
          <span className="text-yellow-400 flex items-center">
            <FaSpinner className="animate-spin mr-1.5 text-xs" />
            Connexion...
          </span>
        }
      </div>
      {displayError && (
        <p className="text-red-300 mt-2 text-xs bg-red-900/50 p-2 rounded-md">
          {displayError}
        </p>
      )}
    </motion.header>
  );
};

export default TournamentHeader;