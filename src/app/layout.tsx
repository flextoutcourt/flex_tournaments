"use client";

// app/layout.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { NeatConfig, NeatGradient } from "@firecms/neat";
import { useEffect, useRef } from 'react';

import '@/styles/globals.css';

// Define your config
const config = {
  colors: [
      {
          color: '#554226',
          enabled: true,
      },
      {
          color: '#03162D',
          enabled: true,
      },
      {
          color: '#002027',
          enabled: true,
      },
      {
          color: '#020210',
          enabled: true,
      },
      {
          color: '#02152A',
          enabled: true,
      },
  ],
  speed: 2,
  horizontalPressure: 3,
  verticalPressure: 5,
  waveFrequencyX: 1,
  waveFrequencyY: 3,
  waveAmplitude: 8,
  shadows: 0,
  highlights: 2,
  colorBrightness: 1,
  colorSaturation: 6,
  wireframe: false,
  colorBlending: 7,
  backgroundColor: '#003FFF',
  backgroundAlpha: 1,
  grainScale: 2,
  grainSparsity: 0,
  grainIntensity: 0.175,
  grainSpeed: 1,
  resolution: 1,
  yOffset: 0,
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const gradientRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // La logique d'initialisation reste la même
    if (gradientRef.current) {
      const neat = new NeatGradient({
        ref: gradientRef.current,
        ...config
      });
      
      // C'est une bonne pratique de retourner une fonction de nettoyage
      return () => neat.destroy();
    }
  }, []);

  return (
    <html lang="fr">
      <body className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-gray-100 min-h-screen flex flex-col">
        <canvas id="neat-gradient-canvas" ref={gradientRef}></canvas>
        <header className="bg-gray-800/75 backdrop-blur-md shadow-lg sticky top-2 mx-4 rounded-xl z-50">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-purple-400 hover:text-purple-300 transition-colors">
                  🏆 Flex Tournaments
                </Link>
              </div>
              <div className="flex items-center space-x-4 sm:space-x-6">
                <Link href="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Home
                </Link>
                <Link href="/tournaments" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  See tournaments
                </Link>
                {/* Vous pouvez ajouter d'autres liens ici, par exemple pour la création de tournoi si ce n'est pas sur l'accueil */}
                <Link href="/tournaments/create" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-md">
                  New tournament
                </Link>
              </div>
            </div>
          </nav>
        </header>

        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="bg-gray-900/75 backdrop-blur-md p-6 text-center shadow-lg mb-4 mx-4 rounded-xl z-50">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Flex Tournaments by <strong className="text-purple-400">Flex</strong>. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Powered by Next.js & Prisma
          </p>
        </footer>
      </body>
    </html>
  );
}
