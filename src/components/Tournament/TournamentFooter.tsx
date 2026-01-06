// components/Tournament/TournamentFooter.tsx
'use client';

import React from 'react';
import { FaTwitch, FaExternalLinkAlt } from 'react-icons/fa';

export default function TournamentFooter() {
  return (
    <footer className="mt-12 pt-8 border-t-2 border-slate-700/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg font-bold text-gray-100 mb-6 flex items-center gap-2">
          <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
          Informations Légales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Twitch Terms */}
          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30 hover:border-slate-600/60 transition-colors">
            <h3 className="font-bold text-gray-200 mb-2 flex items-center gap-2">
              <FaTwitch className="text-purple-400" />
              Utilisation de Twitch
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              En utilisant cette fonctionnalité, vous vous engagez à respecter les{' '}
              <a 
                href="https://www.twitch.tv/p/fr-fr/legal/terms-of-service/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline font-semibold transition-colors inline-flex items-center gap-1"
              >
                Conditions de Service de Twitch
                <FaExternalLinkAlt className="h-3 w-3" />
              </a>
              {' '}et les{' '}
              <a 
                href="https://www.twitch.tv/p/fr-fr/legal/community-guidelines/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline font-semibold transition-colors inline-flex items-center gap-1"
              >
                Règles de la Communauté Twitch
                <FaExternalLinkAlt className="h-3 w-3" />
              </a>
              . Vous devez avoir l'autorisation du propriétaire de la chaîne pour utiliser son chat.
            </p>
          </div>
          
          {/* Local Storage */}
          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30 hover:border-slate-600/60 transition-colors">
            <h3 className="font-bold text-gray-200 mb-2">📦 Stockage Local</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Les données du tournoi sont stockées localement dans votre navigateur. Nous ne collectons ni ne transmettons vos données personnelles à des serveurs tiers. Vous êtes responsable de la sauvegarde de vos données.
            </p>
          </div>
          
          {/* Responsibility */}
          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30 hover:border-slate-600/60 transition-colors">
            <h3 className="font-bold text-gray-200 mb-2">⚖️ Responsabilité</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Ce service est fourni "tel quel" sans garantie d'aucune sorte. L'utilisateur est seul responsable de l'utilisation qu'il fait de cet outil et des interactions sur Twitch. Nous déclinons toute responsabilité en cas de bannissement, suspension ou toute action prise par Twitch ou d'autres plateformes.
            </p>
          </div>
          
          {/* YouTube Content */}
          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30 hover:border-slate-600/60 transition-colors">
            <h3 className="font-bold text-gray-200 mb-2">🎥 Contenu YouTube</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              L'utilisation de vidéos YouTube doit respecter les{' '}
              <a 
                href="https://www.youtube.com/t/terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline font-semibold transition-colors inline-flex items-center gap-1"
              >
                Conditions d'Utilisation de YouTube
                <FaExternalLinkAlt className="h-3 w-3" />
              </a>
              {' '}et le droit d'auteur. Assurez-vous d'avoir les droits nécessaires pour utiliser les contenus dans vos tournois.
            </p>
          </div>
          
          {/* Data Protection */}
          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30 hover:border-slate-600/60 transition-colors md:col-span-2">
            <h3 className="font-bold text-gray-200 mb-2">🔒 Protection des Données</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Conformément au RGPD, vous conservez le contrôle total de vos données. Vous pouvez à tout moment supprimer vos tournois et les données associées. Les noms d'utilisateur Twitch collectés via le chat sont traités conformément aux politiques de Twitch.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
