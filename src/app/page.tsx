// app/page.tsx
import Link from 'next/link';
// Remplacement de Heroicons par react-icons
// Vous devrez peut-être ajuster les importations spécifiques en fonction des sets d'icônes que vous préférez.
// J'utilise ici Font Awesome (Fa) comme exemple principal.
import { FaChevronRight, FaCalendarAlt, FaUsers, FaTrophy } from 'react-icons/fa';
import { FaSprayCanSparkles } from 'react-icons/fa6';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section - COMPACT & STUNNING */}
      <header className="my-6 md:my-8 w-full relative">
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
        </div>

        <div className="group/hero bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border-2 border-indigo-500/20 hover:border-indigo-500/40 p-8 md:p-12 rounded-2xl relative overflow-hidden shadow-2xl transition-all duration-500">
          {/* Animated gradient orbs */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative z-10 text-center">
            {/* Compact Animated Trophy */}
            <div className="inline-flex items-center justify-center mb-6 animate-fadeIn">
              <div className="relative group/trophy">
                {/* Outer rotating ring */}
                <div className="absolute inset-0 -m-4">
                  <div className="w-full h-full border-2 border-indigo-500/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
                </div>
                
                {/* Multi-layer glow effects */}
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
                
                {/* Icon container with 3D effect */}
                <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 p-5 rounded-full shadow-2xl transform transition-all duration-500 group-hover/trophy:scale-110 group-hover/trophy:rotate-12">
                  <FaTrophy className="h-12 w-12 text-yellow-300 drop-shadow-2xl animate-bounce" style={{ animationDuration: '2s' }} />
                </div>
                
                {/* Orbiting sparkles */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-indigo-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>

            {/* Compact Title with gradient text effect */}
            <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-4 animate-fadeIn">
              <span className="inline-block text-white drop-shadow-2xl hover:scale-105 transition-transform duration-300 cursor-default">
                Flex
              </span>{' '}
              <span className="inline-block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl hover:scale-105 transition-transform duration-300 cursor-default animate-pulse" style={{ animationDuration: '3s' }}>
                Tournaments
              </span>
            </h1>

            {/* Compact badge/tagline */}
            <div className="relative inline-block mb-5 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-full"></div>
              <div className="relative bg-gradient-to-r from-indigo-600/80 via-purple-600/80 to-pink-600/80 px-5 py-2.5 rounded-full border-2 border-indigo-400/50 shadow-xl backdrop-blur-sm">
                <p className="text-base md:text-xl font-black text-white flex items-center gap-2">
                  <span className="animate-bounce text-lg" style={{ animationDuration: '1s' }}>🎉</span>
                  <span>Votre communauté décide. Vous célébrez.</span>
                  <span className="animate-bounce text-lg" style={{ animationDuration: '1s', animationDelay: '0.5s' }}>🏆</span>
                </p>
              </div>
            </div>

            {/* Compact Description */}
            <p className="mt-4 text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              Tournois{' '}
              <span className="relative inline-block">
                <span className="text-indigo-400 font-bold">INTERACTIFS</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-400 animate-pulse"></span>
              </span>
              {' '}avec votes Twitch en temps réel
            </p>

            {/* Compact CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
              <div className="relative">
                <Link
                  href="/tournaments/create"
                  className="group/btn relative inline-flex items-center justify-center px-8 py-4 text-lg font-black text-white rounded-xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-indigo-500/50"
                >
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Sliding shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Ripple effect on hover */}
                  <div className="absolute inset-0 rounded-xl border-4 border-white/50 scale-100 group-hover/btn:scale-110 opacity-0 group-hover/btn:opacity-100 transition-all duration-500"></div>
                  
                  <FaSprayCanSparkles className="relative h-5 w-5 mr-2.5 transition-transform duration-500 group-hover/btn:rotate-180 group-hover/btn:scale-110" />
                  <span className="relative">Créer un Tournoi</span>
                </Link>
                {/* NEW Badge outside the link to avoid overflow clipping */}
                <div className="absolute -right-1.5 -top-1.5 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-black text-slate-900 animate-bounce shadow-lg pointer-events-none p-4">
                  NEW
                </div>
              </div>
              
              <Link
                href="/tournaments"
                className="group/btn2 relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-slate-700/50 hover:bg-slate-600/50 rounded-xl border-2 border-indigo-500/30 hover:border-indigo-400 backdrop-blur-sm transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-indigo-500/30"
              >
                <span>Découvrir</span>
                <FaChevronRight className="h-5 w-5 ml-2.5 transition-all duration-500 group-hover/btn2:translate-x-2 group-hover/btn2:scale-110" />
                
                {/* Animated border glow */}
                <div className="absolute inset-0 rounded-xl border-2 border-indigo-400/0 group-hover/btn2:border-indigo-400/50 transition-all duration-500"></div>
              </Link>
            </div>

            {/* Compact Stats Cards with stagger animation */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="group/card relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 hover:from-indigo-900/50 hover:to-slate-900/80 p-6 rounded-xl border-2 border-slate-600/50 hover:border-indigo-400 backdrop-blur-sm transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-xl hover:shadow-indigo-500/30 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-indigo-500/0 group-hover/card:bg-indigo-500/10 rounded-xl blur-lg transition-all duration-500"></div>
                
                <div className="relative">
                  <div className="text-4xl font-black text-indigo-400 mb-2 group-hover/card:scale-110 group-hover/card:rotate-12 transition-all duration-500 inline-block">
                    ∞
                  </div>
                  <div className="absolute top-0 right-0 w-2 h-2 bg-indigo-400 rounded-full animate-ping opacity-0 group-hover/card:opacity-100"></div>
                </div>
                <p className="text-gray-200 font-semibold text-sm group-hover/card:text-white transition-colors">Tournois illimités</p>
              </div>

              <div className="group/card relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 hover:from-yellow-900/30 hover:to-slate-900/80 p-6 rounded-xl border-2 border-slate-600/50 hover:border-yellow-400 backdrop-blur-sm transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-xl hover:shadow-yellow-500/30 animate-fadeIn" style={{ animationDelay: '1s' }}>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-yellow-500/0 group-hover/card:bg-yellow-500/10 rounded-xl blur-lg transition-all duration-500"></div>
                
                <div className="relative">
                  <div className="text-4xl font-black text-yellow-400 mb-2 group-hover/card:scale-110 transition-all duration-500 inline-block animate-pulse">
                    ⚡
                  </div>
                  <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-0 group-hover/card:opacity-100"></div>
                </div>
                <p className="text-gray-200 font-semibold text-sm group-hover/card:text-white transition-colors">Votes en temps réel</p>
              </div>

              <div className="group/card relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 hover:from-purple-900/50 hover:to-slate-900/80 p-6 rounded-xl border-2 border-slate-600/50 hover:border-purple-400 backdrop-blur-sm transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-xl hover:shadow-purple-500/30 animate-fadeIn" style={{ animationDelay: '1.2s' }}>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-purple-500/0 group-hover/card:bg-purple-500/10 rounded-xl blur-lg transition-all duration-500"></div>
                
                <div className="relative">
                  <div className="text-4xl font-black text-purple-400 mb-2 group-hover/card:scale-110 group-hover/card:-rotate-12 transition-all duration-500 inline-block">
                    🎮
                  </div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-0 group-hover/card:opacity-100"></div>
                </div>
                <p className="text-gray-200 font-semibold text-sm group-hover/card:text-white transition-colors">Intégration Twitch</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* How It Works Section */}
      <section className="w-full max-w-6xl mx-auto py-16 md:py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Comment ça marche ?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Trois étapes simples pour créer une expérience inoubliable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="group card card-hover relative">
            <div className="card-body">
              <div className="inline-flex p-4 mb-6 bg-indigo-600/20 rounded-xl border border-indigo-600/30">
                <FaCalendarAlt className="h-12 w-12 text-indigo-400" />
              </div>
              <div className="absolute top-6 left-6 text-6xl font-black text-slate-800/50">01</div>
              <h3 className="text-2xl font-bold mb-4 relative z-10 text-white">Configurez</h3>
              <p className="text-gray-400 leading-relaxed relative z-10">
                Créez votre tournoi en quelques clics, ajoutez les participants et personnalisez l'expérience selon vos besoins.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="group card card-hover relative">
            <div className="card-body">
              <div className="inline-flex p-4 mb-6 bg-indigo-600/20 rounded-xl border border-indigo-600/30">
                <FaUsers className="h-12 w-12 text-indigo-400" />
              </div>
              <div className="absolute top-6 left-6 text-6xl font-black text-slate-800/50">02</div>
              <h3 className="text-2xl font-bold mb-4 relative z-10 text-white">Engagez</h3>
              <p className="text-gray-400 leading-relaxed relative z-10">
                Lancez les duels et laissez votre communauté voter en temps réel via le chat Twitch.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="group card card-hover relative">
            <div className="card-body">
              <div className="inline-flex p-4 mb-6 bg-indigo-600/20 rounded-xl border border-indigo-600/30">
                <FaTrophy className="h-12 w-12 text-yellow-400" />
              </div>
              <div className="absolute top-6 left-6 text-6xl font-black text-slate-800/50">03</div>
              <h3 className="text-2xl font-bold mb-4 relative z-10 text-white">Célébrez</h3>
              <p className="text-gray-400 leading-relaxed relative z-10">
                Suivez la progression en direct et découvrez le grand vainqueur choisi par votre communauté.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-20 mt-12">
        <div className="bg-slate-800 border border-slate-700 p-12 md:p-16 rounded-xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Prêt à lancer votre <span className="text-indigo-400">premier tournoi</span> ?
            </h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
              Rejoignez les streamers qui utilisent Flex Tournaments pour créer des moments inoubliables avec leur communauté.
            </p>
            <Link
              href="/tournaments/create"
              className="group inline-flex items-center justify-center px-12 py-6 text-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <FaSprayCanSparkles className="h-7 w-7 mr-3 transition-transform duration-300 group-hover:rotate-12" />
              <span>Commencer Maintenant</span>
            </Link>
          </div>
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
