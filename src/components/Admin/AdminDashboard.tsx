'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaBan, FaCheck, FaSearch, FaExclamationCircle } from 'react-icons/fa';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  banned: boolean;
  bannedReason: string | null;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'VIP' | 'ADMIN' | 'SUPERADMIN';
}

export function AdminDashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'users' | 'create'>('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  });
  const [banReason, setBanReason] = useState('');
  const [showBanModal, setShowBanModal] = useState(false);

  // Redirect if not authenticated (middleware handles admin check)
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des utilisateurs');
      }
      const data = await response.json();
      setUsers(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création');
      }

      setSuccess('Utilisateur créé avec succès');
      setFormData({ name: '', email: '', password: '', role: 'USER' });
      setSelectedTab('users');
      await fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const updateData: any = {};
      if (formData.name !== editingUser.name) updateData.name = formData.name;
      if (formData.email !== editingUser.email) updateData.email = formData.email;
      if (formData.password) updateData.password = formData.password;
      if (formData.role !== editingUser.role) updateData.role = formData.role;

      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }

      setSuccess('Utilisateur mis à jour avec succès');
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'USER' });
      await fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setSuccess('Utilisateur supprimé avec succès');
      await fetchUsers();
      setSelectedUser(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleBanUser = async (userId: string) => {
    if (!banReason.trim()) {
      setError('Veuillez entrer une raison de bannissement');
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: banReason }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du bannissement');
      }

      setSuccess('Utilisateur banni avec succès');
      setBanReason('');
      setShowBanModal(false);
      await fetchUsers();
      setSelectedUser(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/unban`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Erreur lors du débannissement');
      }

      setSuccess('Utilisateur débanni avec succès');
      await fetchUsers();
      setSelectedUser(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setTimeout(() => setError(null), 5000);
    }
  };

  const startEditingUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email,
      password: '',
      role: user.role as 'USER' | 'VIP' | 'ADMIN' | 'SUPERADMIN',
    });
    setSelectedTab('create');
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-indigo-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-40 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl">
              <FaUsers className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400 text-sm mt-1">Gestion complète des utilisateurs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg flex items-start gap-3 animate-slideDown">
            <FaExclamationCircle className="text-lg mt-0.5 flex-shrink-0" />
            <div className="flex-1">{error}</div>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg flex items-start gap-3 animate-slideDown">
            <FaCheck className="text-lg mt-0.5 flex-shrink-0" />
            <div className="flex-1">{success}</div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setSelectedTab('users')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              selectedTab === 'users'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <FaUsers className="text-lg" />
            <span>Gérer les utilisateurs</span>
            <span className="ml-2 px-3 py-1 text-xs font-bold bg-white/10 rounded-full">
              {users.length}
            </span>
          </button>
          <button
            onClick={() => {
              setSelectedTab('create');
              setEditingUser(null);
              setFormData({ name: '', email: '', password: '', role: 'USER' });
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              selectedTab === 'create'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <FaPlus className="text-lg" />
            <span>{editingUser ? 'Modifier' : 'Créer'} un utilisateur</span>
          </button>
        </div>

        {/* Content */}
        {selectedTab === 'users' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Users List */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
                {/* Search Bar */}
                <div className="p-6 border-b border-slate-700/50">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom ou email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Users List */}
                <div className="divide-y divide-slate-700/50 max-h-[600px] overflow-y-auto">
                  {filteredUsers.length === 0 ? (
                    <div className="p-8 text-center">
                      <FaUsers className="text-4xl text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">Aucun utilisateur trouvé</p>
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`p-5 cursor-pointer hover:bg-slate-700/30 transition-all duration-200 ${
                          selectedUser?.id === user.id ? 'bg-indigo-600/20 border-l-2 border-indigo-600' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate">{user.name || 'Sans nom'}</h3>
                            <p className="text-sm text-slate-400 truncate">{user.email}</p>
                            <div className="mt-3 flex gap-2 flex-wrap">
                              <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                                user.role === 'SUPERADMIN'
                                  ? 'bg-red-500/20 text-red-400'
                                  : user.role === 'VIP'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {user.role}
                              </span>
                              {user.banned && (
                                <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-red-500/20 text-red-400">
                                  Banni
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* User Details */}
            {selectedUser && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 h-fit sticky top-32">
                <h3 className="text-lg font-bold text-white mb-6">Détails de l'utilisateur</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Email</label>
                    <p className="text-white font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Nom</label>
                    <p className="text-white font-medium">{selectedUser.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Rôle</label>
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                      selectedUser.role === 'SUPERADMIN'
                        ? 'bg-red-500/20 text-red-400'
                        : selectedUser.role === 'VIP'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {selectedUser.role}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Inscription</label>
                    <p className="text-slate-300 text-sm">
                      {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  {selectedUser.banned && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-2">Raison du ban</p>
                      <p className="text-red-300 text-sm">{selectedUser.bannedReason}</p>
                    </div>
                  )}

                  <div className="space-y-3 pt-6 border-t border-slate-700/50">
                    <button
                      onClick={() => startEditingUser(selectedUser)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-indigo-600/20"
                    >
                      <FaEdit />
                      Modifier
                    </button>

                    {selectedUser.banned ? (
                      <button
                        onClick={() => handleUnbanUser(selectedUser.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg font-medium border border-green-500/30 transition-all duration-200"
                      >
                        <FaCheck />
                        Débannir
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowBanModal(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 rounded-lg font-medium border border-orange-500/30 transition-all duration-200"
                      >
                        <FaBan />
                        Bannir
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteUser(selectedUser.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-medium border border-red-500/30 transition-all duration-200"
                    >
                      <FaTrash />
                      Supprimer
                    </button>
                  </div>
                </div>

                {/* Ban Modal */}
                {showBanModal && !selectedUser.banned && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full animate-scaleIn">
                      <h4 className="text-xl font-bold text-white mb-4">Bannir l'utilisateur</h4>
                      <p className="text-slate-400 mb-4">Entrez une raison pour le bannissement :</p>
                      <textarea
                        value={banReason}
                        onChange={(e) => setBanReason(e.target.value)}
                        placeholder="Ex: Violation des conditions d'utilisation..."
                        className="w-full p-3 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all mb-4 resize-none"
                        rows={4}
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setShowBanModal(false);
                            setBanReason('');
                          }}
                          className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => handleBanUser(selectedUser.id)}
                          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
                        >
                          Confirmer
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-2xl">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {editingUser ? 'Modifier un utilisateur' : 'Créer un nouvel utilisateur'}
                </h2>
                <p className="text-slate-400">
                  {editingUser
                    ? 'Modifiez les informations de l\'utilisateur ci-dessous'
                    : 'Remplissez le formulaire pour créer un nouveau compte utilisateur'}
                </p>
              </div>

              <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Nom complet</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Jean Dupont"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Adresse email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="utilisateur@example.com"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Mot de passe {editingUser && '(facultatif)'}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={editingUser ? 'Laisser vide pour ne pas modifier' : 'Minimum 6 caractères'}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required={!editingUser}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Rôle</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  >
                    <option value="USER">Utilisateur standard</option>
                    <option value="VIP">VIP</option>
                    <option value="SUPERADMIN">SuperAdmin</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-indigo-600/20"
                  >
                    {editingUser ? 'Mettre à jour' : 'Créer l\'utilisateur'}
                  </button>
                  {editingUser && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUser(null);
                        setFormData({ name: '', email: '', password: '', role: 'USER' });
                        setSelectedTab('users');
                      }}
                      className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all duration-200"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
