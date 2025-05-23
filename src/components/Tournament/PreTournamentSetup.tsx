// app/tournament/[id]/live/components/PreTournamentSetup.tsx
import React from 'react';
import { FaPlayCircle, FaUsersCog } from 'react-icons/fa';
import { motion } from 'framer-motion'; // Ajustez le chemin
import { Item } from '@/types';

interface PreTournamentSetupProps {
  tournamentTitle: string | null;
  liveTwitchChannel: string | null;
  initialItems: Item[];
  selectedItemCountOption: string;
  onSelectedItemCountChange: (value: string) => void;
  onStartTournament: () => void;
  error: string | null; // Pour afficher les erreurs de démarrage
  validTournamentSizes: number[];
}

const PreTournamentSetup: React.FC<PreTournamentSetupProps> = ({
  tournamentTitle,
  liveTwitchChannel,
  initialItems,
  selectedItemCountOption,
  onSelectedItemCountChange,
  onStartTournament,
  error,
  validTournamentSizes
}) => {
  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { delay: 0.2, type: "spring", stiffness: 120 } } }}
        className="bg-gray-800/80 backdrop-blur-md p-10 rounded-2xl shadow-xl max-w-lg w-full"
      >
        <motion.div animate={{ rotate: [0, 10, -10, 10, 0], transition: { duration: 1, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" } }}>
          <FaPlayCircle className="h-28 w-28 text-purple-400 mx-auto mb-8" />
        </motion.div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{tournamentTitle || "Tournoi"}</h1>
        <p className="text-lg text-gray-300 mb-3">Prêt à lancer le tournoi sur :</p>
        <p className="text-2xl font-semibold text-purple-300 bg-gray-700/50 px-4 py-2 rounded-md inline-block mb-8">{liveTwitchChannel || "Non spécifié"}</p>

        <div className="mb-6">
          <label htmlFor="itemCountSelect" className="block text-sm font-medium text-gray-300 mb-2">
            <FaUsersCog className="inline-block mr-2 mb-0.5" /> Nombre de participants :
          </label>
          <select
            id="itemCountSelect"
            value={selectedItemCountOption}
            onChange={(e) => onSelectedItemCountChange(e.target.value)}
            className="w-full max-w-xs mx-auto px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 focus:ring-purple-500 focus:border-purple-500"
            disabled={initialItems.length < 2}
          >
            <option value="all">Tous ({initialItems.length})</option>
            {validTournamentSizes.map(size => (
              <option key={size} value={size.toString()}>{size} participants</option>
            ))}
          </select>
          {initialItems.length > 0 && parseInt(selectedItemCountOption) > initialItems.length && selectedItemCountOption !== "all" && (
            <p className="text-xs text-yellow-400 mt-1">
              Moins de {selectedItemCountOption} participants disponibles. Tous les {initialItems.length} seront utilisés.
            </p>
          )}
        </div>

        {initialItems.length > 0 && <p className="text-md text-gray-400 mb-2">Participants totaux : <span className="font-bold text-gray-200">{initialItems.length}</span></p>}
        {error && <p className="text-red-300 max-w-md mb-4">{error}</p>}
        <motion.button
          onClick={onStartTournament}
          disabled={initialItems.length < 2 || !liveTwitchChannel}
          className="w-full px-10 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-xl rounded-lg shadow-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(50, 205, 50, 0.7)" }}
          whileTap={{ scale: 0.95 }}
        >
          DÉMARRER LE TOURNOI
        </motion.button>
        {initialItems.length < 2 && <p className="text-sm text-yellow-400 mt-4">Au moins 2 participants requis.</p>}
        {!liveTwitchChannel && <p className="text-sm text-yellow-400 mt-4">Canal Twitch manquant.</p>}
      </motion.div>
    </div>
  );
};

export default PreTournamentSetup;