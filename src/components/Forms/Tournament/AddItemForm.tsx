// components/AddItemForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaPlus, FaYoutube, FaFont, FaExclamationTriangle, FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// Interface pour les résultats de recherche YouTube (similaire à l'exemple précédent)
interface YouTubeSearchResult {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  kind: 'video' | 'channel' | 'unknown'; // Soyez plus précis sur 'kind'
  channelTitle?: string;
}

interface IAddItemFormInputs {
  name: string; // Le nom est maintenant requis
  youtubeUrl: string; // Sera rempli par la recherche
  // Le champ de recherche lui-même n'est pas dans les inputs du formulaire soumis,
  // mais nous aurons un état pour lui.
}

const schema = yup.object().shape({
  name: yup.string().required("Le nom du participant est requis."),
  youtubeUrl: yup.string()
    .required("Veuillez sélectionner une vidéo ou une chaîne via la recherche.")
    .url("L'URL YouTube sélectionnée n'est pas valide.")
    .matches(
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
      "L'URL doit être un lien YouTube valide."
    ),
});

interface AddItemFormProps {
  tournamentId: string;
  itemCount: number;
}

export default function AddItemForm({ tournamentId, itemCount }: AddItemFormProps) {
  const [isSubmittingToServer, setIsSubmittingToServer] = useState(false); // Renommé pour clarté
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  // États pour la recherche YouTube
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<YouTubeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting: isFormStateSubmitting }, // isSubmitting de RHF
    reset,
    setValue, // Pour définir les valeurs des champs par programmation
    watch,    // Pour observer les changements de valeur si nécessaire
  } = useForm<IAddItemFormInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange', // ou 'onBlur'
    defaultValues: {
      name: '',
      youtubeUrl: '',
    },
  });

  const currentYoutubeUrl = watch('youtubeUrl'); // Observer l'URL pour la désactivation

  const handleYouTubeSearch = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if(e) e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError("Veuillez entrer un terme de recherche.");
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);

    try {
      const response = await fetch(`/api/youtube-search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'La recherche YouTube a échoué.');
      }
      if (data.length === 0) {
        setSearchError("Aucun résultat trouvé pour votre recherche.");
      }
      setSearchResults(data);
    } catch (err: any) {
      setSearchError(err.message);
      console.error("Erreur de recherche YouTube:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: YouTubeSearchResult) => {
    setValue('youtubeUrl', result.url, { shouldValidate: true, shouldDirty: true });
    // Pré-remplir le nom si ce n'est pas déjà fait ou si l'utilisateur le souhaite
    // Pour l'instant, on se concentre sur l'URL. Le nom peut être entré manuellement.
    // Vous pourriez ajouter une logique ici : if (!watch('name')) setValue('name', result.title);
    if (!watch('name')) {
        setValue('name', result.kind === 'channel' ? result.title : (result.channelTitle ? `${result.channelTitle} - ${result.title}`: result.title), { shouldValidate: true, shouldDirty: true });
    }
    setSearchResults([]); // Cacher les résultats après sélection
    setSearchQuery(result.title); // Optionnel: mettre le titre dans la barre de recherche
    setSearchError(null);
  };

  const onSubmit: SubmitHandler<IAddItemFormInputs> = async (data) => {
    setIsSubmittingToServer(true);
    setServerError(null);

    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name, // Assurez-vous que votre API attend 'name'
          youtubeUrl: data.youtubeUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur ${response.status} lors de l'ajout de l'item.`);
      }

      reset(); // Réinitialise les champs du formulaire react-hook-form
      setSearchQuery(''); // Réinitialise aussi le champ de recherche manuel
      setSearchResults([]);
      setSearchError(null);
      router.refresh();
    } catch (error: any) {
      setServerError(error.message || 'Une erreur inconnue est survenue.');
      console.error("Erreur de soumission d'item:", error);
    } finally {
      setIsSubmittingToServer(false);
    }
  };

  // Effacer l'erreur de recherche si l'URL YouTube est remplie (par sélection)
  useEffect(() => {
    if (currentYoutubeUrl && searchError) {
      setSearchError(null);
    }
  }, [currentYoutubeUrl, searchError]);

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section de recherche YouTube */}
        <div className="space-y-2">
          <label htmlFor="youtubeSearchQuery" className="block text-sm font-medium text-gray-300">
            <FaYoutube className="inline-block mr-1.5 mb-0.5" /> Rechercher sur YouTube
          </label>
          <div className="flex space-x-2">
            <input
              id="youtubeSearchQuery"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleYouTubeSearch();}}}
              placeholder="Titre de vidéo, nom de chaîne..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500"
            />
            <button
              type="button" // Important pour ne pas soumettre le formulaire principal
              onClick={handleYouTubeSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSearching ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FaSearch />
              )}
            </button>
          </div>
          {searchError && <p className="mt-1 text-xs text-red-400">{searchError}</p>}
        </div>

        {/* Affichage des résultats de recherche */}
        {searchResults.length > 0 && (
          <ul className="border border-gray-700 rounded-md p-2 space-y-2 max-h-60 overflow-y-auto bg-gray-700/50">
            {searchResults.map((result) => (
              <li
                key={result.id + result.kind} // Utiliser kind pour une clé plus unique si ID peut être partagé
                className="flex items-center p-2.5 bg-gray-600 hover:bg-gray-500 rounded-md cursor-pointer transition-colors"
                onClick={() => handleSelectSearchResult(result)}
              >
                <img src={result.thumbnail} alt={result.title} width="80" className="mr-3 rounded aspect-video object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate" title={result.title}>{result.title}</p>
                  {result.channelTitle && <p className="text-xs text-gray-300 truncate">Chaîne : {result.channelTitle}</p>}
                  <p className="text-xs text-indigo-300 capitalize">{result.kind}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Champ Nom du Participant (maintenant requis) */}
        <div>
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-300 mb-1">
            <FaFont className="inline-block mr-1.5 mb-0.5" /> Nom du Participant
          </label>
          <input
            id="itemName"
            type="text"
            {...register('name')}
            className={`w-full px-3 py-2 bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm text-gray-100 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500`}
            placeholder="Sera pré-rempli ou entrez manuellement"
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        {/* Champ Lien YouTube (maintenant en lecture seule et rempli par la recherche) */}
        <div>
          <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-300 mb-1">
            <FaYoutube className="inline-block mr-1.5 mb-0.5" /> Lien YouTube (sélectionné)
          </label>
          <input
            id="youtubeUrl"
            type="text" // Garder type text pour afficher l'URL
            {...register('youtubeUrl')}
            readOnly
            className={`w-full px-3 py-2 bg-gray-600 border ${errors.youtubeUrl ? 'border-red-500' : 'border-gray-500'} rounded-md shadow-sm text-gray-300 placeholder-gray-500 cursor-not-allowed`}
            placeholder="Sélectionnez un résultat de recherche ci-dessus"
          />
          {errors.youtubeUrl && <p className="mt-1 text-xs text-red-400">{errors.youtubeUrl.message}</p>}
        </div>

        <div>
          <button
            type="submit"
            disabled={isFormStateSubmitting || isSubmittingToServer || !isValid || !watch('youtubeUrl') /* S'assurer qu'une URL a été sélectionnée */}
            className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmittingToServer || isFormStateSubmitting ? (
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
