"use client";

// app/layout.tsx
import Link from 'next/link';
import { Providers } from '@/components/Providers';
import UserMenu from '@/components/UserMenu';

import '@/styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        {/* Primary Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <title>Flex Tournaments - Créez et gérez vos tournois interactifs en ligne</title>
        <meta name="title" content="Flex Tournaments - Créez et gérez vos tournois interactifs en ligne" />
        <meta name="description" content="Plateforme de création et gestion de tournois interactifs avec intégration Twitch. Organisez des compétitions engageantes avec votes en temps réel et suivi des participants." />
        <meta name="keywords" content="tournoi en ligne, tournoi interactif, tournoi Twitch, compétition en ligne, gestion de tournoi, votes en direct, streaming tournoi, esport, gaming tournament" />
        <meta name="author" content="Flex Tournaments" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="French" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flex-tournaments.com/" />
        <meta property="og:title" content="Flex Tournaments - Créez et gérez vos tournois interactifs en ligne" />
        <meta property="og:description" content="Plateforme de création et gestion de tournois interactifs avec intégration Twitch. Organisez des compétitions engageantes avec votes en temps réel." />
        <meta property="og:image" content="https://flex-tournaments.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="Flex Tournaments" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://flex-tournaments.com/" />
        <meta name="twitter:title" content="Flex Tournaments - Créez et gérez vos tournois interactifs en ligne" />
        <meta name="twitter:description" content="Plateforme de création et gestion de tournois interactifs avec intégration Twitch. Organisez des compétitions engageantes avec votes en temps réel." />
        <meta name="twitter:image" content="https://flex-tournaments.com/twitter-image.jpg" />
        <meta name="twitter:creator" content="@flextournaments" />
        
        {/* Additional SEO */}
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Flex Tournaments" />
        <meta name="application-name" content="Flex Tournaments" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://flex-tournaments.com/" />
        
        {/* Alternate Links */}
        <link rel="alternate" hrefLang="fr" href="https://flex-tournaments.com/" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Sitemap and Feeds */}
        <link rel="sitemap" href="/sitemap.xml" />
        
        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        
        {/* Structured Data - Organization */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Flex Tournaments",
            "description": "Plateforme de création et gestion de tournois interactifs avec intégration Twitch",
            "url": "https://flex-tournaments.com",
            "applicationCategory": "GameApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR"
            },
            "operatingSystem": "Web",
            "permissions": "browser"
          })
        }} />
      </head>
      <body className="bg-slate-900 text-gray-100 min-h-screen flex flex-col antialiased">
        <Providers>
          
          {/* Modern Navigation */}
          <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 shadow-lg">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-3 group">
                  <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-500 transition-colors">
                    <span className="text-xl">🏆</span>
                  </div>
                  <span className="text-xl font-bold text-white hidden sm:block">
                    Flex Tournaments
                  </span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <Link 
                    href="/" 
                    className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-700"
                  >
                    Accueil
                  </Link>
                  <Link 
                    href="/tournaments" 
                    className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-700"
                  >
                    Tournois
                  </Link>
                  <UserMenu />
                </div>
              </div>
            </nav>
          </header>

          {/* Main Content */}
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
            {children}
          </main>

          {/* Modern Premium Footer */}
          <footer className="bg-slate-900/80 border-t border-slate-700/50 backdrop-blur-sm mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
              {/* Top Section - Main Footer Content */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-700/50">
                {/* Brand Column */}
                <div className="col-span-1">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-indigo-600 rounded-lg blur-lg opacity-50"></div>
                      <div className="relative bg-indigo-600 p-2.5 rounded-lg">
                        <span className="text-xl">🏆</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-base font-black text-white">Flex</p>
                      <p className="text-xs text-gray-400">Tournaments</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Créez des tournois interactifs avec votes Twitch en temps réel.
                  </p>
                </div>

                {/* Navigation Column */}
                <div>
                  <h4 className="text-sm font-bold text-white mb-4">Navigation</h4>
                  <ul className="space-y-2.5">
                    <li>
                      <Link href="/" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm font-medium">
                        Accueil
                      </Link>
                    </li>
                    <li>
                      <Link href="/tournaments" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm font-medium">
                        Découvrir
                      </Link>
                    </li>
                    <li>
                      <Link href="/tournaments/create" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm font-medium">
                        Créer un Tournoi
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Ressources Column */}
                <div>
                  <h4 className="text-sm font-bold text-white mb-4">Ressources</h4>
                  <ul className="space-y-2.5">
                    <li>
                      <Link href="/documentation" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm font-medium">
                        Documentation
                      </Link>
                    </li>
                    <li>
                      <Link href="/support" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm font-medium">
                        Support
                      </Link>
                    </li>
                    <li>
                      <Link href="/status" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm font-medium">
                        Status
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Legal Column */}
                <div>
                  <h4 className="text-sm font-bold text-white mb-4">Légal</h4>
                  <ul className="space-y-2.5">
                    <li>
                      <Link href="/conditions" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm font-medium">
                        Conditions
                      </Link>
                    </li>
                    <li>
                      <Link href="/confidentialite" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm font-medium">
                        Confidentialité
                      </Link>
                    </li>
                    <li>
                      <Link href="/cookies" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm font-medium">
                        Cookies
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Section - Copyright & Attribution */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                <p>
                  &copy; {new Date().getFullYear()} <span className="text-indigo-400 font-bold">Flex Tournaments</span>. Tous droits réservés.
                </p>
                <div className="flex items-center gap-4">
                  <p className="text-xs">Fait avec <span className="text-red-400">❤</span> par Flex</p>
                </div>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
