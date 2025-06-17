// app/tournament/[id]/live/components/ActiveMatchView.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { CurrentMatch } from '@/types';
import { cardVariants } from '@/animationVariants';
import ParticipantCard from './TournamentItem';
import { generateKeywords } from '@/utils/tournamentHelper';

interface ActiveMatchViewProps {
  activeMatch: CurrentMatch;
  matchesCount: number;
  onDeclareWinner: (itemKey: 'item1' | 'item2') => void;
  onMouseEnterPlayer: (playerRef: React.MutableRefObject<YT.Player | null>) => void;
  onMouseLeavePlayer: (playerRef: React.MutableRefObject<YT.Player | null>) => void;
  player1Ref: React.MutableRefObject<YT.Player | null>;
  player2Ref: React.MutableRefObject<YT.Player | null>;
}

const ActiveMatchView: React.FC<ActiveMatchViewProps> = ({
  activeMatch,
  matchesCount,
  onDeclareWinner,
  onMouseEnterPlayer,
  onMouseLeavePlayer,
  player1Ref,
  player2Ref,
}) => {
  return (
    <motion.div
      key={activeMatch.item1.id + activeMatch.item2.id + activeMatch.roundNumber + activeMatch.matchNumberInRound}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-7xl bg-gray-800/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl"
    >
      <div className="text-center mb-6 md:mb-8">
        <p className="text-md text-purple-300 font-semibold tracking-wider uppercase">
          Round {activeMatch.roundNumber} <span className="text-gray-500 mx-1">•</span> Match {activeMatch.matchNumberInRound} / {matchesCount}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
        <ParticipantCard
          participant={activeMatch.item1}
          onDeclareWinner={() => onDeclareWinner('item1')}
          onMouseEnterPlayer={() => onMouseEnterPlayer(player1Ref)}
          onMouseLeavePlayer={() => onMouseLeavePlayer(player1Ref)}
          playerId="youtube-player-1"
          colorClass="purple"
          buttonGradient="from-blue-500 to-indigo-600"
        />

        <div className="flex lg:hidden items-center justify-center my-4">
          <p className="text-3xl font-black text-gray-600">VS</p>
        </div>

        <ParticipantCard
          participant={activeMatch.item2}
          onDeclareWinner={() => onDeclareWinner('item2')}
          onMouseEnterPlayer={() => onMouseEnterPlayer(player2Ref)}
          onMouseLeavePlayer={() => onMouseLeavePlayer(player2Ref)}
          playerId="youtube-player-2"
          colorClass="pink"
          buttonGradient="from-red-500 to-pink-500"
        />
      </div>
      <p className="text-center text-sm text-gray-400 mt-10 px-4">
        Votez : <code className="bg-gray-700 px-1.5 py-0.5 rounded text-purple-300">1</code> pour {activeMatch.item1.name},
        <br className="sm:hidden" /> ou <code className="bg-gray-700 px-1.5 py-0.5 rounded text-pink-300">2</code> pour {activeMatch.item2.name}.
      </p>
    </motion.div>
  );
};

export default ActiveMatchView;