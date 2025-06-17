import { motion } from "framer-motion";

interface VoteBarProps {
  votedUsers: React.MutableRefObject<Set<any>>;
  number: number;
}

const VoteBar: React.FC<VoteBarProps> = ({ votedUsers, number }) => {
  const totalVotes = votedUsers.current?.size || 0;
  const votesForItem = Array.from(votedUsers.current || []).filter(
    (vote) => vote.votedItem === `item${number}`
  ).length;
  const percent = totalVotes > 0 ? Math.round((votesForItem / totalVotes) * 100) : 0;

  if (percent === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0 }}
      className="relative h-6 bg-gray-200 rounded overflow-hidden mb-4"
    >
      <motion.div
        className="absolute left-0 top-0 h-full bg-indigo-500 text-white text-center text-md origin-left"
        initial={{ width: "0%", scale: 1, boxShadow: "none" }}
        animate={{
          width: `${percent}%`,
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
        {percent}%
      </motion.div>
    </motion.div>
  );
};

export default VoteBar;
