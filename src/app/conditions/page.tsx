export const metadata = {
  title: 'Conditions d\'Utilisation - Flex Tournaments',
  description: 'Lisez nos conditions générales d\'utilisation et comprenez vos droits et responsabilités en tant qu\'utilisateur.',
  keywords: 'conditions, termes, TOS, légal, droits',
  openGraph: {
    title: 'Conditions d\'Utilisation - Flex Tournaments',
    description: 'Nos conditions générales d\'utilisation',
    url: 'https://flex-tournaments.com/conditions',
    type: 'website',
  },
  alternates: {
    canonical: 'https://flex-tournaments.com/conditions',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-white leading-tight">
            Conditions d'Utilisation
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Veuillez lire attentivement nos conditions avant d'utiliser Flex Tournaments.
          </p>
          <p className="text-gray-400 text-sm mt-4">Dernière mise à jour: 6 Janvier 2026</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full max-w-4xl mx-auto px-4 py-16 flex-grow">
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8">
            {/* Section 1 */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
              <h2 className="text-2xl font-black text-white mb-4">1. Acceptation des Conditions</h2>
              <p className="text-gray-300 leading-relaxed">
                En accédant et en utilisant Flex Tournaments, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le service.
              </p>
            </div>

            {/* Section 2 */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
              <h2 className="text-2xl font-black text-white mb-4">2. Utilisation du Service</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Vous acceptez d'utiliser Flex Tournaments uniquement à des fins légales et de manière qui ne viole les droits de personne ni ne restreint ou n'inhibe l'utilisation et la jouissance du service par quiconque.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Vous devez avoir au moins 13 ans pour utiliser ce service</li>
                <li>Vous êtes responsable de maintenir la confidentialité de votre compte</li>
                <li>Vous acceptez de ne pas utiliser le service de manière abusive</li>
                <li>Vous êtes responsable de toutes les activités sur votre compte</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
              <h2 className="text-2xl font-black text-white mb-4">3. Contenu Utilisateur</h2>
              <p className="text-gray-300 leading-relaxed">
                Vous conservez la propriété de tout contenu que vous créez. En utilisant notre service, vous nous accordez une licence pour utiliser, reproduire et distribuer ce contenu à des fins de fonctionnement du service.
              </p>
            </div>

            {/* Section 4 */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
              <h2 className="text-2xl font-black text-white mb-4">4. Limitations de Responsabilité</h2>
              <p className="text-gray-300 leading-relaxed">
                Flex Tournaments fournit le service "tel quel" sans garantie d'aucune sorte. Nous ne sommes pas responsables des dommages indirects, accidentels ou consécutifs résultant de l'utilisation du service.
              </p>
            </div>

            {/* Section 5 */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
              <h2 className="text-2xl font-black text-white mb-4">5. Résiliation</h2>
              <p className="text-gray-300 leading-relaxed">
                Flex Tournaments se réserve le droit de résilier ou de suspendre votre compte immédiatement, sans préavis ou responsabilité, si vous violez l'une quelconque des conditions d'utilisation.
              </p>
            </div>

            {/* Section 6 */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
              <h2 className="text-2xl font-black text-white mb-4">6. Modifications des Conditions</h2>
              <p className="text-gray-300 leading-relaxed">
                Nous pouvons modifier ces conditions à tout moment. Vous serez notifié des modifications importantes par email. L'utilisation continue du service implique votre acceptation des conditions modifiées.
              </p>
            </div>

            {/* Section 7 */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
              <h2 className="text-2xl font-black text-white mb-4">7. Droit Applicable</h2>
              <p className="text-gray-300 leading-relaxed">
                Ces conditions sont régies par les lois de la juridiction dans laquelle Flex Tournaments opère. Tout litige sera soumis à la juridiction exclusive des tribunaux de cette juridiction.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-indigo-900/30 border border-indigo-400/30 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-black text-white mb-3">Questions ?</h3>
              <p className="text-gray-300 mb-6">
                Si vous avez des questions concernant ces conditions, contactez-nous.
              </p>
              <a
                href="mailto:legal@flextournaments.com"
                className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
              >
                Nous Contacter
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
