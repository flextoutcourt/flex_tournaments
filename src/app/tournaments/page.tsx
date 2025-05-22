// app/tournaments/page.tsx
import Link from 'next/link';
import {prisma} from '@/lib/prisma'; // Assurez-vous que le chemin est correct
import { FaListAlt, FaPlus, FaEye } from 'react-icons/fa';
import { Metadata } from 'next';

// Interface pour les données de chaque tournoi dans la liste
interface TournamentListItem {
  id: string;
  title: string; // Changé de name à title
  description?: string | null;
  createdAt: Date;
  // Vous pourriez ajouter un champ status ici si vous l'avez dans votre modèle
  _count?: {
    Items: number; // Assurez-vous que le nom de la relation est correct (Items avec 'I' majuscule)
  };
}

// Fonction pour récupérer les données côté serveur
async function getTournaments(): Promise<TournamentListItem[]> {
  const tournamentsData = await prisma.tournament.findMany({
    select: {
      id: true,
      title: true, // Changé de name à title
      description: true,
      createdAt: true,
      _count: {
        select: { Items: true }, // Compter les items associés
      },
      // Ajoutez 'status: true' si vous avez un champ status
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  // Pas besoin de JSON.parse(JSON.stringify(tournamentsData)) ici
  // car les dates seront gérées correctement par Next.js dans les Server Components.
  return tournamentsData;
}

export const metadata: Metadata = {
  title: 'Liste des Tournois - Flex Tournaments',
  description: 'Parcourez tous les tournois créés sur Flex Tournaments.',
};

export default async function TournamentsPage() {
  let tournaments: TournamentListItem[] = [];
  let error: string | null = null;

  try {
    tournaments = await getTournaments();
  } catch (e: any) {
    console.error("Erreur lors de la récupération des tournois:", e);
    error = "Impossible de charger la liste des tournois. Veuillez réessayer plus tard.";
  }

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
          <p>{error}</p>
        </div>
      )}

      {!error && tournaments.length === 0 && (
        <div className="text-center py-10 bg-gray-800 rounded-lg shadow">
          <p className="text-xl text-gray-400 mb-4">Aucun tournoi trouvé pour le moment.</p>
          <p className="text-gray-500">Soyez le premier à en créer un !</p>
        </div>
      )}

      {!error && tournaments.length > 0 && (
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
                  {/* Afficher le statut si disponible */}
                  {/* <p>Statut: <span className="font-semibold">{tournament.status || 'N/A'}</span></p> */}
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
