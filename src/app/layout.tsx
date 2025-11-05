"use client";

// app/layout.tsx
import type { Metadata } from 'next';
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
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

          {/* Modern Footer */}
          <footer className="bg-slate-800 border-t border-slate-700 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                {/* Footer Logo */}
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-600 p-2 rounded-lg">
                    <span className="text-lg">🏆</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Flex Tournaments</p>
                    <p className="text-xs text-gray-400">Powered by Next.js & Prisma</p>
                  </div>
                </div>

                {/* Footer Links */}
                <div className="flex items-center space-x-6 text-sm">
                  <Link href="/" className="text-gray-400 hover:text-indigo-400 transition-colors">
                    Accueil
                  </Link>
                  <Link href="/tournaments" className="text-gray-400 hover:text-indigo-400 transition-colors">
                    Tournois
                  </Link>
                  <Link href="/tournaments/create" className="text-gray-400 hover:text-indigo-400 transition-colors">
                    Créer
                  </Link>
                </div>

                {/* Copyright */}
                <div className="text-center md:text-right">
                  <p className="text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} <span className="text-indigo-400 font-semibold">Flex</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Tous droits réservés
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
