// components/Tournament/ParticipantsSection.tsx
'use client';

import { FaListUl, FaUsers } from 'react-icons/fa';
import { Item } from '@prisma/client';
import TournamentItemsList from './TournamentItemsList';
import { useMouseHalo } from '@/hooks/useMouseHalo';

interface ParticipantsSectionProps {
  items: Item[];
  tournamentId: string;
  status: string;
  twoCategoryMode: boolean;
  categories: string[] | null;
}

export default function ParticipantsSection({
  items,
  tournamentId,
  status,
  twoCategoryMode,
  categories,
}: ParticipantsSectionProps) {
  const cardRef = useMouseHalo('rgba(168, 85, 247, 0.13)');

  return (
    <section className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
      <div
        ref={cardRef}
        className="bg-gradient-to-br from-slate-800/50 via-slate-800/50 to-slate-900/50 border-2 border-purple-500/20 hover:border-purple-500/40 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl transition-all duration-500 relative overflow-hidden group"
      >
        {/* Mouse Halo Effect */}
        <div className="halo-effect absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-75 pointer-events-none"></div>

        {/* Background effects */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition-all duration-700"></div>

        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-lg blur-md opacity-50"></div>
              <div className="relative bg-gradient-to-br from-purple-600 to-indigo-600 p-3 rounded-lg">
                <FaListUl className="text-white" />
              </div>
            </div>
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Participants
            </span>
            <span className="text-lg font-normal text-gray-400">({items.length})</span>
          </h2>

          {items.length > 0 ? (
            <TournamentItemsList
              items={items}
              tournamentId={tournamentId}
              status={status}
              twoCategoryMode={twoCategoryMode}
              categories={categories}
            />
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-full mb-4">
                <FaUsers className="h-10 w-10 text-purple-400" />
              </div>
              <p className="text-gray-300 text-lg font-medium mb-2">Aucun participant pour le moment</p>
              <p className="text-gray-500 text-sm">Connectez-vous et ajoutez des participants à votre tournoi</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
