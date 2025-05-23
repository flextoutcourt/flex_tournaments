// app/layout.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import '@/styles/globals.css'; // Assurez-vous d'avoir ce fichier pour les styles globaux (ex: Tailwind)

export const metadata: Metadata = {
  title: 'Application de Tournoi Twitch',
  description: 'Créez et gérez des tournois interactifs avec des votes Twitch en temps réel.',
  icons: { // Optionnel: ajoutez un favicon
    icon: '/favicon.ico', // Assurez-vous que le fichier favicon.ico est dans votre dossier /public
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-gray-100 min-h-screen flex flex-col">
        <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-purple-400 hover:text-purple-300 transition-colors">
                  🏆 Flex Tournaments
                </Link>
              </div>
              <div className="flex items-center space-x-4 sm:space-x-6">
                <Link href="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Accueil
                </Link>
                <Link href="/tournaments" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Voir les Tournois
                </Link>
                {/* Vous pouvez ajouter d'autres liens ici, par exemple pour la création de tournoi si ce n'est pas sur l'accueil */}
                <Link href="/tournaments/create" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-md">
                  Nouveau Tournoi
                </Link>
              </div>
            </div>
          </nav>
        </header>

        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="bg-gray-100 text-center py-6 shadow-top">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Flex Tournaments par VotreNom. Tous droits réservés.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Propulsé par Next.js & Prisma
          </p>
        </footer>
      </body>
    </html>
  );
}
