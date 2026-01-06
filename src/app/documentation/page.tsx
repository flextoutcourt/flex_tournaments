import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export const metadata = {
  title: 'Documentation - Flex Tournaments',
  description: 'Guide complet pour bien commencer avec Flex Tournaments. Découvrez nos fonctionnalités, intégrations API et réponses aux questions fréquentes.',
  keywords: 'documentation, tutoriel, guide, API, intégration Twitch',
  openGraph: {
    title: 'Documentation - Flex Tournaments',
    description: 'Apprenez à utiliser Flex Tournaments avec notre guide complet',
    url: 'https://flex-tournaments.com/documentation',
    type: 'website',
  },
  alternates: {
    canonical: 'https://flex-tournaments.com/documentation',
  },
};

export default function DocumentationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-white leading-tight">
            Documentation
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Tout ce que vous devez savoir pour créer et gérer vos tournois interactifs.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full max-w-4xl mx-auto px-4 py-16 flex-grow">
        <div className="space-y-12">
          {/* Getting Started */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-4xl">🚀</div>
              <div>
                <h2 className="text-3xl font-black text-white mb-2">Démarrage Rapide</h2>
                <p className="text-gray-400">
                  Commencez à créer vos premiers tournois en quelques minutes avec notre guide d'introduction.
                </p>
              </div>
            </div>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-indigo-400">→</span> Créez un compte en quelques clics
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-400">→</span> Connectez votre compte Twitch
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-400">→</span> Lancez votre premier tournoi
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-4xl">⚡</div>
              <div>
                <h2 className="text-3xl font-black text-white mb-2">Fonctionnalités Principales</h2>
                <p className="text-gray-400">
                  Découvrez les outils puissants mis à votre disposition pour créer des expériences inoubliables.
                </p>
              </div>
            </div>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-purple-400">→</span> Votes en temps réel via Twitch Chat
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">→</span> Gestion de participants illimitée
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">→</span> Animations et visuels personnalisables
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">→</span> Historique et statistiques détaillées
              </li>
            </ul>
          </div>

          {/* API */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-4xl">💻</div>
              <div>
                <h2 className="text-3xl font-black text-white mb-2">Intégration API</h2>
                <p className="text-gray-400">
                  Intégrez Flex Tournaments directement dans votre plateforme avec notre API REST complète.
                </p>
              </div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto mb-4">
              <code>
                POST /api/tournaments/create<br />
                GET /api/tournaments/[id]<br />
                POST /api/tournaments/[id]/vote
              </code>
            </div>
            <p className="text-gray-400">
              Consultez la <span className="text-indigo-400 font-semibold">documentation API complète</span> pour plus de détails.
            </p>
          </div>

          {/* FAQ */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-4xl">❓</div>
              <div>
                <h2 className="text-3xl font-black text-white mb-2">Questions Fréquemment Posées</h2>
                <p className="text-gray-400">
                  Trouvez les réponses aux questions les plus courantes.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <details className="cursor-pointer">
                <summary className="text-white font-semibold py-3 hover:text-indigo-400 transition-colors">
                  Combien de tournois puis-je créer ?
                </summary>
                <p className="text-gray-400 py-3 pl-4 border-l-2 border-indigo-400/50">
                  Vous pouvez créer un nombre illimité de tournois. Il n'y a aucune restriction.
                </p>
              </details>
              <details className="cursor-pointer">
                <summary className="text-white font-semibold py-3 hover:text-indigo-400 transition-colors">
                  Comment intégrer Twitch Chat ?
                </summary>
                <p className="text-gray-400 py-3 pl-4 border-l-2 border-indigo-400/50">
                  L'intégration Twitch Chat se fait automatiquement lors de la création d'un tournoi. Connectez simplement votre compte Twitch.
                </p>
              </details>
              <details className="cursor-pointer">
                <summary className="text-white font-semibold py-3 hover:text-indigo-400 transition-colors">
                  Puis-je exporter les résultats ?
                </summary>
                <p className="text-gray-400 py-3 pl-4 border-l-2 border-indigo-400/50">
                  Oui, vous pouvez exporter les résultats au format CSV ou JSON depuis votre tableau de bord.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 border-t border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-white mb-4">Besoin d'aide supplémentaire ?</h2>
          <p className="text-gray-400 mb-8">
            Notre équipe de support est disponible pour vous aider.
          </p>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
          >
            Contacter le Support
            <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
