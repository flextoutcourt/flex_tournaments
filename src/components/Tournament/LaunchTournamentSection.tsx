// components/LaunchTournamentSection.tsx
'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaRocket, FaTwitch, FaExclamationTriangle, FaSpinner, FaExternalLinkAlt } from 'react-icons/fa';
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
  // La prop 'items' a été retirée, les items seront fetchés
}

export default function LaunchTournamentSection({ tournamentId, tournamentTitle }: LaunchTournamentSectionProps) {
  const [twitchChannel, setTwitchChannel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Pour l'état du bouton
  
  const [fetchedItems, setFetchedItems] = useState<FetchedItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [fetchItemsError, setFetchItemsError] = useState<string | null>(null);

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
    
    // Stocker les données nécessaires pour la page live dans sessionStorage
    // car fetchedItems peut être une grande liste.
    try {
      sessionStorage.setItem(`tournamentData_${tournamentId}`, JSON.stringify({
        items: fetchedItems,
        title: tournamentTitle,
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
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center">
        <FaRocket className="mr-2" /> Lancer le Tournoi (Mode Local)
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        Entrez le nom de votre chaîne Twitch. Le tournoi s'ouvrira dans une nouvelle page pour la gestion en direct.
      </p>
      <p className="text-sm text-gray-400 mb-2">Participants chargés : {fetchedItems.length}</p>

      {error && (
        <div className={`mb-4 p-3 rounded-md flex items-center text-sm ${error.includes("nouvel onglet") ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
          {error.includes("nouvel onglet") ? <FaExternalLinkAlt className="h-4 w-4 mr-2 text-green-400 flex-shrink-0" /> : <FaExclamationTriangle className="h-4 w-4 mr-2 text-red-400 flex-shrink-0" />}
          {error}
        </div>
      )}

      <form onSubmit={handleOpenLivePage} className="space-y-4">
        <div>
          <label htmlFor="localTwitchChannel" className="block text-sm font-medium text-gray-300 mb-1">
            <FaTwitch className="inline-block mr-1.5 mb-0.5" />Nom du Canal Twitch (sans #)
          </label>
          <input
            id="localTwitchChannel"
            type="text"
            value={twitchChannel}
            onChange={(e) => setTwitchChannel(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500"
            placeholder="votrenomdecanal"
            required
          />
        </div>
        <button
          type="submit"
          disabled={fetchedItems.length < 2 || isLoadingItems || isSubmitting}
          className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 disabled:bg-gray-500 transition-colors"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
              Préparation...
            </>
          ) : (
            <p className="flex items-center">
              <FaRocket className="mr-2" /> Lancer le Tournoi
            </p>
          )}
        </button>
         {fetchedItems.length < 2 && !isLoadingItems && <p className="text-xs text-yellow-400 mt-1">Au moins 2 participants sont requis pour lancer le tournoi.</p>}
      </form>
    </div>
  );
}
