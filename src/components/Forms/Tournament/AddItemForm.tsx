// components/AddItemForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaPlus, FaYoutube, FaFont, FaExclamationTriangle } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; // Importer useRouter

interface IAddItemFormInputs {
  name?: string;
  youtubeUrl: string;
}

const schema = yup.object().shape({
  name: yup.string().optional(),
  youtubeUrl: yup.string().required().url("Veuillez entrer une URL YouTube valide (ex: https://www.youtube.com/watch?v=...).")
    .matches(
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
      "L'URL doit être un lien YouTube valide."
    ),
});

interface AddItemFormProps {
  tournamentId: string;
  itemCount: number;
  // La prop onItemAdded a été retirée
}

export default function AddItemForm({ tournamentId, itemCount }: AddItemFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter(); // Initialiser le router

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<IAddItemFormInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      youtubeUrl: '',
    },
  });

  const onSubmit: SubmitHandler<IAddItemFormInputs> = async (data) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          youtubeUrl: data.youtubeUrl || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur ${response.status} lors de l'ajout de l'item.`);
      }

      reset();
      router.refresh(); // Rafraîchir les données de la page serveur parente

    } catch (error: any) {
      setServerError(error.message || 'Une erreur inconnue est survenue.');
      console.error("Erreur de soumission d'item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md mt-8">
      <h3 className="text-xl font-semibold text-purple-400 mb-4">
        <FaPlus className="inline-block mr-2 mb-0.5" />
        Ajouter un Participant au Tournoi
      </h3>
      <p className="text-sm text-gray-400 mb-4">Participants actuels : {itemCount}</p>


      {serverError && (
        <div className="mb-4 p-3 bg-red-500/20 text-red-300 border border-red-500 rounded-md flex items-center">
          <FaExclamationTriangle className="h-5 w-5 mr-2 text-red-400" />
          <p className="text-sm">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-300 mb-1">
            <FaFont className="inline-block mr-1.5 mb-0.5" />Nom du Participant (optionel si lien youtube)
          </label>
          <input
            id="itemName"
            type="text"
            {...register('name')}
            className={`w-full px-3 py-2 bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm text-gray-100 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500`}
            placeholder="Ex: Titre de la musique, nom du jeu..."
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-300 mb-1">
            <FaYoutube className="inline-block mr-1.5 mb-0.5" />Lien YouTube
          </label>
          <input
            id="youtubeUrl"
            type="url"
            {...register('youtubeUrl')}
            className={`w-full px-3 py-2 bg-gray-700 border ${errors.youtubeUrl ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm text-gray-100 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500`}
            placeholder="Ex: https://www.youtube.com/watch?v=..."
          />
          {errors.youtubeUrl && <p className="mt-1 text-xs text-red-400">{errors.youtubeUrl.message}</p>}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting || isLoading || !isValid}
            className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading || isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ajout en cours...
              </>
            ) : (
              'Ajouter le Participant'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
