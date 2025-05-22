// components/TournamentItemsList.tsx
'use client'; // Si des actions client (ex: suppression) sont ajoutées

import { Item } from '@prisma/client'; // Type Prisma pour Item
import Link from 'next/link';
import { FaYoutube, FaTrash, FaEdit } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; // Pour rafraîchir après suppression
import { useState } from 'react';

interface TournamentItemsListProps {
  items: Item[];
  tournamentId: string;
  status: string; // Statut actuel du tournoi ('SETUP', 'PUBLISHED', etc.)
}

export default function TournamentItemsList({ items, tournamentId, status }: TournamentItemsListProps) {
  const router = useRouter();
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);


  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce participant ? Cette action est irréversible.")) {
      return;
    }
    setDeletingItemId(itemId);
    setError(null);
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/items/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Impossible de supprimer le participant.");
      }
      // Rafraîchir les données de la page pour mettre à jour la liste
      router.refresh();
    } catch (err: any) {
      console.error("Erreur suppression item:", err);
      setError(err.message);
    } finally {
      setDeletingItemId(null);
    }
  };


  return (
    <div className="space-y-3">
      {error && <p className="text-red-400 bg-red-500/10 p-3 rounded-md text-sm">{error}</p>}
      {items.map((item, index) => (
        <div key={item.id} className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex-grow">
            <p className="text-lg font-semibold text-gray-100">
              <span className="text-purple-400 mr-2">#{index + 1}</span>
              {item.name}
            </p>
            {item.youtubeUrl && (
              <Link href={item.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center mt-1">
                <FaYoutube className="mr-1" /> Voir sur YouTube
              </Link>
            )}
          </div>
          {status === 'SETUP' && ( // Actions d'édition/suppression uniquement en mode SETUP
            <div className="flex space-x-2 mt-2 sm:mt-0 flex-shrink-0">
              {/* Bouton Éditer Item (à implémenter) */}
              <button 
                // onClick={() => handleEditItem(item.id)} 
                disabled={deletingItemId === item.id}
                className="p-2 text-gray-400 hover:text-blue-400 transition-colors disabled:opacity-50"
                title="Éditer le participant"
              >
                <FaEdit />
              </button>
              <button 
                onClick={() => handleDeleteItem(item.id)}
                disabled={deletingItemId === item.id}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                title="Supprimer le participant"
              >
                {deletingItemId === item.id ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <FaTrash />
                )}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
