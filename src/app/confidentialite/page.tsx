export const metadata = {
  title: 'Politique de Confidentialité - Flex Tournaments',
  description: 'Découvrez comment nous collectons, utilisons et protégeons vos données personnelles.',
  keywords: 'confidentialité, privacy, RGPD, données personnelles, protection',
  openGraph: {
    title: 'Politique de Confidentialité - Flex Tournaments',
    description: 'Notre politique de confidentialité et protection des données',
    url: 'https://flex-tournaments.com/confidentialite',
    type: 'website',
  },
  alternates: {
    canonical: 'https://flex-tournaments.com/confidentialite',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-white leading-tight">
            Politique de Confidentialité
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Votre confidentialité est importante pour nous. Découvrez comment nous collectons et utilisons vos données.
          </p>
          <p className="text-gray-400 text-sm mt-4">Dernière mise à jour: 6 Janvier 2026</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full max-w-4xl mx-auto px-4 py-16 flex-grow">
        <div className="space-y-8">
          {/* Section 1 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-white mb-4">1. Informations que Nous Collectons</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Nous collectons les types d'informations suivants:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Informations de compte (nom, email, mot de passe)</li>
              <li>Informations de profil (photo, biographie, préférences)</li>
              <li>Données de tournoi (participants, votes, résultats)</li>
              <li>Données d'utilisation (pages visitées, actions effectuées, IP)</li>
              <li>Informations Twitch (si vous liez votre compte)</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-white mb-4">2. Comment Nous Utilisons Vos Données</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Vos données nous aident à:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Fournir et améliorer le service</li>
              <li>Personnaliser votre expérience</li>
              <li>Communiquer avec vous (mises à jour, support)</li>
              <li>Analyser l'utilisation du service</li>
              <li>Prévenir la fraude et les abus</li>
              <li>Respecter les obligations légales</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-white mb-4">3. Partage de Vos Données</h2>
            <p className="text-gray-300 leading-relaxed">
              Nous ne vendons jamais vos données à des tiers. Nous pouvons partager vos données avec:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mt-4">
              <li>Nos prestataires de services (hébergement, paiement)</li>
              <li>Les autorités si requis par la loi</li>
              <li>Avec votre consentement explicite</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-white mb-4">4. Sécurité des Données</h2>
            <p className="text-gray-300 leading-relaxed">
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données contre l'accès non autorisé, la modification ou la destruction. Cependant, aucune méthode de transmission sur Internet n'est 100% sécurisée.
            </p>
          </div>

          {/* Section 5 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-white mb-4">5. Vos Droits</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Vous avez le droit de:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Accéder à vos données personnelles</li>
              <li>Corriger vos données si elles sont inexactes</li>
              <li>Demander la suppression de vos données</li>
              <li>Retirer votre consentement à tout moment</li>
              <li>Demander une copie de vos données</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-white mb-4">6. Durée de Conservation</h2>
            <p className="text-gray-300 leading-relaxed">
              Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir le service. Vous pouvez demander la suppression à tout moment via votre compte.
            </p>
          </div>

          {/* Section 7 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-white mb-4">7. Modifications de cette Politique</h2>
            <p className="text-gray-300 leading-relaxed">
              Nous pouvons modifier cette politique à tout moment. Les modifications importantes seront notifiées par email. L'utilisation continue implique votre acceptation.
            </p>
          </div>

          {/* Section 8 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-white mb-4">8. Nous Contacter</h2>
            <p className="text-gray-300 leading-relaxed">
              Pour toute question concernant votre confidentialité, contactez-nous à:
            </p>
            <div className="mt-4 p-4 bg-slate-900/50 rounded-lg">
              <p className="text-gray-300">
                <span className="font-semibold text-white">Email:</span> privacy@flextournaments.com
              </p>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-purple-900/30 border border-purple-400/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-black text-white mb-3">Préoccupations Relatives à la Confidentialité ?</h3>
            <p className="text-gray-300 mb-6">
              Nous prenons votre vie privée au sérieux. Contactez-nous immédiatement.
            </p>
            <a
              href="mailto:privacy@flextournaments.com"
              className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
            >
              Envoyer une Plainte
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
