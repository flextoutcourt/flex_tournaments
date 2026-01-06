'use client';

import { motion } from 'framer-motion';
import { FaBan } from 'react-icons/fa';

interface BanModalProps {
  isOpen: boolean;
  banReason?: string;
  onClose: () => void;
}

export default function BanModal({ isOpen, banReason, onClose }: BanModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 border-2 border-red-500 rounded-2xl shadow-2xl max-w-md w-full p-8"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-500/20 border-2 border-red-500 rounded-full flex items-center justify-center">
            <FaBan className="text-4xl text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-red-500 mb-4">
          Compte suspendu
        </h2>

        {/* Message */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-gray-300 text-center mb-3">
            Votre compte a été suspendu et vous ne pouvez pas accéder à Flex Tournaments.
          </p>
          {banReason && (
            <div className="bg-slate-800/50 rounded p-3 border-l-2 border-red-500">
              <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Raison :</p>
              <p className="text-red-400 text-sm">{banReason}</p>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <p className="text-center text-gray-400 text-sm mb-6">
          Si vous pensez que cette action est une erreur, veuillez contacter le support.
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
        >
          Fermer
        </button>
      </motion.div>
    </div>
  );
}
