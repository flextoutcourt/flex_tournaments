'use client';

import { useSession } from 'next-auth/react';
import { FaUser, FaShieldAlt, FaClock, FaInfoCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';

interface LoggedInUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
}

export function LoggedInAccountInfo() {
  const { data: session, status } = useSession();
  const [userDetails, setUserDetails] = useState<LoggedInUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserDetails();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status, session?.user?.id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/current-user');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des informations utilisateur');
      }
      const data = await response.json();
      setUserDetails(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  const roleColors = {
    SUPERADMIN: 'from-red-600 to-red-700',
    ADMIN: 'from-indigo-600 to-indigo-700',
    VIP: 'from-purple-600 to-purple-700',
    USER: 'from-slate-600 to-slate-700',
  };

  const roleBadgeColors = {
    SUPERADMIN: 'bg-red-500/20 text-red-300 border-red-500/30',
    ADMIN: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    VIP: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    USER: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  };

  const userRole = (userDetails?.role || session?.user?.role || 'USER') as keyof typeof roleColors;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="mb-8">
      <div className={`rounded-xl bg-gradient-to-br ${roleColors[userRole]} p-0.5`}>
        <div className="bg-slate-900 rounded-[10px] p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className={`p-4 bg-gradient-to-br ${roleColors[userRole]} rounded-lg shadow-lg`}>
                <FaUser className="text-white text-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-white truncate">
                    Compte actif: {userDetails?.email || session?.user?.email || 'Chargement...'}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${roleBadgeColors[userRole]} whitespace-nowrap`}>
                    {userRole}
                  </span>
                </div>
                {userDetails?.name && (
                  <p className="text-slate-400 text-sm mb-3">Nom: {userDetails.name}</p>
                )}

                {/* GDPR Compliance Info */}
                <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-2 text-sm">
                  {userDetails?.createdAt && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <FaClock className="text-slate-500 flex-shrink-0" />
                      <span>Compte créé le {formatDate(userDetails.createdAt)}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 text-slate-400 mt-3">
                    <FaInfoCircle className="text-slate-500 flex-shrink-0 mt-0.5" />
                    <span className="text-xs leading-relaxed">
                      <strong>Conformité RGPD:</strong> Cet écran affiche uniquement les données minimales nécessaires pour vérifier le compte actif. 
                      Seules les informations essentielles (email, nom, rôle, date de création) sont affichées. Aucune donnée sensible n'est stockée de manière persistante 
                      dans le navigateur. Les accès administrateur sont enregistrés dans les journaux d'audit pour la traçabilité.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-300 text-xs">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
