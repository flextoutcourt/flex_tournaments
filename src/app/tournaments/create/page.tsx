// app/tournament/create/page.tsx
'use client'; // Ce composant doit être un Client Component pour utiliser les hooks

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation'; // Pour la redirection après création
import { FaPlusCircle, FaFont, FaAlignLeft, FaExclamationTriangle } from 'react-icons/fa';

// Interface pour les données du formulaire (mise à jour pour correction du type)
interface ITournamentFormInputs {
  title: string; 
  description: string; // MODIFIÉ: La clé 'description' est requise, mais sa valeur peut être undefined/null
}

// Schéma de validation Yup (mis à jour)
const schema = yup.object().shape({
  title: yup.string().required("Le nom du tournoi est requis.").min(3, "Le nom doit contenir au moins 3 caractères."),
  description: yup.string().required().max(500, "La description ne doit pas dépasser 500 caractères."),
});

export default function CreateTournamentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isValid, isSubmitting }, reset } = useForm<ITournamentFormInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: "", // Laisser undefined est correct, la clé sera présente
    },
  });

  const onSubmit: SubmitHandler<ITournamentFormInputs> = async (data) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await fetch('/api/tournaments', { // Assurez-vous que cette route API est correcte
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title, // Assurez-vous que l'API attend 'title'
          description: data.description ?? null, // Envoyer null si description est undefined ou null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur ${response.status} lors de la création du tournoi.`);
      }

      const newTournament = await response.json();
      // Réinitialiser le formulaire
      reset();
      // Rediriger vers la page du tournoi nouvellement créé (où l'on pourra ajouter des items)
      router.push(`/tournaments/${newTournament.id}`); // Ajusté pour correspondre à la structure de route probable

    } catch (error: any) {
      setServerError(error.message || 'Une erreur inconnue est survenue.');
      console.error("Erreur de soumission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 md:p-8 bg-gray-800 rounded-xl shadow-2xl">
      <h1 className="text-3xl md:text-4xl font-bold text-purple-400 mb-8 text-center">
        <FaPlusCircle className="inline-block mr-3 mb-1" />
        Créer un Nouveau Tournoi
      </h1>

      {serverError && (
        <div className="mb-6 p-4 bg-red-500/20 text-red-300 border border-red-500 rounded-md flex items-center">
          <FaExclamationTriangle className="h-5 w-5 mr-3 text-red-400" />
          <p>{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nom du Tournoi */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1"> {/* Changé htmlFor de "name" à "title" */}
            <FaFont className="inline-block mr-2 mb-0.5" />Nom du Tournoi
          </label>
          <input
            id="title" // Changé id de "name" à "title"
            type="text"
            {...register('title')} // Changé de 'name' à 'title'
            className={`w-full px-4 py-2 bg-gray-700 border ${errors.title ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm text-gray-100 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500`}
            placeholder="Ex: Les meilleures performances live"
          />
          {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
        </div>

        {/* Description du Tournoi (Optionnel) */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            <FaAlignLeft className="inline-block mr-2 mb-0.5" />Description (Optionnel)
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className={`w-full px-4 py-2 bg-gray-700 border ${errors.description ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm text-gray-100 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500`}
            placeholder="Décrivez brièvement le thème ou les règles de votre tournoi..."
          />
          {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
        </div>

        {/* Bouton de soumission */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || isLoading || !isValid}
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading || isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création en cours...
              </>
            ) : (
              'Créer et passer à l\'ajout des participants'
            )}
          </button>
        </div>
      </form>
      <p className="mt-6 text-xs text-gray-400 text-center">
        Après avoir créé le tournoi, vous serez redirigé pour ajouter les participants.
      </p>
    </div>
  );
}
