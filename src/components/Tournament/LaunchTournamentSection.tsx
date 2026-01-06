// components/LaunchTournamentSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FaRocket, FaTwitch, FaExclamationTriangle, FaSpinner, FaExternalLinkAlt, FaUsers } from 'react-icons/fa';
// tmi.js n'est plus initialisé ici, mais sur la nouvelle page "live"

// Interface pour un item (correspondant à ce que l'API retourne)
interface FetchedItem {
  id: string;
  name: string;
  youtubeUrl?: string | null;
  // Ajoutez d'autres champs si votre API les retourne et qu'ils sont utiles
}

interface LaunchTournamentSectionProps {
  tournamentId: string;
  tournamentTitle: string;
  tournamentMode?: string | null;
  tournamentCategories?: string[] | null;
  // La prop 'items' a été retirée, les items seront fetchés
}

export default function LaunchTournamentSection({ tournamentId, tournamentTitle, tournamentMode = 'STANDARD', tournamentCategories = null }: LaunchTournamentSectionProps) {
  const [twitchChannel, setTwitchChannel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Pour l'état du bouton
  
  const [fetchedItems, setFetchedItems] = useState<FetchedItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [fetchItemsError, setFetchItemsError] = useState<string | null>(null);
  const [hasSavedState, setHasSavedState] = useState(false);

  // Check for saved tournament state
  useEffect(() => {
    if (tournamentId) {
      try {
        const savedState = localStorage.getItem(`tournamentState_${tournamentId}`);
        if (savedState) {
          const state = JSON.parse(savedState);
          if (state.isTournamentActive && state.matches && state.matches.length > 0) {
            setHasSavedState(true);
            // Try to get the saved twitch channel from sessionStorage
            const sessionData = sessionStorage.getItem(`tournamentData_${tournamentId}`);
            if (sessionData) {
              // Extract channel from URL or stored data if available
              // For now, we'll just show the resume button without pre-filling the channel
            }
          }
        }
      } catch (error) {
        console.error('Error checking saved state:', error);
      }
    }
  }, [tournamentId]);

  useEffect(() => {
    if (tournamentId) {
      const fetchItems = async () => {
        setIsLoadingItems(true);
        setFetchItemsError(null);
        try {
          const response = await fetch(`/api/tournaments/${tournamentId}/items`);
          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Impossible de récupérer les participants.");
          }
          const itemsData: FetchedItem[] = await response.json();
          setFetchedItems(itemsData);
        } catch (err: any) {
          setFetchItemsError(err.message);
          console.error("Erreur fetchItems:", err);
        } finally {
          setIsLoadingItems(false);
        }
      };
      fetchItems();
    }
  }, [tournamentId]);


  const handleOpenLivePage = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!twitchChannel.trim()) {
      setError("Le nom du canal Twitch est requis.");
      setIsSubmitting(false);
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(twitchChannel.trim())) {
      setError("Le nom du canal Twitch ne doit contenir que des lettres, chiffres et underscores (_).");
      setIsSubmitting(false);
      return;
    }
    if (fetchedItems.length < 2) {
        setError("Il faut au moins 2 participants pour lancer le tournoi.");
        setIsSubmitting(false);
        return;
    }

    console.log(`Préparation du lancement du tournoi "${tournamentTitle}" pour la chaîne Twitch: ${twitchChannel} dans une nouvelle page.`);
    
    // Clear any existing tournament state when starting a new tournament
    try {
      localStorage.removeItem(`tournamentState_${tournamentId}`);
    } catch (error) {
      console.error('Error clearing old tournament state:', error);
    }
    
    // Stocker les données nécessaires pour la page live dans sessionStorage
    // car fetchedItems peut être une grande liste.
    try {
      sessionStorage.setItem(`tournamentData_${tournamentId}`, JSON.stringify({
        items: fetchedItems,
        title: tournamentTitle,
        mode: tournamentMode ?? 'STANDARD',
        categories: tournamentCategories ?? null,
      }));
    } catch (storageError) {
      console.error("Erreur lors de l'écriture dans sessionStorage:", storageError);
      setError("Impossible de préparer les données pour la page live. Vérifiez les permissions de stockage.");
      setIsSubmitting(false);
      return;
    }

    // Ouvrir la nouvelle page. Le nom du canal est passé en query param.
    const livePageUrl = `/tournaments/${tournamentId}/live?channel=${encodeURIComponent(twitchChannel.trim())}`;
    window.open(livePageUrl, '_blank'); // Ouvre dans un nouvel onglet

    // Reset the saved state flag
    setHasSavedState(false);
    
    // Réinitialiser ou afficher un message de succès ici si nécessaire
    // setTwitchChannel(''); // Optionnel: vider le champ
    setError("La page du tournoi en direct a été ouverte dans un nouvel onglet !"); // Message de confirmation
    setIsSubmitting(false);
  };


  if (isLoadingItems) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg shadow-md mt-6 text-center">
        <FaSpinner className="animate-spin h-8 w-8 text-purple-400 mx-auto mb-3" />
        <p className="text-gray-300">Chargement des participants...</p>
      </div>
    );
  }

  if (fetchItemsError) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg shadow-md mt-6 text-red-300">
        <FaExclamationTriangle className="inline-block mr-2 mb-0.5" />
        Erreur lors du chargement des participants: {fetchItemsError}
      </div>
    );
  }

  // Le composant n'affiche plus l'état "lancé" lui-même,
  // il se contente d'ouvrir la nouvelle page.
  return (
    <div className="bg-gradient-to-br from-slate-800/80 via-slate-800/80 to-slate-900/80 border-2 border-green-500/30 hover:border-green-500/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl transition-all duration-500 relative overflow-hidden group">
      {/* Background effects */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-600/10 rounded-full blur-2xl group-hover:bg-green-600/20 transition-all duration-700"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl group-hover:bg-emerald-600/20 transition-all duration-700"></div>
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          <FaRocket className="text-green-400" />
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Lancer le Tournoi
          </span>
        </h3>
        <p className="text-sm text-gray-300 mb-4 leading-relaxed">
          Entrez le nom de votre chaîne Twitch. Le tournoi s'ouvrira dans une nouvelle page pour la gestion en direct.
        </p>
        <div className="flex items-center gap-2 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/30 mb-4">
          <FaUsers className="text-green-400" />
          <p className="text-sm text-green-300 font-semibold">{fetchedItems.length} participant{fetchedItems.length > 1 ? 's' : ''} chargé{fetchedItems.length > 1 ? 's' : ''}</p>
        </div>

        {/* Show resume button if there's a saved state */}
        {hasSavedState && (
          <div className="mb-5 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-xl backdrop-blur-sm animate-pulse" style={{ animationDuration: '2s' }}>
            <p className="text-yellow-300 text-sm mb-3 flex items-center gap-2 font-semibold">
              <FaExclamationTriangle className="text-yellow-400" />
              Un tournoi en cours a été détecté !
            </p>
            <button
              type="button"
              onClick={() => {
                const livePageUrl = `/tournaments/${tournamentId}/live`;
                window.open(livePageUrl, '_blank');
              }}
              className="group/btn relative w-full inline-flex items-center justify-center px-5 py-3 text-sm font-bold text-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center gap-2">
                <FaRocket /> Reprendre le Tournoi
              </div>
            </button>
          </div>
        )}

        {error && (
          <div className={`mb-5 p-4 rounded-xl flex items-start gap-3 text-sm backdrop-blur-sm border-2 ${error.includes("nouvel onglet") ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/50' : 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border-red-500/50'}`}>
            <div className="relative flex-shrink-0">
              <div className={`absolute inset-0 ${error.includes("nouvel onglet") ? 'bg-green-500' : 'bg-red-500'} rounded-full blur-md opacity-50`}></div>
              <div className={`relative ${error.includes("nouvel onglet") ? 'bg-green-500/20' : 'bg-red-500/20'} p-2 rounded-full`}>
                {error.includes("nouvel onglet") ? 
                  <FaExternalLinkAlt className="h-4 w-4 text-green-400" /> : 
                  <FaExclamationTriangle className="h-4 w-4 text-red-400" />
                }
              </div>
            </div>
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleOpenLivePage} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="localTwitchChannel" className="text-sm font-bold text-gray-200 flex items-center gap-2">
              <FaTwitch className="text-purple-400" />Nom du Canal Twitch (sans #)
            </label>
            <input
              id="localTwitchChannel"
              type="text"
              value={twitchChannel}
              onChange={(e) => setTwitchChannel(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600/50 rounded-xl shadow-sm text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-400 transition-all backdrop-blur-sm"
              placeholder="votrenomdecanal"
            />
          </div>
          
          <button
            type="submit"
            disabled={fetchedItems.length < 2 || isLoadingItems || isSubmitting}
            className="group/btn relative w-full inline-flex items-center justify-center px-6 py-4 text-base font-bold text-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
            <span className="relative z-10 flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin h-5 w-5" />
                  Préparation...
                </>
              ) : (
                <>
                  <FaRocket className="group-hover/btn:animate-bounce" />
                  Lancer le Tournoi
                </>
              )}
            </span>
          </button>
          
          {fetchedItems.length < 2 && !isLoadingItems && (
            <p className="text-xs text-yellow-300 bg-yellow-500/10 px-3 py-2 rounded-lg border border-yellow-500/30">
              Au moins 2 participants sont requis pour lancer le tournoi.
            </p>
          )}
        </form>

        {/* Legal Section */}
        <div className="mt-8 pt-6 border-t-2 border-slate-700/50">
          <h4 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Informations Légales
          </h4>
          <div className="space-y-4 text-xs text-gray-400">
            <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600/30">
              <h5 className="font-bold text-gray-200 mb-2 flex items-center gap-2">
                <FaTwitch className="text-purple-400" />
                Utilisation de Twitch
              </h5>
              <p className="leading-relaxed">
                En utilisant cette fonctionnalité, vous vous engagez à respecter les{' '}
                <a 
                  href="https://www.twitch.tv/p/fr-fr/legal/terms-of-service/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline font-semibold transition-colors"
                >
                  Conditions de Service de Twitch
                </a>
                {' '}et les{' '}
                <a 
                  href="https://www.twitch.tv/p/fr-fr/legal/community-guidelines/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline font-semibold transition-colors"
                >
                  Règles de la Communauté Twitch
                </a>
                . Vous devez avoir l'autorisation du propriétaire de la chaîne pour utiliser son chat.
              </p>
            </div>
            
            <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600/30">
              <h5 className="font-bold text-gray-200 mb-2">📦 Stockage Local</h5>
              <p className="leading-relaxed">
                Les données du tournoi sont stockées localement dans votre navigateur. Nous ne collectons ni ne transmettons vos données personnelles à des serveurs tiers. Vous êtes responsable de la sauvegarde de vos données.
              </p>
            </div>
            
            <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600/30">
              <h5 className="font-bold text-gray-200 mb-2">⚖️ Responsabilité</h5>
              <p className="leading-relaxed">
                Ce service est fourni "tel quel" sans garantie d'aucune sorte. L'utilisateur est seul responsable de l'utilisation qu'il fait de cet outil et des interactions sur Twitch. Nous déclinons toute responsabilité en cas de bannissement, suspension ou toute action prise par Twitch ou d'autres plateformes.
              </p>
            </div>
            
            <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600/30">
              <h5 className="font-bold text-gray-200 mb-2">🎥 Contenu YouTube</h5>
              <p className="leading-relaxed">
                L'utilisation de vidéos YouTube doit respecter les{' '}
                <a 
                  href="https://www.youtube.com/t/terms" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline font-semibold transition-colors"
                >
                  Conditions d'Utilisation de YouTube
                </a>
                {' '}et le droit d'auteur. Assurez-vous d'avoir les droits nécessaires pour utiliser les contenus dans vos tournois.
              </p>
            </div>
            
            <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600/30">
              <h5 className="font-bold text-gray-200 mb-2">🔒 Protection des Données</h5>
              <p className="leading-relaxed">
                Conformément au RGPD, vous conservez le contrôle total de vos données. Vous pouvez à tout moment supprimer vos tournois et les données associées. Les noms d'utilisateur Twitch collectés via le chat sont traités conformément aux politiques de Twitch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
