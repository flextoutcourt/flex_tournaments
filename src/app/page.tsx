// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaChevronRight, FaCalendarAlt, FaUsers, FaTrophy } from 'react-icons/fa';
import { FaSprayCanSparkles } from 'react-icons/fa6';
import { useMouseHalo } from '@/hooks/useMouseHalo';
import { AdSense } from '@/components/AdSense';

interface Stats {
  tournaments: number;
  votes: string;
  support: string;
}

export default function HomePage() {
  const heroRef = useMouseHalo('rgba(99, 102, 241, 0.15)');
  const [stats, setStats] = useState<Stats>({
    tournaments: 1000,
    votes: 'N/A',
    support: '24/7'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section - MODERN & CLEAN */}
      <header className="my-6 md:my-8 w-full relative">
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
        </div>

        <div ref={heroRef} className="bg-slate-800/70 border-2 border-slate-700/60 hover:border-slate-700 p-8 md:p-12 rounded-2xl relative overflow-hidden shadow-2xl transition-all duration-500 backdrop-blur-sm">
          {/* Halo Effect */}
          <div className="halo-effect absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-75 pointer-events-none"></div>
          
          {/* Animated particles */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
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
                <div className="relative bg-indigo-600 p-5 rounded-full shadow-2xl transform transition-all duration-500 group-hover/trophy:scale-110 group-hover/trophy:rotate-12">
                  <FaTrophy className="h-12 w-12 text-yellow-300 drop-shadow-2xl animate-bounce" style={{ animationDuration: '2s' }} />
                </div>
                
                {/* Orbiting sparkles */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-indigo-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>

            {/* Compact Title */}
            <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-4 animate-fadeIn">
              <span className="inline-block text-white drop-shadow-2xl hover:scale-105 transition-transform duration-300 cursor-default">
                Flex
              </span>{' '}
              <span className="inline-block text-indigo-400 drop-shadow-2xl hover:scale-105 transition-transform duration-300 cursor-default">
                Tournaments
              </span>
            </h1>

            {/* Compact badge/tagline */}
            <div className="relative inline-block mb-5 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-full"></div>
              <div className="relative bg-slate-700/60 px-5 py-2.5 rounded-full border-2 border-slate-600/50 shadow-xl backdrop-blur-sm">
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
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-5 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
              {/* Primary Button */}
              <Link
                href="/tournaments/create"
                className="px-10 py-4 text-lg font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Créer un Tournoi
              </Link>

              {/* Secondary Button */}
              <Link
                href="/tournaments"
                className="px-10 py-4 text-lg font-bold text-white bg-slate-700 hover:bg-slate-600 rounded-lg border-2 border-slate-600 hover:border-indigo-400 shadow-lg transition-all duration-300 hover:scale-105"
              >
                Découvrir
              </Link>
            </div>

            {/* Compact Stats Cards with stagger animation */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="group/card relative bg-slate-700/40 hover:bg-slate-700/60 p-6 rounded-xl border-2 border-slate-600/30 hover:border-indigo-400/50 backdrop-blur-sm transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-indigo-500/20 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
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

              <div className="group/card relative bg-slate-700/40 hover:bg-slate-700/60 p-6 rounded-xl border-2 border-slate-600/30 hover:border-yellow-400/50 backdrop-blur-sm transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-yellow-500/20 animate-fadeIn" style={{ animationDelay: '1s' }}>
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

              <div className="group/card relative bg-slate-700/40 hover:bg-slate-700/60 p-6 rounded-xl border-2 border-slate-600/30 hover:border-purple-400/50 backdrop-blur-sm transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-purple-500/20 animate-fadeIn" style={{ animationDelay: '1.2s' }}>
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

      {/* CTA Section - MINIMAL & POWERFUL */}
      <section className="w-full py-20 md:py-28 mt-16">
        <div className="max-w-5xl mx-auto px-4">
          {/* Minimal Hero CTA */}
          <div className="relative">
            {/* Soft glow background */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/20 to-purple-600/10 rounded-3xl blur-3xl"></div>
            
            <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-16 md:p-20 rounded-3xl">
              {/* Accent line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full"></div>

              <div className="text-center">
                {/* Eyebrow */}
                <p className="text-indigo-300 font-semibold text-sm mb-4 tracking-widest uppercase">Commencez dès maintenant</p>

                {/* Main Headline */}
                <h2 className="text-6xl md:text-7xl font-black mb-6 text-white leading-tight">
                  Créez un tournoi<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">en 30 secondes</span>
                </h2>

                {/* Subheading */}
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
                  Pas de setup compliqué. Pas de configurations. Lancez simplement votre tournoi et laissez votre communauté voter en direct.
                </p>

                {/* Single Powerful CTA */}
                <Link
                  href="/tournaments/create"
                  className="group relative inline-flex items-center justify-center px-12 py-6 text-2xl font-black text-white"
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 group-hover:blur-2xl"></div>
                  
                  {/* Button content */}
                  <div className="relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 shadow-2xl">
                    <FaSprayCanSparkles className="h-7 w-7 transition-transform duration-300 group-hover:rotate-180 group-hover:scale-125" />
                    <span>Lancer un Tournoi</span>
                    <FaChevronRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </Link>

                {/* Quick Stats */}
                <div className="mt-16 pt-12 border-t border-slate-700/50 grid grid-cols-3 gap-8">
                  <div className="group cursor-default">
                    <p className="text-4xl font-black text-indigo-400 mb-2 group-hover:scale-110 transition-transform relative inline-block">
                      {stats.tournaments}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap border border-indigo-400/30 shadow-lg">
                        A vous de faire monter les chiffres
                      </div>
                    </p>
                    <p className="text-gray-400 font-semibold text-sm">Tournois actifs</p>
                  </div>
                  <div className="group cursor-default">
                    <p className="text-4xl font-black text-purple-400 mb-2 group-hover:scale-110 transition-transform relative inline-block">
                      {stats.votes}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-purple-300 text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap border border-purple-400/30 shadow-lg">
                        J'ai pas fait les comptes encore
                      </div>
                    </p>
                    <p className="text-gray-400 font-semibold text-sm">Votes</p>
                  </div>
                  <div className="group cursor-default">
                    <p className="text-4xl font-black text-pink-400 mb-2 group-hover:scale-110 transition-transform relative inline-block">
                      {stats.support}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-pink-300 text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap border border-pink-400/30 shadow-lg">
                        Seulement quand flex dors pas (😴)
                      </div>
                    </p>
                    <p className="text-gray-400 font-semibold text-sm">Support en direct</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Google AdSense Banner */}
        <AdSense className="my-12" />
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
