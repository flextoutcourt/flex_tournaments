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
  colorClass, // 'purple' ou 'pink'
  buttonGradient,
  votedUsers,
  number
}) => {

  console.log(votedUsers);

  return (
    <motion.div
      className={`relative bg-gray-700/70 p-5 md:p-6 rounded-xl shadow-xl flex flex-col transition-all duration-300 hover:shadow-${colorClass}-500/40`}
      whileHover={{ y: -5 }}
      onMouseEnter={onMouseEnterPlayer}
      onMouseLeave={onMouseLeavePlayer}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-3 truncate text-center" title={participant.name}>{participant.name}</h2>
      {participant.youtubeVideoId ? (
        <motion.div
          className="aspect-video rounded-lg overflow-hidden mb-4 shadow-lg bg-black"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        >
          <div id={playerId} className="w-full h-full"></div>
        </motion.div>
      ) : participant.youtubeUrl ? (
        <a href={participant.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline mb-3 inline-flex items-center justify-center w-full py-2 bg-gray-600 rounded-md hover:bg-gray-500">
          <FaYoutube className="mr-2" />Lien YouTube
        </a>
      ) : (
        <div className="aspect-video rounded-lg overflow-hidden mb-4 shadow-lg bg-black flex items-center justify-center text-gray-500">
            Pas de vidéo
        </div>
      )}
      <motion.p
        key={`score-${participant.id}-${participant.score}`}
        variants={scoreVariants} initial="initial" animate="animate"
        className={`text-7xl md:text-8xl font-bold text-${colorClass}-400 my-4 md:my-6 text-center`}
      >
        {participant.score}
      </motion.p>
      <VoteBar votedUsers={votedUsers} number={number} />
      <motion.button
        onClick={onDeclareWinner}
        className={`w-full mt-auto px-4 py-3 bg-gradient-to-r ${buttonGradient} text-white font-semibold rounded-lg shadow-lg`}
        whileHover={{ scale: 1.05, boxShadow: `0px 0px 12px rgba(${colorClass === 'purple' ? '96, 165, 250' : '239, 68, 68'}, 0.7)` }}
        whileTap={{ scale: 0.95 }}
      >
        Déclarer Gagnant
      </motion.button>
      <div className={`absolute ${number == 1 ? "right-full -mr-4" : 'left-full -ml-4'} -bottom-2 bg-indigo-500 p-4 rounded-lg shadow-lg`}>
        <div className="text-white text-sm font-semibold mb-2">Votes:</div>
        <div className="max-h-32 overflow-y-auto">
          {votedUsers.current && Array.from(votedUsers.current)
            .filter(vote => vote.votedItem === `item${number}`)
            .slice(0,6).map((vote, index) => (
              <div key={index} className="text-white text-xs mb-1">
                {vote.username}
              </div>
            ))}
            {(votedUsers.current && Array.from(votedUsers.current).filter(vote => vote.votedItem === `item${number}`).length -6) > 0 && (
              <div className="text-white text-xs mb-1">
                And {votedUsers.current && Array.from(votedUsers.current).filter(vote => vote.votedItem === `item${number}`).length -6} more...
              </div>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default ParticipantCard;