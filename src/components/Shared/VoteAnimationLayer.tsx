import React from 'react';
import { motion } from 'framer-motion';
import { VoteToken } from '@/hooks/useVoteAnimation';

interface VoteAnimationLayerProps {
  activeTokens: VoteToken[];
  getTargetPosition: (itemId: 'item1' | 'item2') => { x: number; y: number; width: number; height: number } | null;
  animationDuration: number;
  originX: number;
  originY: number;
}

/**
 * VoteAnimationLayer renders floating animated vote tokens
 * that fly from the origin point to their target vote bars.
 */
const VoteAnimationLayer: React.FC<VoteAnimationLayerProps> = ({
  activeTokens,
  getTargetPosition,
  animationDuration,
  originX,
  originY,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-visible">
      {activeTokens.map((token) => {
        const targetPos = getTargetPosition(token.itemId);
        if (!targetPos) {
          console.log(`[VoteAnimationLayer] No target position for ${token.itemId}`);
          return null;
        }

        console.log(`[VoteAnimationLayer] Rendering token ${token.id} to position:`, targetPos);

        // Adjust origin based on which item is being voted for
        const startX = token.itemId === 'item1' ? originX : window.innerWidth - originX - 64;
        const startY = originY;
        
        // Color based on item
        const colors = {
          item1: 'from-blue-400 to-cyan-500',
          item2: 'from-red-400 to-orange-500',
        };
        const bgColor = colors[token.itemId];

        return (
          <>
            {/* Main orb that fades when hitting target */}
            <motion.div
              key={token.id}
              initial={{
                x: startX,
                y: startY,
                scale: 0.3,
                opacity: 1,
              }}
              animate={{
                x: targetPos.x - 32, // Center the token
                y: targetPos.y - 32,
                scale: 1,
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: animationDuration / 1000,
                ease: 'easeOut',
              }}
              className="fixed w-16 h-16 flex items-center justify-center drop-shadow-lg filter brightness-110"
            >
              {/* Visual orb/sphere */}
              <motion.div
                animate={{
                  opacity: [1, 1, 0],
                  scale: [1, 1, 0],
                }}
                transition={{
                  duration: 0.6,
                  times: [0, 0.3, 1],
                  ease: 'easeOut',
                  delay: (animationDuration / 1000) * 0.88,
                }}
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${bgColor} shadow-2xl relative overflow-hidden`}
              >
                {/* Inner glow */}
                <div className="absolute inset-0 rounded-full bg-white opacity-30" />
                {/* Highlight */}
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white opacity-50 blur-sm" />
              </motion.div>
            </motion.div>

            {/* 32 explosion pieces with randomized speed and distance */}
            {Array.from({ length: 32 }, (_, i) => ({
              id: `explode-${token.id}-${i}`,
              angle: (i / 32) * Math.PI * 2,
              distance: 80 + Math.random() * 120, // Random distance between 80-200px
              duration: 0.5 + Math.random() * 0.4, // Random duration between 0.5-0.9s
            })).map((piece) => {
              const px = targetPos.x + Math.cos(piece.angle) * piece.distance;
              const py = targetPos.y + Math.sin(piece.angle) * piece.distance;

              return (
                <motion.div
                  key={piece.id}
                  initial={{
                    x: targetPos.x - 8,
                    y: targetPos.y - 8,
                    scale: 1,
                    opacity: 0,
                  }}
                  animate={{
                    x: px,
                    y: py,
                    scale: 0,
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: piece.duration,
                    times: [0, 0.2, 1],
                    ease: 'easeOut',
                    delay: (animationDuration / 1000) * 0.88,
                  }}
                  className={`fixed w-3 h-3 rounded-full bg-gradient-to-br ${bgColor} shadow-lg pointer-events-none`}
                />
              );
            })}
          </>
        );
      })}
    </div>
  );
};

export default VoteAnimationLayer;
