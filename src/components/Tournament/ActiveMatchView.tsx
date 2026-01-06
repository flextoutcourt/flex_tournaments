// app/tournament/[id]/live/components/ActiveMatchView.tsx
import React, { RefObject } from 'react';
import { motion } from 'framer-motion';
import { CurrentMatch } from '@/types';
import { cardVariants } from '@/animationVariants';
import ParticipantCard from './TournamentItem';
import VoteAnimationLayer from '@/components/Shared/VoteAnimationLayer';
import { useVoteAnimation } from '@/hooks/useVoteAnimation';

interface ActiveMatchViewProps {
  activeMatch: CurrentMatch;
  matchesCount: number;
  onDeclareWinner: (itemKey: 'item1' | 'item2') => void;
  onMouseEnterPlayer: (playerRef: React.MutableRefObject<YT.Player | null>) => void;
  onMouseLeavePlayer: (playerRef: React.MutableRefObject<YT.Player | null>) => void;
  player1Ref: React.MutableRefObject<YT.Player | null>;
  player2Ref: React.MutableRefObject<YT.Player | null>;
  votedUsers: RefObject<Set<{username: string; votedItem: string}>>
  superVotesThisMatch?: React.MutableRefObject<Set<string>>;
  animateVoteToTargetRef?: React.MutableRefObject<((itemId: 'item1' | 'item2') => void) | null>;
}

const ActiveMatchView: React.FC<ActiveMatchViewProps> = ({
  activeMatch,
  matchesCount,
  onDeclareWinner,
  onMouseEnterPlayer,
  onMouseLeavePlayer,
  player1Ref,
  player2Ref,
  votedUsers,
  superVotesThisMatch,
  animateVoteToTargetRef,
}) => {
  // Initialize vote animation system
  const {
    activeTokens,
    registerBarRef,
    getTargetPosition,
    animateVoteToTarget,
    animationConfig,
  } = useVoteAnimation({ duration: 800 });

  // Expose the animation function to parent via ref
  React.useEffect(() => {
    if (animateVoteToTargetRef) {
      animateVoteToTargetRef.current = animateVoteToTarget;
    }
  }, [animateVoteToTarget, animateVoteToTargetRef]);

  return (
    <>
      <VoteAnimationLayer
        activeTokens={activeTokens}
        getTargetPosition={getTargetPosition}
        animationDuration={animationConfig.duration}
        originX={animationConfig.originX}
        originY={animationConfig.originY}
      />
      <motion.div
        key={activeMatch.item1.id + activeMatch.item2.id + activeMatch.roundNumber + activeMatch.matchNumberInRound}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full h-full flex flex-col gap-2"
      >
      {/* Ultra Compact Match Info Header */}
      <div className="flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center font-black text-xs">
              R{activeMatch.roundNumber}
            </div>
            <span className="text-xs font-semibold text-gray-300">Round {activeMatch.roundNumber}</span>
          </div>
          <div className="w-px h-4 bg-slate-600"></div>
          <span className="text-xs font-medium text-gray-400">
            Match <span className="text-white font-bold">{activeMatch.matchNumberInRound}</span>
            <span className="text-gray-500">/{matchesCount}</span>
          </span>
        </div>

        {/* Compact Vote Instructions */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
          <span className="text-gray-400">💬</span>
          <code className="bg-indigo-600 px-1.5 py-0.5 rounded text-white font-bold">1</code>
          <span className="text-gray-500">ou</span>
          <code className="bg-pink-600 px-1.5 py-0.5 rounded text-white font-bold">2</code>
        </div>
      </div>

      {/* VS Battle Layout - Takes remaining space */}
      <div className="flex-1 relative min-h-0">
        {/* Desktop VS Divider */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-600 blur-lg opacity-40"></div>
            <div className="relative w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-indigo-500 rounded-lg flex items-center justify-center shadow-xl">
              <span className="text-xl font-black text-white">VS</span>
            </div>
          </div>
        </div>

        {/* Participants Grid */}
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          <ParticipantCard
            participant={activeMatch.item1}
            onDeclareWinner={() => {onDeclareWinner('item1'); votedUsers.current.clear()}}
            onMouseEnterPlayer={() => onMouseEnterPlayer(player1Ref)}
            onMouseLeavePlayer={() => onMouseLeavePlayer(player1Ref)}
            playerId="youtube-player-1"
            colorClass="purple"
            buttonGradient="from-blue-500 to-indigo-600"
            votedUsers={votedUsers}
            number={1}
            item1Score={activeMatch.item1.score}
            item2Score={activeMatch.item2.score}
            superVotesThisMatch={superVotesThisMatch}
            registerBarRef={registerBarRef}
          />

          {/* Mobile VS Divider */}
          <div className="flex lg:hidden items-center justify-center my-1">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-600 blur-md opacity-40"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-lg font-black text-white">VS</span>
              </div>
            </div>
          </div>

          <ParticipantCard
            participant={activeMatch.item2}
            onDeclareWinner={() => {onDeclareWinner('item2'); votedUsers.current.clear()}}
            onMouseEnterPlayer={() => onMouseEnterPlayer(player2Ref)}
            onMouseLeavePlayer={() => onMouseLeavePlayer(player2Ref)}
            playerId="youtube-player-2"
            colorClass="pink"
            buttonGradient="from-red-500 to-pink-500"
            votedUsers={votedUsers}
            number={2}
            item1Score={activeMatch.item1.score}
            item2Score={activeMatch.item2.score}
            superVotesThisMatch={superVotesThisMatch}
            registerBarRef={registerBarRef}
          />
        </div>
      </div>

      {/* Mobile Vote Instructions */}
      <div className="flex-shrink-0 md:hidden text-center">
        <div className="inline-flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-2 py-1 rounded-lg text-xs">
          <span className="text-gray-400">💬</span>
          <code className="bg-indigo-600 px-1.5 py-0.5 rounded text-white font-bold">1</code>
          <span className="text-gray-500">ou</span>
          <code className="bg-pink-600 px-1.5 py-0.5 rounded text-white font-bold">2</code>
        </div>
      </div>
    </motion.div>
    </>
  );
};

export default ActiveMatchView;