// app/tournament/[id]/live/components/ParticipantCard.tsx
import React, { RefObject } from 'react';
import { motion }  from 'framer-motion';
import { FaYoutube } from 'react-icons/fa';
import { MatchParticipant } from '@/types';
import { scoreVariants } from '@/animationVariants';
import VoteBar from '../Shared/Votebar';

interface ParticipantCardProps {
  participant: MatchParticipant;
  onDeclareWinner: () => void;
  onMouseEnterPlayer: () => void;
  onMouseLeavePlayer: () => void;
  playerId: string; // 'youtube-player-1' or 'youtube-player-2'
  colorClass: string; // e.g., 'purple' or 'pink' for theming
  buttonGradient: string; // e.g., 'from-blue-500 to-indigo-600'
  votedUsers: RefObject<Set<{username: string; votedItem: string}>>;
  number: number;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({
  participant,
  onDeclareWinner,
  onMouseEnterPlayer,
  onMouseLeavePlayer,
  playerId,
  colorClass,
  buttonGradient,
  votedUsers,
  number
}) => {

  console.log(votedUsers);

  const isPlayer1 = number === 1;
  const accentColor = isPlayer1 ? 'indigo' : 'pink';
  const votes = votedUsers.current ? Array.from(votedUsers.current).filter(vote => vote.votedItem === `item${number}`) : [];

  return (
    <motion.div
      className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 hover:border-slate-600 rounded-xl shadow-xl flex flex-col h-full overflow-hidden transition-all duration-300"
      whileHover={{ y: -2 }}
      onMouseEnter={onMouseEnterPlayer}
      onMouseLeave={onMouseLeavePlayer}
    >
      {/* Compact Header with Name, Category, Player Number & Votes */}
      <div className={`flex-shrink-0 bg-gradient-to-r from-${accentColor}-900/40 to-transparent border-b border-slate-700 px-3 py-2`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Player Number Badge */}
            <div className={`w-8 h-8 bg-${accentColor}-600 rounded-lg flex items-center justify-center shadow-md border border-${accentColor}-400 flex-shrink-0`}>
              <span className="text-white text-lg font-black">{number}</span>
            </div>
            
            {/* Name & Category */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-black text-white truncate" title={participant.name}>
                {participant.name}
              </h2>
              {participant.category && (
                <div className={`inline-flex items-center px-2 py-0.5 bg-${accentColor}-600/20 border border-${accentColor}-600/40 rounded text-${accentColor}-300 text-xs font-bold uppercase`}>
                  {participant.category}
                </div>
              )}
            </div>
          </div>

          {/* Vote Count Badge */}
          {votes.length > 0 && (
            <div className={`bg-${accentColor}-600 px-2 py-1 rounded-lg shadow-md border border-${accentColor}-400 flex items-center gap-1 flex-shrink-0`}>
              <span className="text-sm">🔥</span>
              <span className="text-white text-sm font-black">{votes.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area - Flexible */}
      <div className="flex-1 p-3 flex flex-col gap-2 min-h-0">
        {/* Video Player - Compact */}
        {participant.youtubeVideoId ? (
          <motion.div
            className="w-full aspect-video rounded-lg overflow-hidden shadow-lg bg-black border border-slate-700 flex-shrink-0"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
          >
            <div id={playerId} className="w-full h-full"></div>
          </motion.div>
        ) : participant.youtubeUrl ? (
          <a 
            href={participant.youtubeUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`aspect-video rounded-lg flex items-center justify-center bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-${accentColor}-500 transition-all shadow-lg group flex-shrink-0`}
          >
            <div className="text-center">
              <FaYoutube className={`text-3xl text-${accentColor}-400 mb-1 mx-auto group-hover:scale-110 transition-transform`} />
              <span className="text-white text-xs font-semibold">YouTube</span>
            </div>
          </a>
        ) : (
          <div className="aspect-video rounded-lg flex items-center justify-center bg-slate-700/50 border border-slate-600/50 shadow-lg flex-shrink-0">
            <span className="text-gray-500 text-sm font-medium">Pas de vidéo</span>
          </div>
        )}

        {/* Score Display - Compact */}
        <motion.div
          key={`score-${participant.id}-${participant.score}`}
          variants={scoreVariants} 
          initial="initial" 
          animate="animate"
          className={`flex-shrink-0 text-center bg-gradient-to-br from-slate-700 to-slate-800 border border-${accentColor}-600/30 rounded-lg py-2 shadow-lg`}
        >
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Score</div>
          <div className={`text-4xl font-black text-${accentColor}-400`}>
            {participant.score}
          </div>
        </motion.div>

        {/* Vote Progress Bar - Compact */}
        <div className="flex-shrink-0">
          <VoteBar votedUsers={votedUsers} number={number} />
        </div>

        {/* Winner Button - Compact */}
        <motion.button
          onClick={onDeclareWinner}
          className={`w-full flex-shrink-0 px-3 py-2.5 bg-gradient-to-r ${buttonGradient} text-white text-sm font-black rounded-lg shadow-lg border border-white/10 hover:border-white/30 transition-all`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-2">
            <span>👑</span>
            <span>Déclarer Vainqueur</span>
          </span>
        </motion.button>
      </div>

      {/* Recent Voters - Compact Footer */}
      {votes.length > 0 && (
        <div className={`flex-shrink-0 bg-gradient-to-t from-${accentColor}-900/20 to-transparent border-t border-slate-700/50 px-3 py-2`}>
          <div className="flex items-center gap-1 mb-1">
            <span className="text-white/70 text-xs font-semibold uppercase">Derniers votes</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {votes.slice(0, 5).map((vote, index) => (
              <div 
                key={index} 
                className={`bg-${accentColor}-600/30 border border-${accentColor}-600/50 px-1.5 py-0.5 rounded text-white text-xs font-medium`}
              >
                {vote.username}
              </div>
            ))}
            {votes.length > 5 && (
              <div className="bg-slate-700 border border-slate-600 px-1.5 py-0.5 rounded text-white/70 text-xs font-medium">
                +{votes.length - 5}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ParticipantCard;