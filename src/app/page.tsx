// app/page.tsx
import Link from 'next/link';
// Remplacement de Heroicons par react-icons
// Vous devrez peut-être ajuster les importations spécifiques en fonction des sets d'icônes que vous préférez.
// J'utilise ici Font Awesome (Fa) comme exemple principal.
import { FaChevronRight, FaCalendarAlt, FaUsers, FaTrophy } from 'react-icons/fa';
import { FaSprayCanSparkles } from 'react-icons/fa6';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <header className="my-12 md:my-16">
        <div className="inline-block p-3 mb-6 bg-purple-500/20 rounded-full">
            {/* Icône de trophée avec React-Icons */}
            <FaTrophy className="h-12 w-12 text-purple-400" />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Bienvenue sur <span className="text-purple-400">Flex Tournaments</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          La plateforme ultime pour organiser des tournois épiques et laisser votre communauté Twitch décider des vainqueurs en temps réel !
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/tournaments/create"
            className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-xl hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {/* Icône Sparkles avec React-Icons */}
            <FaSprayCanSparkles className="h-6 w-6 mr-3 transition-transform duration-500 group-hover:rotate-12" />
            Créer un Tournoi
          </Link>
          <Link
            href="/tournaments"
            className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-purple-300 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 hover:text-purple-200 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Voir les Tournois Actifs
            {/* Icône ChevronRight avec React-Icons */}
            <FaChevronRight className="h-6 w-6 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </header>

      <section className="w-full max-w-5xl mx-auto py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Comment ça marche ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-6 bg-gray-800 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-shadow duration-300">
            <div className="p-3 mb-4 bg-purple-500/20 rounded-full">
              {/* Icône Calendar avec React-Icons */}
              <FaCalendarAlt className="h-10 w-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Configurez</h3>
            <p className="text-gray-400 text-sm text-center">
              Définissez votre tournoi, ajoutez les participants (musiques, jeux, etc.) et connectez votre chaîne Twitch.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 bg-gray-800 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-shadow duration-300">
            <div className="p-3 mb-4 bg-purple-500/20 rounded-full">
              {/* Icône Users avec React-Icons */}
              <FaUsers className="h-10 w-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Engagez</h3>
            <p className="text-gray-400 text-sm text-center">
              Lancez les rounds 1v1. Votre chat Twitch vote en direct pour ses favoris en utilisant des mots-clés.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 bg-gray-800 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-shadow duration-300">
            <div className="p-3 mb-4 bg-purple-500/20 rounded-full">
              {/* Icône Trophy avec React-Icons */}
              <FaTrophy className="h-10 w-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Célébrez</h3>
            <p className="text-gray-400 text-sm text-center">
              Suivez la progression, découvrez les gagnants de chaque round et couronnez le champion ultime !
            </p>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-16 bg-gray-800/50 rounded-t-xl mt-12">
         <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à lancer votre premier tournoi ?</h2>
            <p className="text-gray-400 mb-8">
                N'attendez plus pour créer une expérience interactive unique pour votre communauté.
            </p>
            <Link
                href="/tournaments/create"
                className="group inline-flex items-center justify-center px-10 py-5 text-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
                {/* Icône Sparkles avec React-Icons */}
                <FaSprayCanSparkles className="h-7 w-7 mr-3 transition-transform duration-500 group-hover:rotate-12" />
                Commencer Maintenant
            </Link>
         </div>
      </section>
    </div>
  );
}

// Optionnel: Ajouter des métadonnées spécifiques à cette page
// import type { Metadata } from 'next'
// export const metadata: Metadata = {
//   title: 'Accueil - Flex Tournaments',
//   description: 'Créez et gérez des tournois Twitch interactifs.',
// }
