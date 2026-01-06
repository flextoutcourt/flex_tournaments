export default function StatusPage() {
  const statuses = [
    { name: 'Site Web', status: 'Opérationnel', uptime: '99.98%' },
    { name: 'API', status: 'Opérationnel', uptime: '99.95%' },
    { name: 'Twitch Integration', status: 'Opérationnel', uptime: '100%' },
    { name: 'Base de Données', status: 'Opérationnel', uptime: '100%' },
  ];

  const incidents = [
    {
      date: '5 Janvier 2026',
      title: 'Maintenance planifiée',
      description: 'Maintenance de routine des serveurs. Durée: 30 minutes.',
      resolved: true,
    },
    {
      date: '2 Janvier 2026',
      title: 'Ralentissement temporaire',
      description: 'Pics de charge momentanés lors du nouvel an. Résolu après 15 minutes.',
      resolved: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-white leading-tight">
            État du Service
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Consultez l'état en temps réel de tous nos services et historique des incidents.
          </p>
        </div>
      </section>

      {/* Status Overview */}
      <section className="w-full max-w-4xl mx-auto px-4 py-16 flex-grow">
        <div className="mb-12">
          <h2 className="text-3xl font-black text-white mb-6">Statut Global</h2>
          <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 border-2 border-green-400/50 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-2xl font-black text-green-300">Tous les services sont opérationnels</h3>
            </div>
            <p className="text-green-200">Dernière vérification: À l'instant</p>
          </div>
        </div>

        {/* Services Status */}
        <div className="mb-12">
          <h2 className="text-3xl font-black text-white mb-6">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {statuses.map((service) => (
              <div key={service.name} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{service.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-sm font-semibold">{service.status}</span>
                  </div>
                </div>
                <div className="text-gray-400">
                  <p className="text-sm">Disponibilité: <span className="text-green-400 font-semibold">{service.uptime}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incidents */}
        <div>
          <h2 className="text-3xl font-black text-white mb-6">Historique des Incidents</h2>
          <div className="space-y-4">
            {incidents.map((incident, index) => (
              <div key={index} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">{incident.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{incident.date}</p>
                  </div>
                  {incident.resolved && (
                    <span className="px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-xs font-semibold">
                      Résolu
                    </span>
                  )}
                </div>
                <p className="text-gray-300">{incident.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Subscribe Section */}
        <div className="mt-16 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-black text-white mb-3">Restez Informé</h3>
          <p className="text-gray-400 mb-6">
            Recevez des notifications en cas de maintenance ou de problème de service.
          </p>
          <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105">
            S'abonner aux Mises à Jour
          </button>
        </div>
      </section>
    </div>
  );
}
