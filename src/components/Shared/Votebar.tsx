import React from "react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface VoteBarProps {
  votedUsers: React.MutableRefObject<Set<any>>;
  number: number;
  item1Score: number;
  item2Score: number;
  registerBarRef?: (itemId: 'item1' | 'item2', ref: React.RefObject<HTMLDivElement>) => void;
}

const VoteBar: React.FC<VoteBarProps> = ({ votedUsers: _votedUsers, number, item1Score, item2Score, registerBarRef }) => {
  const barRef = useRef<HTMLDivElement>(null);
  const itemId = (`item${number}` as 'item1' | 'item2');

  // Register this bar ref when component mounts or when registerBarRef changes
  useEffect(() => {
    if (registerBarRef) {
	//@ts-expect-error registerBarRef expects barRef but it's being passed correctly at runtime
      registerBarRef(itemId, barRef);
    }
  }, [registerBarRef, itemId]);

  // Calculate percent based on displayed scores
  const totalScore = item1Score + item2Score;
  const currentScore = number === 1 ? item1Score : item2Score;
  const percentDecimal = totalScore > 0 ? (currentScore / totalScore) * 100 : 0;
  const percentRounded = Math.round(percentDecimal * 100) / 100; // 2 decimal places

  return (
    <motion.div
      ref={barRef}
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0 }}
      className="relative h-6 bg-gray-200 rounded overflow-hidden mb-4"
    >
      <motion.div
        className="absolute left-0 top-0 h-full bg-indigo-500 text-white text-center text-md origin-left"
        initial={{ width: "0%", scale: 1, boxShadow: "none" }}
        animate={{
          width: `${percentDecimal}%`,
          scale: [1, 1.05, 1],
          boxShadow: [
            "0 0 8px 2px rgba(99, 102, 241, 0.7)",
            "0 0 12px 4px rgba(99, 102, 241, 0.9)",
            "0 0 8px 2px rgba(99, 102, 241, 0.7)",
          ],
        }}
        transition={{
          width: { duration: 0.5, ease: "easeOut" },
          scale: { duration: 0.6, ease: "easeInOut" },
          boxShadow: { duration: 0.6, ease: "easeInOut" },
        }}
      >
        {percentRounded.toFixed(2)}%
      </motion.div>
    </motion.div>
  );
};

export default React.memo(VoteBar);
