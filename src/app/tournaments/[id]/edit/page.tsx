// app/tournaments/[id]/edit/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaEdit, FaSave, FaExclamationTriangle, FaSpinner, FaAlignLeft } from 'react-icons/fa';
// Removed FaListAlt, FaTrash, FaVideo, AddItemForm

interface TournamentDetails {
  id: string;
  title: string;
  description: string; // Ajout de la description
  // channelName a été retiré car la gestion des participants est enlevée
}

interface IEditTournamentFormInputs {
  title: string;
  description: string;
}

const tournamentSchema = yup.object().shape({
  title: yup.string().required("Le titre du tournoi est requis.").min(3, "Le titre doit contenir au moins 3 caractères."),
  description: yup.string().required("La description est requise").max(500, "La description ne doit pas dépasser 500 caractères."),
});

export default function EditTournamentPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = typeof params.id === 'string' ? params.id : null;

  const [tournament, setTournament] = useState<TournamentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid: isFormValid },
    setValue, // Utiliser setValue pour pré-remplir le formulaire
  } = useForm<IEditTournamentFormInputs>({
    resolver: yupResolver(tournamentSchema),
    mode: 'onChange',
  });

  const fetchTournamentDetails = useCallback(async () => {
    if (!tournamentId) {
      setError("ID du tournoi non valide.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Impossible de charger le tournoi (statut ${response.status})`);
      }
      const data: TournamentDetails = await response.json();
      setTournament(data);
      // Pré-remplir le formulaire avec les données chargées
      setValue('title', data.title);
      setValue('description', data.description || '');
      setError(null);
    } catch (err: any) {
      console.error("Erreur fetchTournamentDetails:", err);
      setError(err.message || "Une erreur est survenue lors du chargement du tournoi.");
      setTournament(null);
    } finally {
      setIsLoading(false);
    }
  }, [tournamentId, setValue]);

  useEffect(() => {
    fetchTournamentDetails();
  }, [fetchTournamentDetails]);

  const onSubmit: SubmitHandler<IEditTournamentFormInputs> = async (data) => {
    if (!tournamentId) return;
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: data.title, description: data.description }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la mise à jour du tournoi.");
      }
      const updatedTournament = await response.json();
      setTournament(prev => prev ? { ...prev, title: updatedTournament.title, description: updatedTournament.description } : null);
      setValue('title', updatedTournament.title);
      setValue('description', updatedTournament.description || '');
      // Afficher un message de succès temporaire si nécessaire
      // Par exemple, avec un état supplémentaire: setSuccessMessage("Tournoi mis à jour !");
    } catch (err: any) {
      console.error("Erreur onSubmit:", err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <FaSpinner className="animate-spin h-12 w-12 text-purple-500 mb-4" />
        <p>Chargement du tournoi...</p>
      </div>
    );
  }

  if (error && !tournament) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 text-center">
        <FaExclamationTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Erreur de chargement</h2>
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => router.push('/tournaments')}
          className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-semibold"
        >
          Retour à la liste des tournois
        </button>
      </div>
    );
  }
  
  if (!tournament) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
            <p>Tournoi non trouvé ou une erreur s'est produite.</p>
             <button
                onClick={() => router.push('/tournaments')}
                className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-semibold"
            >
                Retour à la liste des tournois
            </button>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto"> {/* Réduit la largeur max pour un formulaire plus concis */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4 sm:mb-0">
                <FaEdit className="inline-block mr-3 mb-1" /> Éditer le Tournoi
            </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 text-red-300 border border-red-500 rounded-md flex items-center">
            <FaExclamationTriangle className="h-5 w-5 mr-3 text-red-400 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 bg-gray-800 rounded-lg shadow-xl space-y-6">
          <div>
            <label htmlFor="tournamentTitle" className="block text-lg font-medium text-gray-300 mb-2">
              <FaEdit className="inline-block mr-2 mb-0.5" /> Titre du Tournoi
            </label>
            <input
              id="tournamentTitle"
              type="text"
              {...register('title')}
              className={`w-full px-4 py-2.5 bg-gray-700 border ${errors.title ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm text-gray-100 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500`}
              placeholder="Entrez le titre du tournoi"
            />
            {errors.title && <p className="mt-2 text-xs text-red-400">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="tournamentDescription" className="block text-lg font-medium text-gray-300 mb-2">
              <FaAlignLeft className="inline-block mr-2 mb-0.5" /> Description (Optionnel)
            </label>
            <textarea
              id="tournamentDescription"
              rows={4}
              {...register('description')}
              className={`w-full px-4 py-2.5 bg-gray-700 border ${errors.description ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm text-gray-100 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500`}
              placeholder="Entrez une courte description pour votre tournoi..."
            />
            {errors.description && <p className="mt-2 text-xs text-red-400">{errors.description.message}</p>}
          </div>
          
          <button
            type="submit"
            disabled={isSaving || !isFormValid}
            className="w-full px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center transition-colors text-base"
          >
            {isSaving ? (
              <FaSpinner className="animate-spin mr-2 h-5 w-5" />
            ) : (
              <FaSave className="mr-2 h-5 w-5" />
            )}
            Enregistrer les Modifications
          </button>
        </form>
      </div>
    </div>
  );
}
