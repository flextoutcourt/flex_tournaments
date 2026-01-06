import Link from 'next/link';

export const metadata = {
  title: 'Support - Flex Tournaments',
  description: 'Besoin d\'aide ? Contactez notre équipe de support par email ou Discord. Consultez notre aide et FAQ pour résoudre rapidement vos problèmes.',
  keywords: 'support, aide, contact, FAQ, assistance client',
  openGraph: {
    title: 'Support - Flex Tournaments',
    description: 'Contactez notre équipe de support pour une aide rapide',
    url: 'https://flex-tournaments.com/support',
    type: 'website',
  },
  alternates: {
    canonical: 'https://flex-tournaments.com/support',
  },
};

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-white leading-tight">
            Support & Aide
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Nous sommes là pour vous aider. Contactez-nous via le canal de votre choix.
          </p>
        </div>
      </section>

      {/* Support Channels */}
      <section className="w-full max-w-4xl mx-auto px-4 py-16 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Email */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center hover:border-indigo-400/50 transition-all duration-300 hover:scale-105">
            <div className="text-5xl mb-4 flex justify-center">📧</div>
            <h3 className="text-2xl font-black text-white mb-3">Email</h3>
            <p className="text-gray-400 mb-6">
              Envoyez-nous un email pour tout question ou problème.
            </p>
            <a
              href="mailto:support@flextournaments.com"
              className="inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all duration-300"
            >
              Envoyer un Email
            </a>
          </div>

          {/* Discord */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
            <div className="text-5xl mb-4 flex justify-center">💬</div>
            <h3 className="text-2xl font-black text-white mb-3">Discord</h3>
            <p className="text-gray-400 mb-6">
              Rejoignez notre serveur Discord pour discuter en direct.
            </p>
            <a
              href="#"
              className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all duration-300"
            >
              Rejoindre Discord
            </a>
          </div>

          {/* Documentation */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
            <div className="text-5xl mb-4 flex justify-center">📚</div>
            <h3 className="text-2xl font-black text-white mb-3">Documentation</h3>
            <p className="text-gray-400 mb-6">
              Consultez notre documentation complète et détaillée.
            </p>
            <Link
              href="/documentation"
              className="inline-block px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-all duration-300"
            >
              Lire la Documentation
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 md:p-10">
          <h2 className="text-3xl font-black text-white mb-8">Questions Fréquentes</h2>
          <div className="space-y-4">
            <details className="cursor-pointer">
              <summary className="text-white font-semibold py-3 hover:text-indigo-400 transition-colors">
                Quel est le temps de réponse du support ?
              </summary>
              <p className="text-gray-400 py-3 pl-4 border-l-2 border-indigo-400/50">
                Nous répondons généralement dans les 24 heures. Pour les problèmes critiques, contactez-nous sur Discord.
              </p>
            </details>
            <details className="cursor-pointer">
              <summary className="text-white font-semibold py-3 hover:text-indigo-400 transition-colors">
                Comment signaler un bug ?
              </summary>
              <p className="text-gray-400 py-3 pl-4 border-l-2 border-indigo-400/50">
                Signalez les bugs directement sur Discord ou par email avec une description détaillée du problème.
              </p>
            </details>
            <details className="cursor-pointer">
              <summary className="text-white font-semibold py-3 hover:text-indigo-400 transition-colors">
                Pouvez-vous personnaliser mon tournoi ?
              </summary>
              <p className="text-gray-400 py-3 pl-4 border-l-2 border-indigo-400/50">
                Absolument ! Contactez notre équipe pour discuter de la personnalisation de votre tournoi.
              </p>
            </details>
            <details className="cursor-pointer">
              <summary className="text-white font-semibold py-3 hover:text-indigo-400 transition-colors">
                Comment me former à l'utilisation de Flex Tournaments ?
              </summary>
              <p className="text-gray-400 py-3 pl-4 border-l-2 border-indigo-400/50">
                Nous proposons des tutoriels vidéo et des webinaires gratuits. Rejoignez notre Discord pour connaître les prochaines sessions.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
