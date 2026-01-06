'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaShareSquare } from 'react-icons/fa';

interface PublishTournamentButtonProps {
  tournamentId: string;
}

export default function PublishTournamentButton({ tournamentId }: PublishTournamentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handlePublish = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la publication');
      }

      // Success - refresh the page
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      console.error('Erreur publication:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePublish}
        disabled={isLoading}
        className="group/btn relative w-full inline-flex items-center justify-center px-5 py-3 text-sm font-bold text-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
        <span className="relative z-10 flex items-center gap-2">
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Publication en cours...
            </>
          ) : (
            'Publier Maintenant'
          )}
        </span>
      </button>
      
      {error && (
        <div className="mt-3 p-3 bg-red-500/20 text-red-300 border border-red-500/50 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
