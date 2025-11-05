// app/tournament/[id]/page.tsx
import {prisma} from '../../../lib/prisma'; // Ajustez le chemin si nécessaire
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaEdit, FaListUl, FaRocket, FaShareSquare, FaExclamationCircle, FaTrophy, FaUsers, FaClock, FaLock } from 'react-icons/fa';
import { auth } from '@/lib/auth';
import AddItemForm from '@/components/Forms/Tournament/AddItemForm';
import TournamentItemsList from '@/components/Tournament/TournamentItemsList';
import LaunchTournamentSection from '@/components/Tournament/LaunchTournamentSection';

// Fonction pour récupérer les données du tournoi
async function getTournament(id: string) {
  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      Items: { // Selon votre schéma, le nom de la relation est 'Items' (avec un I majuscule)
        orderBy: {
          createdAt: 'asc', // Ou 'name' si vous préférez
        },
      },
    },
  });

  if (!tournament) {
    notFound(); // Déclenche une page 404 si le tournoi n'est pas trouvé
  }
  return tournament;
}

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const {id} = await params;
  const tournament = await getTournament(id);
  const session = await auth();

  // TODO: Add status field to Tournament model
  const currentStatus: 'SETUP' | 'LIVE' | 'FINISHED' = 'SETUP';
  const isAuthenticated = !!session;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto p-4 md:p-8 relative z-10">
        {/* Hero Header Section */}
        <header className="mb-8 md:mb-12 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-800/80 via-slate-800/80 to-slate-900/80 border-2 border-indigo-500/20 hover:border-indigo-500/40 p-6 md:p-10 rounded-2xl backdrop-blur-sm shadow-2xl transition-all duration-500 relative overflow-hidden group">
            {/* Animated gradient orbs */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl group-hover:bg-indigo-600/30 transition-all duration-700"></div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl group-hover:bg-purple-600/30 transition-all duration-700"></div>
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Trophy icon with glow */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-2xl">
                        <FaTrophy className="h-8 w-8 text-yellow-300 drop-shadow-2xl" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-3 break-words">
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                          {tournament.title}
                        </span>
                      </h1>
                      {tournament.description && (
                        <p className="text-base md:text-lg text-gray-300 max-w-3xl leading-relaxed">{tournament.description}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Meta information */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                      <FaClock className="text-indigo-400" />
                      <span>Créé le {new Date(tournament.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                      <FaUsers className="text-purple-400" />
                      <span>{tournament.Items.length} participant{tournament.Items.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex flex-wrap gap-3">
                  <Link 
                    href={`/tournaments/${tournament.id}/edit`} 
                    className="group/btn relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-600"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                    <FaEdit className="mr-2 h-4 w-4 relative z-10" />
                    <span className="relative z-10">Éditer</span>
                  </Link>
                  
                  {/* Status badge */}
                  <div className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold shadow-lg backdrop-blur-sm ${
                    currentStatus === 'SETUP' ? 'bg-yellow-500/20 text-yellow-300 border-2 border-yellow-500/50' :
                    currentStatus === 'LIVE' ? 'bg-green-500/20 text-green-300 border-2 border-green-500/50 animate-pulse' :
                    'bg-gray-500/20 text-gray-300 border-2 border-gray-500/50'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      currentStatus === 'SETUP' ? 'bg-yellow-400' :
                      currentStatus === 'LIVE' ? 'bg-green-400 animate-pulse' :
                      'bg-gray-400'
                    }`}></div>
                    {currentStatus.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          {/* Main Column - Items and Actions */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Add Item Form Section - Only for authenticated users */}
            {currentStatus === 'SETUP' && (
              <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                {isAuthenticated ? (
                  <AddItemForm
                    tournamentId={tournament.id}
                    itemCount={tournament.Items.length}
                    twoCategoryMode={tournament.mode === 'TWO_CATEGORY'}
                    categories={tournament.mode === 'TWO_CATEGORY' ? [tournament.categoryA ?? '', tournament.categoryB ?? ''].filter(Boolean) : null}
                  />
                ) : (
                  <div className="bg-gradient-to-br from-slate-800/50 via-slate-800/50 to-slate-900/50 border-2 border-yellow-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500 rounded-full blur-md opacity-30"></div>
                        <div className="relative bg-gradient-to-br from-yellow-600/20 to-orange-600/20 p-4 rounded-full">
                          <FaLock className="h-8 w-8 text-yellow-400" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          Connexion Requise
                        </h3>
                        <p className="text-gray-400 mb-4 max-w-md">
                          Vous devez être connecté pour ajouter des participants au tournoi. Connectez-vous pour contribuer !
                        </p>
                        <Link
                          href={`/auth/signin?callbackUrl=/tournaments/${tournament.id}`}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          <FaLock className="h-4 w-4" />
                          Se Connecter
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Participants List Section */}
            <section className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <div className="bg-gradient-to-br from-slate-800/50 via-slate-800/50 to-slate-900/50 border-2 border-purple-500/20 hover:border-purple-500/40 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl transition-all duration-500 relative overflow-hidden group">
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
                    <span className="text-lg font-normal text-gray-400">({tournament.Items.length})</span>
                  </h2>
                  
                  {tournament.Items.length > 0 ? (
                    <TournamentItemsList items={tournament.Items} tournamentId={tournament.id} status={currentStatus} />
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-full mb-4">
                        <FaUsers className="h-10 w-10 text-purple-400" />
                      </div>
                      <p className="text-gray-300 text-lg font-medium mb-2">
                        Aucun participant pour le moment
                      </p>
                      <p className="text-gray-400 text-sm">
                        {currentStatus === 'SETUP' && "Utilisez le formulaire ci-dessus pour ajouter vos premiers participants."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Column - Tournament Actions */}
          <aside className="lg:col-span-1 space-y-6 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
            {/* Publish Section */}
            {currentStatus === 'SETUP' && tournament.Items.length >= 2 && (
              <div className="bg-gradient-to-br from-slate-800/80 via-slate-800/80 to-slate-900/80 border-2 border-blue-500/30 hover:border-blue-500/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl transition-all duration-500 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-all duration-700"></div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <FaShareSquare className="text-blue-400" />
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Publier le Tournoi
                    </span>
                  </h3>
                  <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                    Une fois publié, vous ne pourrez plus ajouter ou supprimer des participants. Le tournoi sera prêt à être lancé.
                  </p>
                  <button
                    className="group/btn relative w-full inline-flex items-center justify-center px-5 py-3 text-sm font-bold text-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                    <span className="relative z-10">Publier Maintenant</span>
                  </button>
                </div>
              </div>
            )}

            {/* Launch Tournament Section */}
            {currentStatus === 'SETUP' && (
              <LaunchTournamentSection 
                tournamentId={tournament.id} 
                tournamentTitle={tournament.title} 
                tournamentMode={tournament.mode} 
                tournamentCategories={tournament.mode === 'TWO_CATEGORY' ? [tournament.categoryA ?? '', tournament.categoryB ?? ''].filter(Boolean) : null} 
              />
            )}
            
            {/* Live Tournament Status - Commented out until status field is added to model */}
            {false && (
              <div className="bg-gradient-to-br from-slate-800/80 via-slate-800/80 to-slate-900/80 border-2 border-green-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-600/10 rounded-full blur-2xl animate-pulse"></div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <FaRocket className="text-green-400 animate-bounce" />
                    <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      Tournoi {currentStatus === 'LIVE' ? 'en Cours' : 'Terminé'}
                    </span>
                  </h3>
                  <p className="text-sm text-gray-400">
                    {currentStatus === 'LIVE' ? "Le tournoi est actuellement en direct !" : "Ce tournoi est terminé."}
                  </p>
                </div>
              </div>
            )}

            {/* Warning - Not Enough Participants */}
            {currentStatus === 'SETUP' && tournament.Items.length < 2 && (
              <div className="bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-orange-500/10 text-yellow-300 border-2 border-yellow-500/30 rounded-2xl p-5 backdrop-blur-sm shadow-xl flex items-start gap-4 animate-pulse" style={{ animationDuration: '2s' }}>
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-yellow-500 rounded-full blur-md opacity-50"></div>
                  <div className="relative bg-yellow-500/20 p-3 rounded-full">
                    <FaExclamationCircle className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Participants Insuffisants</h4>
                  <p className="text-sm text-yellow-200/80 leading-relaxed">
                    Vous devez ajouter au moins 2 participants avant de pouvoir publier et lancer le tournoi.
                  </p>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
