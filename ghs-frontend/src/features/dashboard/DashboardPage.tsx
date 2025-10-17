import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const data = [
  { name: 'Jan', demandes: 12, approuvées: 8, rejetées: 2 },
  { name: 'Fév', demandes: 15, approuvées: 10, rejetées: 1 },
  { name: 'Mar', demandes: 8, approuvées: 7, rejetées: 0 },
  { name: 'Avr', demandes: 18, approuvées: 15, rejetées: 1 },
  { name: 'Mai', demandes: 10, approuvées: 8, rejetées: 1 },
  { name: 'Juin', demandes: 14, approuvées: 12, rejetées: 1 },
];

const stats = [
  { name: 'En attente', value: '5', icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Approuvées', value: '12', icon: CheckCircle, color: 'bg-green-100 text-green-600' },
  { name: 'Rejetées', value: '2', icon: XCircle, color: 'bg-red-100 text-red-600' },
  { name: 'En retard', value: '3', icon: AlertTriangle, color: 'bg-orange-100 text-orange-600' },
];

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-gray-500">Aperçu de vos activités et statistiques</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stat.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Graphique */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Activité des demandes (6 derniers mois)</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="demandes" fill="#3B82F6" name="Demandes" />
              <Bar dataKey="approuvées" fill="#10B981" name="Approuvées" />
              <Bar dataKey="rejetées" fill="#EF4444" name="Rejetées" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
