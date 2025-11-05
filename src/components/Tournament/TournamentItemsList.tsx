// components/TournamentItemsList.tsx
'use client'; // Si des actions client (ex: suppression) sont ajoutées

import { Item } from '@prisma/client'; // Type Prisma pour Item
import Link from 'next/link';
import { FaYoutube, FaTrash, FaEdit, FaSearch, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; // Pour rafraîchir après suppression
import { useState, useMemo } from 'react';

interface TournamentItemsListProps {
  items: Item[];
  tournamentId: string;
  status: string; // Statut actuel du tournoi ('SETUP', 'PUBLISHED', etc.)
}

export default function TournamentItemsList({ items, tournamentId, status }: TournamentItemsListProps) {
  const router = useRouter();
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);


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
    <div className="space-y-4">
      {/* Search Bar */}
      {items.length > 0 && (
        <div className="relative">
          <div className="relative flex items-center">
            <FaSearch className="absolute left-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un participant..."
              className="w-full pl-11 pr-12 py-3 bg-slate-700/50 border-2 border-slate-600/50 rounded-xl text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all backdrop-blur-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-2 text-gray-400 hover:text-gray-200 transition-colors rounded-lg hover:bg-slate-600/50"
                title="Effacer la recherche"
              >
                <FaTimes />
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-2 text-xs text-gray-400 flex items-center gap-2">
              <span className="bg-purple-500/20 px-2 py-1 rounded-md border border-purple-500/30">
                {filteredItems.length} résultat{filteredItems.length > 1 ? 's' : ''} trouvé{filteredItems.length > 1 ? 's' : ''}
              </span>
              {filteredItems.length !== items.length && (
                <span className="text-gray-500">sur {items.length} participant{items.length > 1 ? 's' : ''}</span>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border-2 border-red-500/50 rounded-xl backdrop-blur-sm animate-fadeIn">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* No results message */}
      {filteredItems.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-full mb-3">
            <FaSearch className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-300 text-base font-medium mb-1">
            Aucun participant trouvé
          </p>
          <p className="text-gray-400 text-sm">
            Essayez avec un autre terme de recherche
          </p>
        </div>
      )}

      {filteredItems.map((item, index) => {
        // Find the original index for display
        const originalIndex = items.findIndex(i => i.id === item.id);
        return (
          <div 
            key={item.id} 
            className="group/item bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-2 border-slate-600/30 hover:border-purple-500/50 p-4 md:p-5 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 hover:scale-[1.01] backdrop-blur-sm relative overflow-hidden"
          >
            {/* Animated gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-indigo-600/0 group-hover/item:from-purple-600/10 group-hover/item:to-indigo-600/10 transition-all duration-300"></div>
            
            <div className="flex-grow relative z-10">
              <div className="flex items-center gap-3 mb-2">
                {/* Rank badge */}
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500 rounded-lg blur-md opacity-50 group-hover/item:opacity-70 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-purple-600 to-indigo-600 px-3 py-1.5 rounded-lg shadow-lg">
                    <span className="text-white font-black text-sm">#{originalIndex + 1}</span>
                  </div>
                </div>
                
                {/* Participant name */}
                <p className="text-base md:text-lg font-bold text-white group-hover/item:text-purple-300 transition-colors">
                  {item.name}
                </p>
              </div>
              
              {item.youtubeUrl && (
                <Link 
                  href={item.youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-xs md:text-sm text-blue-400 hover:text-blue-300 transition-colors group/link"
                >
                  <div className="flex items-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/30 transition-all">
                    <FaYoutube className="group-hover/link:animate-pulse" /> 
                    <span className="font-semibold">Voir sur YouTube</span>
                  </div>
                </Link>
              )}
            </div>
            
            {status === 'SETUP' && (
              <div className="flex gap-2 sm:mt-0 flex-shrink-0 relative z-10">
                {/* Edit Button */}
                <button 
                  disabled={deletingItemId === item.id}
                  className="group/edit relative p-3 bg-slate-700/50 hover:bg-blue-600/30 rounded-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 border-2 border-transparent hover:border-blue-500/50"
                  title="Éditer le participant"
                >
                  <FaEdit className="text-gray-400 group-hover/edit:text-blue-400 transition-colors" />
                </button>
                
                {/* Delete Button */}
                <button 
                  onClick={() => handleDeleteItem(item.id)}
                  disabled={deletingItemId === item.id}
                  className="group/delete relative p-3 bg-slate-700/50 hover:bg-red-600/30 rounded-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 border-2 border-transparent hover:border-red-500/50"
                  title="Supprimer le participant"
                >
                  {deletingItemId === item.id ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <FaTrash className="text-gray-400 group-hover/delete:text-red-400 transition-colors" />
                  )}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
