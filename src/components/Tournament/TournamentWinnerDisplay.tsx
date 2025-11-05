// app/tournament/[id]/live/components/TournamentWinnerDisplay.tsx
import React from 'react';
import { FaTrophy, FaMedal } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ConfettiEffect from './ConfettiEffect'; // Ajustez
import { Item, MatchParticipant } from '@/types';
import { winnerMessageVariants } from '@/animationVariants';

interface TournamentWinnerDisplayProps {
  winner: Item | MatchParticipant;
  secondPlace?: MatchParticipant | null;
  thirdPlace?: MatchParticipant | null;
  showConfetti: boolean;
  onClosePage: () => void;
}

const TournamentWinnerDisplay: React.FC<TournamentWinnerDisplayProps> = ({ winner, secondPlace, thirdPlace, showConfetti, onClosePage }) => {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {showConfetti && <ConfettiEffect />}
      
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Main Winner Card */}
      <motion.div
        key="winner"
        variants={winnerMessageVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="relative w-full max-w-7xl mx-auto px-4"
      >
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-indigo-600/50 rounded-3xl shadow-2xl p-6 md:p-12 lg:p-16 text-center relative overflow-hidden">
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-yellow-400/30 rounded-tl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-yellow-400/30 rounded-br-3xl"></div>

          {/* Trophy with Glow */}
          <motion.div 
            className="relative inline-block mb-8"
            initial={{ scale: 0, rotate: -180 }} 
            animate={{ scale: 1, rotate: 0 }} 
            transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 10 }}
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            
            {/* Rotating Ring */}
            <motion.div
              className="absolute inset-0 border-4 border-yellow-400/30 rounded-full"
              style={{ width: '140px', height: '140px', margin: '-10px' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Trophy Icon */}
            <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full p-8 shadow-2xl">
              <FaTrophy className="h-20 w-20 text-white" />
            </div>
            
            {/* Sparkles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                }}
                animate={{
                  x: [0, Math.cos(i * 45 * Math.PI / 180) * 60],
                  y: [0, Math.sin(i * 45 * Math.PI / 180) * 60],
                  opacity: [1, 0],
                  scale: [1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>

          {/* Title */}
          <motion.h2 
            className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 mb-6 uppercase tracking-wider"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            🏆 Vainqueur du Tournoi 🏆
          </motion.h2>

          {/* Winner Name Card */}
          <motion.div
            className="relative mb-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
          >
            {/* Glow behind name */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-50"></div>
            
            {/* Name Container */}
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-1 shadow-2xl">
              <div className="bg-slate-900 rounded-xl px-8 py-6">
                <p className="text-4xl md:text-6xl font-black text-white break-words">
                  {winner.name}
                </p>
                {winner.category && (
                  <motion.div
                    className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600/30 border border-indigo-500/50 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <span className="text-indigo-300 text-sm font-bold uppercase tracking-wide">
                      {winner.category}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Podium Display */}
          {(secondPlace || thirdPlace) ? (
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-end justify-center gap-4 md:gap-6 lg:gap-8 w-full max-w-6xl mx-auto">
                {/* 2nd Place */}
                {secondPlace && (
                  <motion.div
                    className="flex-1 w-full max-w-[280px]"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, type: "spring" }}
                  >
                    <div className="bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-gray-400 rounded-t-2xl p-4 md:p-6 text-center">
                      <div className="mb-3">
                        <FaMedal className="h-12 w-12 text-gray-300 mx-auto" />
                      </div>
                      <div className="text-xl font-black text-gray-300 mb-1">2ème</div>
                      <div className="text-lg font-bold text-white mb-2 truncate" title={secondPlace.name}>
                        {secondPlace.name}
                      </div>
                      <div className="text-2xl font-black text-gray-300">{secondPlace.score}</div>
                      <div className="text-xs text-gray-400 uppercase">points</div>
                    </div>
                    <div className="bg-gradient-to-b from-gray-400 to-gray-500 h-32 rounded-b-xl border-2 border-t-0 border-gray-400 flex items-center justify-center">
                      <div className="text-6xl font-black text-gray-600 opacity-50">2</div>
                    </div>
                  </motion.div>
                )}

                {/* 1st Place - Taller and Wider */}
                <motion.div
                  className="flex-1 w-full max-w-[340px]"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, type: "spring" }}
                >
                  <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 border-2 border-yellow-400 rounded-t-2xl p-6 md:p-8 text-center shadow-2xl relative overflow-hidden">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-yellow-400/20 animate-pulse"></div>
                    
                    <div className="relative z-10">
                      <div className="mb-4">
                        <FaTrophy className="h-16 w-16 text-yellow-200 mx-auto drop-shadow-lg" />
                      </div>
                      <div className="text-2xl font-black text-yellow-100 mb-2">🏆 1er 🏆</div>
                      <div className="text-2xl font-black text-white mb-3 truncate" title={winner.name}>
                        {winner.name}
                      </div>
                      {'score' in winner && (
                        <>
                          <div className="text-4xl font-black text-yellow-100">{winner.score}</div>
                          <div className="text-sm text-yellow-200 uppercase font-bold">points</div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-gradient-to-b from-yellow-400 to-yellow-500 h-48 rounded-b-xl border-2 border-t-0 border-yellow-400 flex items-center justify-center shadow-2xl">
                    <div className="text-8xl font-black text-yellow-600 opacity-50">1</div>
                  </div>
                </motion.div>

                {/* 3rd Place */}
                {thirdPlace && (
                  <motion.div
                    className="flex-1 w-full max-w-[280px]"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, type: "spring" }}
                  >
                    <div className="bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-orange-700 rounded-t-2xl p-4 md:p-6 text-center">
                      <div className="mb-3">
                        <FaMedal className="h-12 w-12 text-orange-600 mx-auto" />
                      </div>
                      <div className="text-xl font-black text-orange-500 mb-1">3ème</div>
                      <div className="text-lg font-bold text-white mb-2 truncate" title={thirdPlace.name}>
                        {thirdPlace.name}
                      </div>
                      <div className="text-2xl font-black text-orange-400">{thirdPlace.score}</div>
                      <div className="text-xs text-gray-400 uppercase">points</div>
                    </div>
                    <div className="bg-gradient-to-b from-orange-700 to-orange-800 h-24 rounded-b-xl border-2 border-t-0 border-orange-700 flex items-center justify-center">
                      <div className="text-6xl font-black text-orange-900 opacity-50">3</div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            /* Single Winner Stats - Fallback if no podium */
            <motion.div
              className="flex justify-center gap-6 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {'score' in winner && (
                <div className="bg-slate-800 border border-indigo-600/30 rounded-xl px-6 py-4 text-center">
                  <div className="text-3xl font-black text-indigo-400">{winner.score}</div>
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">Points</div>
                </div>
              )}
              <div className="bg-slate-800 border border-yellow-600/30 rounded-xl px-6 py-4 text-center">
                <div className="text-3xl font-black text-yellow-400">👑</div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">Champion</div>
              </div>
            </motion.div>
          )}

          {/* Winner's YouTube Video */}
          {winner.youtubeVideoId && (
            <motion.div
              className="mb-10 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
            >
              <div className="relative">
                {/* Glow effect around video */}
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 via-indigo-500/20 to-purple-600/20 rounded-2xl blur-2xl"></div>
                
                {/* Video Container */}
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-400/50">
                  <iframe
                    src={`https://www.youtube.com/embed/${winner.youtubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${winner.youtubeVideoId}`}
                    title={`${winner.name} - Winning Video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <motion.button
              onClick={onClosePage}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-lg font-black rounded-xl shadow-2xl border-2 border-white/10 hover:border-white/30 transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center justify-center gap-2">
                <span>🎉</span>
                <span>Nouveau Tournoi</span>
              </span>
            </motion.button>
          </motion.div>

          {/* Celebration Text */}
          <motion.p
            className="mt-8 text-gray-400 text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Félicitations pour cette victoire écrasante ! 🎊
          </motion.p>
        </div>
      </motion.div>

      {/* Fixed Scroll Indicator - Bottom Center */}
      {winner.youtubeVideoId && (
        <motion.button
          onClick={() => {
            const videoElement = document.querySelector('iframe[title*="Winning Video"]');
            if (videoElement) {
              videoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-16 h-16 bg-white/25 backdrop-blur-md rounded-full shadow-2xl border border-gray-900/20 flex items-center justify-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: [0, -15, 0],
          }}
          transition={{
            opacity: { delay: 0.3, duration: 0.3 },
            y: {
              delay: 0.6,
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Double chevron arrows */}
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7-7-7" />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default TournamentWinnerDisplay;