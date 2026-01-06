// app/admin/logs/page.tsx
import { auth } from '@/lib/auth';
import { AdminService } from '@/services/adminService';
import { getActivityLogs } from '@/services/logService';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowLeft, FaSearch, FaFilter, FaClock, FaUser, FaTag } from 'react-icons/fa';

export default async function AdminLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    action?: string; 
    userId?: string; 
    entityType?: string; 
    page?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: string 
  }>;
}) {
  const session = await auth();

  // Check if user is admin
  if (!session || !session.user) {
    notFound();
  }

  const isAdmin = await AdminService.isAdmin(session.user.id);
  if (!isAdmin) {
    notFound();
  }

  const params = await searchParams;
  const limit = Math.min(parseInt(params.limit || '100'), 500);

  // Parse date filters
  const dateFrom = params.dateFrom ? new Date(params.dateFrom) : undefined;
  const dateTo = params.dateTo ? new Date(params.dateTo) : undefined;

  // Get logs with filters
  const logs = await getActivityLogs(limit, {
    action: params.action,
    userId: params.userId,
    entityType: params.entityType,
    startDate: dateFrom,
    endDate: dateTo,
  });

  // Group actions by category for better organization
  const actionsByCategory = {
    'Page & Navigation': [
      'page_viewed',
      'page_navigated',
    ],
    'Clicks & Interactions': ['element_clicked'],
    'Tournament': ['tournament_created', 'tournament_published', 'tournament_category_selected'],
    'Admin': ['admin_panel_viewed', 'app_initialized'],
  };

  const flatActions = Object.values(actionsByCategory).flat();
  const entityTypes = ['tournament', 'item', 'user'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      <div className="container mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-4"
          >
            <FaArrowLeft className="h-4 w-4" />
            Retour à l'administration
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-2">
            Journaux d'Activité
          </h1>
          <p className="text-gray-400">Consultez l'historique de toutes les actions utilisateur</p>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-purple-400" />
            <h2 className="font-bold text-white">Filtres</h2>
          </div>
          
          <form method="get" className="space-y-4">
            {/* First row: Action, Entity Type, Limit */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Action filter with grouped options */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Action</label>
                <select
                  name="action"
                  defaultValue={params.action || ''}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Toutes les actions</option>
                  {Object.entries(actionsByCategory).map(([category, categoryActions]) => (
                    <optgroup key={category} label={category}>
                      {categoryActions.map((action) => (
                        <option key={action} value={action}>
                          {action.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Entity Type filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type d'entité</label>
                <select
                  name="entityType"
                  defaultValue={params.entityType || ''}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Tous les types</option>
                  {entityTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Limite</label>
                <select
                  name="limit"
                  defaultValue={params.limit || '100'}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="250">250</option>
                  <option value="500">500</option>
                </select>
              </div>
            </div>

            {/* Second row: Date range filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date de début</label>
                <input
                  type="datetime-local"
                  name="dateFrom"
                  defaultValue={params.dateFrom || ''}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date de fin</label>
                <input
                  type="datetime-local"
                  name="dateTo"
                  defaultValue={params.dateTo || ''}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              <FaSearch className="h-4 w-4" />
              Appliquer les filtres
            </button>
          </form>
        </div>

        {/* Logs Table */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden backdrop-blur-sm">
          {logs.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              Aucun log trouvé avec ces critères
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-800 border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-300 font-semibold">Date/Heure</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-semibold">Utilisateur</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-semibold">Action</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-semibold">Description</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-semibold">Entité</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-semibold">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {logs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3 text-gray-300">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-gray-500 text-xs" />
                          <span>
                            {new Date(log.createdAt).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {log.user ? (
                          <div className="flex items-center gap-2">
                            <FaUser className="text-purple-400 text-xs" />
                            <div>
                              <div className="font-medium">{log.user.email}</div>
                              {log.user.name && (
                                <div className="text-xs text-gray-500">{log.user.name}</div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500 italic">Anonyme</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-medium border border-indigo-500/30">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 max-w-xs truncate">
                        {log.description || '-'}
                      </td>
                      <td className="px-4 py-3">
                        {log.entityType ? (
                          <div className="flex items-center gap-2">
                            <FaTag className="text-gray-500 text-xs" />
                            <span className="text-gray-300">
                              {log.entityType}
                              {log.entityId && (
                                <span className="text-gray-500 text-xs ml-1">
                                  ({log.entityId.slice(0, 8)}...)
                                </span>
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {log.ipAddress || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 text-sm text-gray-400 text-center">
          Affichage de {logs.length} log{logs.length > 1 ? 's' : ''} (limité à {limit})
        </div>
      </div>
    </div>
  );
}
