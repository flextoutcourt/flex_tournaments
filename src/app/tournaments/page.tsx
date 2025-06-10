// app/tournaments/page.tsx
'use client';

import Link from 'next/link';
import { FaListAlt, FaPlus, FaEye } from 'react-icons/fa';
import { Metadata } from 'next';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';

// Interface pour les données de chaque tournoi dans la liste
interface TournamentListItem {
  id: string;
  title: string;
  description?: string | null;
  createdAt: Date;
  _count?: {
    Items: number;
  };
}

export default function TournamentsPage() {
  const { data: tournaments, error, isLoading } = useSWR<TournamentListItem[]>('/api/tournaments', fetcher);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-4xl font-extrabold text-purple-400 flex items-center">
          <FaListAlt className="mr-3" />
          Liste des Tournois
        </h1>
        <Link
          href="/tournaments/create"
          className="inline-flex items-center px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <FaPlus className="mr-2" /> Créer un Nouveau Tournoi
        </Link>
      </header>

      {error && (
        <div className="bg-red-500/10 text-red-300 border border-red-500/30 p-4 rounded-md mb-6">
          <p>Impossible de charger la liste des tournois. Veuillez réessayer plus tard.</p>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Chargement des tournois...</p>
        </div>
      )}

      {!isLoading && !error && (!tournaments || tournaments.length === 0) && (
        <div className="text-center py-10 bg-gray-800 rounded-lg shadow">
          <p className="text-xl text-gray-400 mb-4">Aucun tournoi trouvé pour le moment.</p>
          <p className="text-gray-500">Soyez le premier à en créer un !</p>
        </div>
      )}

      {!isLoading && !error && tournaments && tournaments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="bg-gray-800 rounded-xl shadow-xl overflow-hidden flex flex-col hover:shadow-purple-500/30 transition-all duration-300 ease-in-out">
              <div className="p-6 flex-grow">
                <h2 className="text-2xl font-bold text-purple-300 mb-2 truncate" title={tournament.title}>
                  {tournament.title}
                </h2>
                {tournament.description && (
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2" title={tournament.description}>
                    {tournament.description}
                  </p>
                )}
                <div className="text-xs text-gray-500 mb-4">
                  <p>Créé le: {new Date(tournament.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  <p>Participants: {tournament._count?.Items ?? 0}</p>
                </div>
              </div>
              <div className="p-6 bg-gray-700/50 border-t border-gray-700">
                <Link
                  href={`/tournaments/${tournament.id}`}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <FaEye className="mr-2" /> Voir les Détails
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
