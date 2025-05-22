// app/tournament/[id]/page.tsx
import {prisma} from '../../../lib/prisma'; // Ajustez le chemin si nécessaire
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaEdit, FaListUl, FaRocket, FaShareSquare, FaExclamationCircle } from 'react-icons/fa';
import { Metadata, ResolvingMetadata } from 'next';
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

// Générer les métadonnées dynamiquement
export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.id;
    const tournament = await getTournament(id).catch(() => null); // Gérer le cas où getTournament lance notFound

  if (!tournament) {
    return {
      title: 'Tournoi non trouvé',
    };
  }

  return {
    title: `${tournament.title} - Flex Tournaments`,
    description: tournament.description || `Détails et gestion du tournoi ${tournament.title}.`,
  };
}


export default async function TournamentPage({
  params,
}: {
  params: { id: string };
}) {
  const tournament = await getTournament(params.id);

  // Statut initial du tournoi (vous ajouterez un champ statut à votre modèle Tournament plus tard)
  // Pour l'instant, on simule : 'SETUP', 'PUBLISHED', 'ACTIVE', 'FINISHED'
  // @ts-ignore // TODO: Remove ts-ignore once 'status' is added to the Tournament model in Prisma
  const currentStatus = tournament.status || 'SETUP'; // Supposons un champ 'status' dans votre modèle Tournament

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-purple-400 break-words">
              {tournament.title}
            </h1>
            {tournament.description && (
              <p className="mt-2 text-lg text-gray-300 max-w-2xl">{tournament.description}</p>
            )}
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            {/* Bouton d'édition (à implémenter) */}
            <Link href={`/tournament/${tournament.id}/edit`} className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors">
              <FaEdit className="mr-2 h-4 w-4" /> Éditer
            </Link>
            {/* Statut actuel (à rendre plus dynamique) */}
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
              currentStatus === 'SETUP' ? 'bg-yellow-500/20 text-yellow-300' :
              currentStatus === 'LIVE' ? 'bg-green-500/20 text-green-300' :
              'bg-gray-500/20 text-gray-300'
            }`}>
              {currentStatus.toUpperCase()}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Créé le: {new Date(tournament.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale pour les items et actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section d'ajout d'items (si le tournoi est en phase de setup) */}
          {currentStatus === 'SETUP' && (
            <AddItemForm
              tournamentId={tournament.id}
              itemCount={tournament.Items.length}
            />
          )}
          
          {/* Liste des items */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-4 flex items-center">
              <FaListUl className="mr-3 text-purple-400" /> Participants ({tournament.Items.length})
            </h2>
            {tournament.Items.length > 0 ? (
               <TournamentItemsList items={tournament.Items} tournamentId={tournament.id} status={currentStatus} />
            ) : (
              <p className="text-gray-400 bg-gray-800 p-4 rounded-md">
                Aucun participant n'a encore été ajouté à ce tournoi.
                {currentStatus === 'SETUP' && " Utilisez le formulaire ci-dessus pour commencer."}
              </p>
            )}
          </section>
        </div>

        {/* Colonne latérale pour les actions du tournoi */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Section de Publication (si en setup et items > 1) */}
          {currentStatus === 'SETUP' && tournament.Items.length >= 2 && (
            <div className="p-6 bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-purple-400 mb-3 flex items-center">
                <FaShareSquare className="mr-2" /> Publier le Tournoi
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Une fois publié, vous ne pourrez plus ajouter ou supprimer des participants. Le tournoi sera prêt à être lancé.
              </p>
              <button
                // onClick={handlePublishTournament} // Logique de publication à implémenter
                className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors"
              >
                Publier Maintenant
              </button>
            </div>
          )}

          {/* Section de Lancement du Tournoi (si publié) */}
          {currentStatus === 'SETUP' && (
            <LaunchTournamentSection tournamentId={tournament.id} tournamentTitle={tournament.title} />
          )}
          
          {/* Si le tournoi est actif ou terminé, afficher un message ou des stats */}
          {(currentStatus === 'LIVE') && (
            <div className="p-6 bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-purple-400 mb-3 flex items-center">
                <FaRocket className="mr-2" /> Tournoi {currentStatus === 'LIVE' ? 'en Cours' : 'Terminé'}
              </h3>
              <p className="text-sm text-gray-400">
                {currentStatus === 'LIVE' ? "Le tournoi est actuellement en direct !" : "Ce tournoi est terminé."}
                {/* Ici, vous pourriez afficher le round actuel, le gagnant, etc. */}
              </p>
            </div>
          )}

          {/* Avertissement si pas assez d'items pour publier */}
           {currentStatus === 'SETUP' && tournament.Items.length < 2 && (
             <div className="p-4 bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 rounded-lg shadow-md flex items-start">
                <FaExclamationCircle className="h-5 w-5 mr-3 mt-0.5 text-yellow-400 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold">Participants Insuffisants</h4>
                    <p className="text-sm">
                        Vous devez ajouter au moins 2 participants avant de pouvoir publier et lancer le tournoi.
                    </p>
                </div>
            </div>
           )}
        </aside>
      </div>
    </div>
  );
}
