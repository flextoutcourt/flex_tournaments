import React from 'react';
import { motion } from 'framer-motion';

interface VoteConnectionStatusProps {
  isConnected: boolean;
  voteCount?: number;
}

/**
 * Visual indicator showing SSE vote subscription status
 * Displays connection status and total votes received
 */
export function VoteConnectionStatus({
  isConnected,
  voteCount = 0,
}: VoteConnectionStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm transition-all duration-300 ${
        isConnected
          ? 'bg-green-500/20 text-green-300 border border-green-500/50'
          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
      }`}
    >
      {/* Status indicator dot */}
      <motion.div
        className={`w-2.5 h-2.5 rounded-full ${
          isConnected ? 'bg-green-400' : 'bg-yellow-400'
        }`}
        animate={isConnected ? { scale: [1, 1.2, 1] } : { opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Status text */}
      <span>
        {isConnected ? 'Votes' : '⚠️ Connecting'} {voteCount > 0 && `(${voteCount})`}
      </span>
    </motion.div>
  );
}
