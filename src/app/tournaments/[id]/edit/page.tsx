// app/tournaments/[id]/edit/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaEdit, FaSave, FaExclamationTriangle, FaSpinner, FaAlignLeft, FaCheckCircle, FaArrowLeft, FaTrash, FaPlus, FaGripVertical, FaCopy, FaLink, FaEye, FaTrophy, FaToggleOn, FaToggleOff, FaUser, FaClock } from 'react-icons/fa';
import Link from 'next/link';

interface Item {
  id: string;
  name: string;
  category?: string;
  youtubeUrl?: string;
}

interface TournamentDetails {
  id: string;
  title: string;
  description: string;
  status: string;
  mode: string;
  categoryA?: string;
  categoryB?: string;
  Items?: Item[];
  createdAt?: string;
  updatedAt?: string;
  createdById?: string;
  createdBy?: { id: string; email: string; name?: string };
  ActivityLog?: Array<{
    id: string;
    action: string;
    description?: string;
    createdAt: string;
    user?: { email: string; name?: string };
  }>;
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryA, setCategoryA] = useState('');
  const [categoryB, setCategoryB] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [newCreatorEmail, setNewCreatorEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid: isFormValid },
    control,
    watch,
    reset,
  } = useForm<IEditTournamentFormInputs>({
    resolver: yupResolver(tournamentSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const titleValue = watch('title');
  const descriptionValue = watch('description');

  // Reset form when tournament data loads
  useEffect(() => {
    if (tournament) {
      reset({
        title: tournament.title,
        description: tournament.description || '',
      });
    }
  }, [tournament, reset]);

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
      const responseData: any = await response.json();
      const data: TournamentDetails = responseData.data || responseData;
      console.log('Tournament loaded:', data);
      setTournament(data);
      setItems(data.Items || []);
      setCategoryA(data.categoryA || '');
      setCategoryB(data.categoryB || '');
      setError(null);
    } catch (err: any) {
      console.error("Erreur fetchTournamentDetails:", err);
      setError(err.message || "Une erreur est survenue lors du chargement du tournoi.");
      setTournament(null);
    } finally {
      setIsLoading(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    fetchTournamentDetails();
  }, [fetchTournamentDetails]);

  const onSubmit: SubmitHandler<IEditTournamentFormInputs> = async (data) => {
    if (!tournamentId) return;
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
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
      setSuccessMessage("✨ Tournoi mis à jour avec succès!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error("Erreur onSubmit:", err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const addItem = async () => {
    if (!newItemName.trim() || !tournamentId) return;
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newItemName.trim(), category: tournament?.mode === 'TWO_CATEGORY' ? (items.length % 2 === 0 ? categoryA : categoryB) : undefined }),
      });
      if (!response.ok) throw new Error('Erreur lors de l\'ajout');
      const newItem = await response.json();
      setItems([...items, newItem.data || newItem]);
      setNewItemName('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!tournamentId) return;
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/items/${itemId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      setItems(items.filter(i => i.id !== itemId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteTournament = async () => {
    if (!tournamentId) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      router.push('/tournaments');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const duplicateTournament = async () => {
    if (!tournamentId || !tournament) return;
    try {
      const response = await fetch(`/api/tournaments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${tournament.title} (Copie)`,
          description: tournament.description,
          mode: tournament.mode,
          categoryA: tournament.categoryA,
          categoryB: tournament.categoryB,
          items: items.map(i => ({ name: i.name, category: i.category })),
        }),
      });
      if (!response.ok) throw new Error('Erreur lors de la duplication');
      const newTournament = await response.json();
      setSuccessMessage('✨ Tournoi dupliqué! Redirection...');
      setTimeout(() => {
        router.push(`/tournaments/${newTournament.data?.id || newTournament.id}/edit`);
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const copyToClipboard = async () => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/tournaments/${tournamentId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setError('Erreur lors de la copie');
    }
  };

  const handlePublishToggle = async () => {
    if (!tournamentId) return;
    setIsPublishing(true);
    try {
      const newStatus = tournament?.status === 'SETUP' ? 'LIVE' : 'SETUP';
      const response = await fetch(`/api/tournaments/${tournamentId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.message || `Erreur lors de la ${newStatus === 'LIVE' ? 'publication' : 'dépublication'} du tournoi`);
        setIsPublishing(false);
        return;
      }

      const updatedTournament = await response.json();
      setTournament(updatedTournament.data || updatedTournament);
      setSuccessMessage(`✨ Tournoi ${newStatus === 'LIVE' ? 'publié' : 'dépublié'} avec succès!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du statut du tournoi');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleChangeCreator = async () => {
    if (!newCreatorEmail.trim() || !tournamentId) {
      setError('Veuillez entrer une adresse email');
      return;
    }

    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/creator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorEmail: newCreatorEmail }),
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.message || 'Erreur lors du changement du créateur');
        return;
      }

      const updatedTournament = await response.json();
      setTournament(updatedTournament.data || updatedTournament);
      setNewCreatorEmail('');
      setShowCreatorModal(false);
      setSuccessMessage('✨ Créateur du tournoi changé avec succès!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du changement du créateur');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
        <div className="inline-block">
          <svg className="animate-spin h-12 w-12 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-gray-300 mt-4">Chargement du tournoi...</p>
      </div>
    );
  }

  if (error && !tournament) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
        <FaExclamationTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-3xl font-bold mb-2">Erreur de chargement</h2>
        <p className="text-red-300 mb-8 text-center max-w-md">{error}</p>
        <Link href="/tournaments" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition-colors">
          Retour à la liste des tournois
        </Link>
      </div>
    );
  }
  
  if (!tournament) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
        <p className="text-xl text-gray-300">Tournoi non trouvé.</p>
        <Link href="/tournaments" className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition-colors">
          Retour à la liste des tournois
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Back button */}
        <Link href={`/tournaments/${tournamentId}`} className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors">
          <FaArrowLeft className="h-4 w-4" />
          Retour au tournoi
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-3 flex items-center gap-3">
            <FaEdit className="text-purple-500" />
            Éditer le Tournoi
          </h1>
          <p className="text-gray-400">Mettez à jour les informations de <span className="text-purple-300 font-semibold">{tournament.title}</span></p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <button
            type="button"
            onClick={() => router.push(`/tournaments/${tournamentId}`)}
            className="px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-indigo-300 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all text-sm"
          >
            <FaEye className="h-4 w-4" />
            Aperçu
          </button>
          {tournament.status === 'LIVE' && (
            <button
              type="button"
              onClick={() => router.push(`/tournaments/${tournamentId}/live`)}
              className="px-4 py-2 bg-green-600/30 hover:bg-green-600/50 border border-green-500/30 text-green-300 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all text-sm"
            >
              <FaTrophy className="h-4 w-4" />
              Classement
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-purple-300 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all text-sm"
          >
            <FaLink className="h-4 w-4" />
            Partager
          </button>
          <button
            type="button"
            onClick={duplicateTournament}
            className="px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 text-blue-300 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all text-sm"
          >
            <FaCopy className="h-4 w-4" />
            Dupliquer
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/20 text-green-300 border border-green-500/50 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top">
            <FaCheckCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 text-red-300 border border-red-500/50 rounded-lg flex items-center gap-3">
            <FaExclamationTriangle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
            {/* Tournament Info Display */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
              <div>
                <p className="text-gray-400 text-sm">Mode</p>
                <p className="text-white font-semibold capitalize">{tournament.mode === 'STANDARD' ? 'Standard' : 'Deux Catégories'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Statut</p>
                <p className={`font-semibold capitalize ${tournament.status === 'LIVE' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {tournament.status === 'SETUP' ? '⚙️ En préparation' : '🔴 En direct'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Items</p>
                <p className="text-white font-semibold">{items.length}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Créé</p>
                <p className="text-white font-semibold text-xs">{tournament.createdAt ? new Date(tournament.createdAt).toLocaleDateString('fr-FR') : 'N/A'}</p>
              </div>
            </div>

            {/* Title Field */}
            <div>
              <label htmlFor="tournamentTitle" className="block text-sm font-semibold text-gray-300 mb-3">
                <span className="flex items-center gap-2">
                  <FaEdit className="text-purple-500" />
                  Titre du Tournoi
                </span>
              </label>
              <input
                id="tournamentTitle"
                type="text"
                {...register('title')}
                value={titleValue}
                onChange={(e) => {
                  register('title').onChange?.(e);
                }}
                className={`w-full px-4 py-3 bg-slate-900/50 border ${errors.title ? 'border-red-500/50 focus:border-red-500' : 'border-slate-600/50 focus:border-purple-500'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all`}
                placeholder="Titre du tournoi..."
              />
              {errors.title && <p className="mt-2 text-xs text-red-400 flex items-center gap-1"><FaExclamationTriangle className="h-3 w-3" /> {errors.title.message}</p>}
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="tournamentDescription" className="block text-sm font-semibold text-gray-300 mb-3">
                <span className="flex items-center gap-2">
                  <FaAlignLeft className="text-purple-500" />
                  Description
                </span>
              </label>
              <textarea
                id="tournamentDescription"
                rows={5}
                {...register('description')}
                value={descriptionValue}
                onChange={(e) => {
                  register('description').onChange?.(e);
                }}
                className={`w-full px-4 py-3 bg-slate-900/50 border ${errors.description ? 'border-red-500/50 focus:border-red-500' : 'border-slate-600/50 focus:border-purple-500'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none`}
                placeholder="Décrivez votre tournoi..."
              />
              <div className="mt-2 flex justify-between items-center">
                {errors.description && <p className="text-xs text-red-400 flex items-center gap-1"><FaExclamationTriangle className="h-3 w-3" /> {errors.description.message}</p>}
                <p className="text-xs text-gray-500 ml-auto">Limite: 500 caractères</p>
              </div>
            </div>

            {/* Category Editor for TWO_CATEGORY mode */}
            {tournament.mode === 'TWO_CATEGORY' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Catégorie A</label>
                  <input
                    type="text"
                    value={categoryA}
                    onChange={(e) => setCategoryA(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Nom de la catégorie A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Catégorie B</label>
                  <input
                    type="text"
                    value={categoryB}
                    onChange={(e) => setCategoryB(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Nom de la catégorie B"
                  />
                </div>
              </div>
            )}

            {/* Items Management */}
            <div className="border-t border-slate-700/30 pt-7">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaGripVertical className="text-purple-500" />
                Participants ({items.length})
              </h3>
              
              {/* Add Item */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem()}
                  className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Nom du participant..."
                />
                <button
                  type="button"
                  onClick={addItem}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-all"
                >
                  <FaPlus className="h-4 w-4" />
                  Ajouter
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {items.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">Aucun participant ajouté</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-700/30 rounded-lg hover:border-slate-600/50 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <FaGripVertical className="text-gray-600 h-4 w-4 cursor-move" />
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          {item.category && <p className="text-gray-400 text-xs">{item.category}</p>}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteItem(item.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Publish Status Toggle */}
            <div className="border-t border-slate-700/30 pt-7">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                {tournament.status === 'LIVE' ? (
                  <FaToggleOn className="text-green-500" />
                ) : (
                  <FaToggleOff className="text-yellow-500" />
                )}
                Statut du Tournoi
              </h3>
              <div className="bg-slate-900/50 border border-slate-700/30 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white font-semibold mb-1">État actuel: <span className={tournament.status === 'LIVE' ? 'text-green-400' : 'text-yellow-400'}>{tournament.status === 'SETUP' ? '⚙️ En préparation' : '🔴 En direct'}</span></p>
                    <p className="text-gray-400 text-sm">{tournament.status === 'SETUP' ? 'Le tournoi est privé et en phase de configuration' : 'Le tournoi est actif et visible aux utilisateurs'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handlePublishToggle}
                  disabled={isPublishing}
                  className={`w-full px-4 py-3 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    tournament.status === 'SETUP'
                      ? 'bg-green-600/30 hover:bg-green-600/50 border border-green-500/50 text-green-300 disabled:opacity-50'
                      : 'bg-orange-600/30 hover:bg-orange-600/50 border border-orange-500/50 text-orange-300 disabled:opacity-50'
                  }`}
                >
                  {isPublishing ? (
                    <>
                      <FaSpinner className="animate-spin h-4 w-4" />
                      <span>Mise à jour...</span>
                    </>
                  ) : (
                    <>
                      {tournament.status === 'SETUP' ? (
                        <>
                          <FaToggleOff className="h-4 w-4" />
                          <span>Publier le tournoi</span>
                        </>
                      ) : (
                        <>
                          <FaToggleOn className="h-4 w-4" />
                          <span>Dépublier le tournoi</span>
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Change Creator */}
            <div className="border-t border-slate-700/30 pt-7">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FaUser className="text-blue-500" />
                Créateur du Tournoi
              </h3>
              <div className="bg-slate-900/50 border border-slate-700/30 rounded-lg p-5">
                <div className="mb-4">
                  <p className="text-white font-semibold mb-1">Créateur actuel</p>
                  <p className="text-gray-400 text-sm">{tournament.createdBy?.email || 'N/A'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreatorModal(true)}
                  className="w-full px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 text-blue-300 font-semibold rounded-lg transition-all"
                >
                  <span>Changer le créateur</span>
                </button>
              </div>
            </div>

            {/* Activity Log */}
            {tournament.ActivityLog && tournament.ActivityLog.length > 0 && (
              <div className="border-t border-slate-700/30 pt-7">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FaClock className="text-gray-400" />
                  Historique d&apos;Activité
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {tournament.ActivityLog.map((log) => (
                    <div key={log.id} className="bg-slate-900/50 border border-slate-700/30 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-white font-semibold capitalize">{log.action.replace(/_/g, ' ')}</p>
                        <p className="text-gray-400 text-xs">{new Date(log.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      {log.description && <p className="text-gray-400 text-sm mb-2">{log.description}</p>}
                      {log.user && <p className="text-gray-500 text-xs">Par: {log.user.email}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Danger Zone */}
            <div className="border-t border-slate-700/30 pt-7">
              <h3 className="text-lg font-bold text-red-500 mb-4">⚠️ Zone Dangereuse</h3>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="w-full px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <FaTrash className="h-5 w-5" />
                Supprimer le tournoi
              </button>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSaving || !isFormValid}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95"
            >
              {isSaving ? (
                <>
                  <FaSpinner className="animate-spin h-5 w-5" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <FaSave className="h-5 w-5" />
                  <span>Enregistrer les modifications</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl max-w-md w-full p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <FaLink className="text-purple-400" />
                Partager ce tournoi
              </h2>
              <p className="text-gray-400 text-sm mb-6">Partagez le lien avec vos amis pour qu'ils puissent voir le tournoi en direct.</p>
              
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 mb-4">
                <p className="text-xs text-gray-400 mb-2">Lien du tournoi:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/tournaments/${tournamentId}`}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm font-mono"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-3 py-2 rounded font-semibold text-sm transition-all ${
                      copySuccess
                        ? 'bg-green-600 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {copySuccess ? '✓ Copié' : 'Copier'}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl max-w-md w-full p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-red-500 mb-3 flex items-center gap-2">
                <FaExclamationTriangle />
                Supprimer le tournoi?
              </h2>
              <p className="text-gray-300 mb-2">Vous êtes sur le point de supprimer:</p>
              <p className="text-white font-semibold mb-6 p-3 bg-slate-900/50 rounded-lg">{tournament?.title}</p>
              <p className="text-red-300 text-sm mb-6">⚠️ Cette action est irréversible! Tous les participants et les données du tournoi seront supprimés.</p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={deleteTournament}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                  {isDeleting ? (
                    <>
                      <FaSpinner className="animate-spin h-4 w-4" />
                      Suppression...
                    </>
                  ) : (
                    <>
                      <FaTrash className="h-4 w-4" />
                      Supprimer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Change Creator Modal */}
        {showCreatorModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl max-w-md w-full p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <FaUser className="text-blue-400" />
                Changer le Créateur
              </h2>
              <p className="text-gray-400 text-sm mb-6">Transférez la propriété du tournoi à un autre utilisateur en entrant son adresse email.</p>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">Email du nouveau créateur</label>
                <input
                  type="email"
                  value={newCreatorEmail}
                  onChange={(e) => setNewCreatorEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="user@example.com"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreatorModal(false);
                    setNewCreatorEmail('');
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleChangeCreator}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
          <p className="text-sm text-indigo-300">
            💡 <span className="font-semibold">Conseil:</span> Assurez-vous que votre titre et votre description sont clairs et attrayants pour les participants.
          </p>
        </div>
      </div>
    </div>
  );
}
