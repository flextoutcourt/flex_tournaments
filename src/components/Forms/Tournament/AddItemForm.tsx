// components/AddItemForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaPlus, FaYoutube, FaFont, FaExclamationTriangle, FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';import Image from 'next/image';
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
  category?: string; // Optionnel: utilisé si le tournoi a deux catégories
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
  twoCategoryMode?: boolean;
  categories?: string[] | null;
}

export default function AddItemForm({ tournamentId, itemCount, twoCategoryMode = false, categories = null }: AddItemFormProps) {
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
      category: undefined,
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
          category: (data as any).category ?? null,
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
    <div className="bg-gradient-to-br from-slate-800/80 via-slate-800/80 to-slate-900/80 border-2 border-indigo-500/30 hover:border-indigo-500/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl transition-all duration-500 relative overflow-hidden group">
      {/* Background effects */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl group-hover:bg-indigo-600/20 transition-all duration-700"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition-all duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 rounded-lg blur-md opacity-50"></div>
              <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-lg">
                <FaPlus className="text-white" />
              </div>
            </div>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Ajouter un Participant
            </span>
          </h3>
          <div className="bg-indigo-500/20 px-4 py-2 rounded-lg border border-indigo-500/30 backdrop-blur-sm">
            <p className="text-sm text-indigo-300 font-semibold">{itemCount} participant{itemCount > 1 ? 's' : ''}</p>
          </div>
        </div>

        {serverError && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border-2 border-red-500/50 rounded-xl flex items-start gap-3 backdrop-blur-sm animate-fadeIn">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-50"></div>
              <div className="relative bg-red-500/20 p-2 rounded-full">
                <FaExclamationTriangle className="h-5 w-5 text-red-400" />
              </div>
            </div>
            <p className="text-sm leading-relaxed">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section de recherche YouTube */}
          <div className="space-y-3">
            <label htmlFor="youtubeSearchQuery" className="text-sm font-bold text-gray-200 flex items-center gap-2">
              <FaYoutube className="text-red-500" /> Rechercher sur YouTube
            </label>
            <div className="flex gap-2">
              <input
                id="youtubeSearchQuery"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleYouTubeSearch();}}}
                placeholder="Titre de vidéo, nom de chaîne..."
                className="flex-1 px-4 py-3 bg-slate-700/50 border-2 border-slate-600/50 rounded-xl shadow-sm text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-all backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={handleYouTubeSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="group/btn relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  {isSearching ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <FaSearch />
                  )}
                </div>
              </button>
            </div>
            {searchError && (
              <p className="mt-2 text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/30">{searchError}</p>
            )}
          </div>

          {/* Affichage des résultats de recherche */}
          {searchResults.length > 0 && (
            <ul className="border-2 border-purple-500/30 rounded-xl p-3 space-y-2 max-h-72 overflow-y-auto bg-slate-700/30 backdrop-blur-sm custom-scrollbar">
              {searchResults.map((result) => (
                <li
                  key={result.id + result.kind}
                  className="group/result flex items-center p-3 bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-purple-600/30 hover:to-indigo-600/30 rounded-lg cursor-pointer transition-all duration-300 border-2 border-transparent hover:border-purple-500/50 hover:scale-[1.02]"
                  onClick={() => handleSelectSearchResult(result)}
                >
                  <div className="relative flex-shrink-0 mr-4">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-lg blur-md opacity-0 group-hover/result:opacity-100 transition-opacity duration-300"></div>
                    <Image src={result.thumbnail} alt={result.title} width={100} height={56} className="relative rounded-lg aspect-video object-cover shadow-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate mb-1 group-hover/result:text-purple-300 transition-colors" title={result.title}>{result.title}</p>
                    {result.channelTitle && <p className="text-xs text-gray-300 truncate mb-1">📺 {result.channelTitle}</p>}
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 capitalize">
                      {result.kind}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Champ Nom du Participant */}
          <div className="space-y-2">
            <label htmlFor="itemName" className="text-sm font-bold text-gray-200 flex items-center gap-2">
              <FaFont className="text-purple-400" /> Nom du Participant
            </label>
            <input
              id="itemName"
              type="text"
              {...register('name')}
              className={`w-full px-4 py-3 bg-slate-700/50 border-2 ${errors.name ? 'border-red-500/50' : 'border-slate-600/50'} rounded-xl shadow-sm text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-all backdrop-blur-sm`}
              placeholder="Sera pré-rempli ou entrez manuellement"
            />
            {errors.name && (
              <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/30">{errors.name.message}</p>
            )}
          </div>

          {/* Si le tournoi est en mode deux-catégories */}
          {twoCategoryMode && (
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-200">Sélectionner une catégorie</label>
              <div className="grid grid-cols-2 gap-3">
                {(categories || []).map((category, index) => {
                  const isSelected = watch('category') === category;
                  const isFirstCategory = index === 0;
                  const _accentColor = isFirstCategory ? 'blue' : 'pink';
                  const hoverColor = isFirstCategory ? 'from-blue-600/40 to-blue-500/30' : 'from-pink-600/40 to-pink-500/30';
                  const borderColor = isFirstCategory ? 'border-blue-500/50' : 'border-pink-500/50';
                  const selectedBg = isFirstCategory ? 'from-blue-600/50 to-blue-500/40 border-blue-400' : 'from-pink-600/50 to-pink-500/40 border-pink-400';
                  
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setValue('category', category)}
                      className={`relative group px-4 py-4 rounded-xl font-bold text-center transition-all duration-300 border-2 overflow-hidden ${
                        isSelected
                          ? `bg-gradient-to-br ${selectedBg} text-white shadow-lg scale-105`
                          : `bg-gradient-to-br from-slate-700/40 to-slate-600/30 ${borderColor} text-gray-200 hover:${hoverColor} hover:scale-102`
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                          backgroundImage: isFirstCategory
                            ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))'
                            : 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(244, 63, 94, 0.2))'
                        }}
                      ></div>
                      <div className="relative z-10 flex items-center justify-center gap-2">
                        <span className="text-lg">{isFirstCategory ? '🎵' : '🎸'}</span>
                        <span className="truncate">{category}</span>
                        {isSelected && <span className="ml-1">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
              {twoCategoryMode && !watch('category') && (
                <p className="text-xs text-yellow-400 bg-yellow-500/10 px-3 py-2 rounded-lg border border-yellow-500/30">⚠️ Veuillez sélectionner une catégorie.</p>
              )}
            </div>
          )}

          {/* Hidden input for category (needed for form submission) */}
          <input
            type="hidden"
            {...register('category')}
          />

          {/* Champ Lien YouTube */}
          <div className="space-y-2">
            <label htmlFor="youtubeUrl" className="text-sm font-bold text-gray-200 flex items-center gap-2">
              <FaYoutube className="text-red-500" /> Lien YouTube (sélectionné)
            </label>
            <input
              id="youtubeUrl"
              type="text"
              {...register('youtubeUrl')}
              readOnly
              className={`w-full px-4 py-3 bg-slate-600/30 border-2 ${errors.youtubeUrl ? 'border-red-500/50' : 'border-slate-500/50'} rounded-xl shadow-sm text-gray-300 placeholder-gray-500 cursor-not-allowed backdrop-blur-sm`}
              placeholder="Sélectionnez un résultat de recherche ci-dessus"
            />
            {errors.youtubeUrl && (
              <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/30">{errors.youtubeUrl.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isFormStateSubmitting || isSubmittingToServer || !isValid || !watch('youtubeUrl')}
              className="group/btn relative w-full inline-flex items-center justify-center px-6 py-4 text-base font-bold text-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center gap-2">
                {isSubmittingToServer || isFormStateSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Ajouter le Participant
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
