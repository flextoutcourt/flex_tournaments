export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-white leading-tight">
            Politique sur les Cookies
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Comprenez comment nous utilisons les cookies pour améliorer votre expérience.
          </p>
          <p className="text-gray-400 text-sm mt-4">Dernière mise à jour: 6 Janvier 2026</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full max-w-4xl mx-auto px-4 py-16 flex-grow">
        <div className="space-y-8">
          {/* Section 1 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-white mb-4">1. Qu'est-ce qu'un Cookie ?</h2>
            <p className="text-gray-300 leading-relaxed">
              Un cookie est un petit fichier texte stocké sur votre appareil qui contient des informations sur votre navigation. Les cookies nous aident à vous offrir une meilleure expérience en mémorisant vos préférences et en analyser votre utilisation du service.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-white mb-4">2. Types de Cookies Que Nous Utilisons</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-indigo-400 mb-2">Cookies Essentiels</h3>
                <p className="text-gray-300">
                  Nécessaires pour le fonctionnement du site (authentification, sécurité).
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-purple-400 mb-2">Cookies de Performance</h3>
                <p className="text-gray-300">
                  Nous aident à analyser comment vous utilisez Flex Tournaments pour améliorer le service.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-yellow-400 mb-2">Cookies de Fonctionnalité</h3>
                <p className="text-gray-300">
                  Mémorisent vos préférences et personnalisent votre expérience.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-pink-400 mb-2">Cookies de Marketing</h3>
                <p className="text-gray-300">
                  Utilisés pour vous montrer du contenu pertinent (avec votre consentement).
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-white mb-4">3. Cookies Tiers</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Nous utilisons les services de tiers qui peuvent placer des cookies sur votre appareil:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><strong>Google Analytics:</strong> Pour analyser le trafic du site</li>
              <li><strong>Twitch:</strong> Pour l'intégration et l'authentification</li>
              <li><strong>Hotjar:</strong> Pour améliorer l'expérience utilisateur</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-white mb-4">4. Durée de Stockage</h2>
            <p className="text-gray-300 leading-relaxed">
              La plupart de nos cookies expirent après 1 an. Certains cookies essentiels sont conservés jusqu'à la suppression de votre compte. Vous pouvez supprimer vos cookies à tout moment via les paramètres de votre navigateur.
            </p>
          </div>

          {/* Section 5 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-white mb-4">5. Votre Consentement</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              En utilisant Flex Tournaments, vous consentez à l'utilisation de cookies conformément à cette politique. Vous pouvez:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Configurer votre navigateur pour refuser les cookies</li>
              <li>Supprimer les cookies existants</li>
              <li>Retirer votre consentement à tout moment</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-white mb-4">6. Gestion des Cookies</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Pour gérer vos cookies, veuillez consulter les paramètres de confidentialité de votre navigateur:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Internet Explorer'].map((browser) => (
                <div key={browser} className="bg-slate-900/50 p-3 rounded-lg text-center">
                  <p className="text-gray-300 text-sm font-semibold">{browser}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-white mb-4">7. Modifications de cette Politique</h2>
            <p className="text-gray-300 leading-relaxed">
              Nous pouvons mettre à jour cette politique de temps en temps. Nous vous notifierons des changements importants par email ou via le site.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-white mb-4">8. Nous Contacter</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Si vous avez des questions concernant nos cookies, contactez-nous:
            </p>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p className="text-gray-300">
                <span className="font-semibold text-white">Email:</span> cookies@flextournaments.com
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-indigo-900/30 border border-indigo-400/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-black text-white mb-3">Gérer Vos Préférences de Cookies</h3>
            <p className="text-gray-300 mb-6">
              Vous pouvez gérer vos préférences de cookies à tout moment via votre compte.
            </p>
            <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105">
              Gérer les Préférences
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
