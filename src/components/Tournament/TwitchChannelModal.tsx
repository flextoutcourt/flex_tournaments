// components/Tournament/TwitchChannelModal.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTwitch, FaTimes } from 'react-icons/fa';

interface TwitchChannelModalProps {
  isOpen: boolean;
  onConfirm: (channel: string) => void;
  onCancel: () => void;
  defaultChannel?: string;
}

const TwitchChannelModal: React.FC<TwitchChannelModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  defaultChannel = ''
}) => {
  const [channelInput, setChannelInput] = useState(defaultChannel);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!channelInput.trim()) {
      setError('Veuillez entrer un nom de canal Twitch');
      return;
    }

    // Clean the channel name (remove @ or # if present)
    const cleanChannel = channelInput.trim().replace(/^[@#]/, '').toLowerCase();
    
    if (cleanChannel.length < 3) {
      setError('Le nom du canal doit contenir au moins 3 caractères');
      return;
    }

    onConfirm(cleanChannel);
  };

  const handleCancel = () => {
    setError('');
    onCancel();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            onClick={handleCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
              {/* Close Button */}
              <button
                onClick={handleCancel}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>

              {/* Header */}
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4 shadow-lg">
                  <FaTwitch className="text-3xl text-white" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">
                  Reprise du Tournoi
                </h2>
                <p className="text-gray-400 text-sm">
                  Connectez-vous à un canal Twitch pour recevoir les votes en temps réel
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="twitch-channel" className="block text-sm font-semibold text-gray-300 mb-2">
                    Nom du canal Twitch
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
                      <FaTwitch className="text-lg" />
                    </div>
                    <input
                      id="twitch-channel"
                      type="text"
                      value={channelInput}
                      onChange={(e) => {
                        setChannelInput(e.target.value);
                        setError('');
                      }}
                      placeholder="luniqueflex (J'suis pas que dev, j'suis drole)"
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border-2 border-slate-700 focus:border-purple-500 rounded-xl text-white placeholder-gray-500 transition-colors outline-none"
                      autoFocus
                    />
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>{error}</span>
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all border-2 border-slate-600 hover:border-slate-500"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/30 border-2 border-purple-500/50"
                  >
                    Confirmer
                  </button>
                </div>
              </form>

              {/* Info */}
              <div className="mt-4 p-3 bg-indigo-900/30 border border-indigo-700/50 rounded-lg">
                <p className="text-xs text-indigo-300">
                  <span className="font-bold">💡 Astuce:</span> Le canal doit être actif et accessible pour recevoir les votes du chat.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TwitchChannelModal;
