// app/tournaments/page.tsx
'use client';

import Link from 'next/link';
import { FaListAlt, FaPlus, FaEye } from 'react-icons/fa';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';

// Interface pour les données de chaque tournoi dans la liste
interface TournamentListItem {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  mode: string;
  categoryA?: string | null;
  categoryB?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TournamentsResponse {
  data: TournamentListItem[];
}

export default function TournamentsPage() {
  const { data: response, error, isLoading } = useSWR<TournamentsResponse>('/api/tournaments', fetcher);
  const tournaments = response?.data;

  return (
    <div className="page-container">
      {/* Header */}
      <header className="mb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                <FaListAlt className="text-white text-xl" />
              </div>
              <h1 className="text-5xl font-black text-white">
                Tournois
              </h1>
            </div>
            <p className="text-gray-400 text-lg ml-15">Découvrez et rejoignez les tournois de la communauté</p>
          </div>
          <Link
            href="/tournaments/create"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-lg hover:shadow-indigo-500/50"
          >
            <FaPlus className="mr-2 text-lg" />
            <span>Créer un Tournoi</span>
          </Link>
        </div>
      </header>

      {/* Error State */}
      {error && (
        <div className="alert alert-error mb-8 flex items-start">
          <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold">Erreur de chargement</p>
            <p className="text-sm opacity-90">Impossible de charger la liste des tournois. Veuillez réessayer plus tard.</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-20">
          <div className="loading-spinner w-16 h-16 mx-auto mb-6"></div>
          <p className="text-xl text-gray-400">Chargement des tournois...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && (!tournaments || tournaments.length === 0) && (
        <div className="flex items-center justify-center py-20">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 max-w-2xl mx-auto p-16 rounded-2xl shadow-2xl">
            <div className="text-center">
              <div className="inline-flex p-8 mb-8 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-3xl border-2 border-indigo-600/30">
                <FaListAlt className="h-20 w-20 text-indigo-400" />
              </div>
              <h2 className="text-4xl font-black mb-4 text-white">Aucun tournoi pour le moment</h2>
              <p className="text-gray-300 mb-10 text-lg leading-relaxed">
                Soyez le premier à créer un tournoi épique<br />et engagez votre communauté !
              </p>
              <Link
                href="/tournaments/create"
                className="inline-flex items-center px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-xl hover:shadow-indigo-500/50 text-lg"
              >
                <FaPlus className="mr-3 text-xl" />
                Créer le Premier Tournoi
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tournaments Grid */}
      {!isLoading && !error && tournaments && tournaments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament, index) => (
            <div 
              key={tournament.id} 
              className="group relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 hover:border-indigo-500 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border-2 ${
                  tournament.status === 'SETUP' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
                  tournament.status === 'IN_PROGRESS' ? 'bg-green-500/20 text-green-300 border-green-500/40' :
                  tournament.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                  'bg-gray-500/20 text-gray-300 border-gray-500/40'
                }`}>
                  {tournament.status === 'SETUP' ? '⚙️ Config' :
                   tournament.status === 'IN_PROGRESS' ? '🔴 Live' :
                   tournament.status === 'COMPLETED' ? '✓ Terminé' : tournament.status}
                </span>
              </div>

              <div className="p-8 flex flex-col h-full">
                {/* Tournament Icon & Title */}
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-xl mb-4 shadow-lg">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <h2 className="text-2xl font-black text-white mb-2 group-hover:text-indigo-300 transition-colors" title={tournament.title}>
                    {tournament.title}
                  </h2>
                  {tournament.description && (
                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed" title={tournament.description}>
                      {tournament.description}
                    </p>
                  )}
                </div>

                {/* Tournament Details */}
                <div className="flex-grow mb-6 space-y-3">
                  {/* Mode */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                      <FaListAlt className="text-indigo-400 text-xs" />
                    </div>
                    <span className="text-gray-300 font-medium">
                      {tournament.mode === 'TWO_CATEGORY' ? 'Mode deux catégories' : 'Mode standard'}
                    </span>
                  </div>

                  {/* Categories */}
                  {tournament.mode === 'TWO_CATEGORY' && tournament.categoryA && tournament.categoryB && (
                    <div className="flex items-center gap-2 bg-indigo-600/10 border border-indigo-600/30 rounded-lg px-4 py-2.5">
                      <span className="text-indigo-300 font-bold text-sm">{tournament.categoryA}</span>
                      <span className="text-gray-500 font-black">VS</span>
                      <span className="text-purple-300 font-bold text-sm">{tournament.categoryB}</span>
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>
                      Créé le {new Date(tournament.createdAt).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={`/tournaments/${tournament.id}`}
                  className="w-full inline-flex items-center justify-center px-6 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-lg group-hover:shadow-indigo-500/50"
                >
                  <FaEye className="mr-2 text-lg" />
                  <span>Accéder au Tournoi</span>
                </Link>
              </div>

              {/* Decorative corner element */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-tl-full pointer-events-none"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
