import React, { useState, useMemo } from 'react';
import { useMyRequests } from '../hooks/useRequest';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Link } from 'react-router-dom';
import {
  Plus,
  Filter,
  Download,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const MyRequests = () => {
  const { data: requests = [], isLoading } = useMyRequests();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
      const matchesSearch = searchTerm === '' ||
        request.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(request.requestDate).toLocaleDateString('fr-FR').includes(searchTerm);
      return matchesStatus && matchesSearch;
    });
  }, [requests, filterStatus, searchTerm]);

  const stats = useMemo(() => ({
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    approved: requests.filter(r => r.status === 'Approved').length,
    rejected: requests.filter(r => r.status === 'Rejected').length,
  }), [requests]);

  const columns = [
    {
      header: 'Date',
      accessor: 'requestDate',
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{new Date(row.requestDate).toLocaleDateString('fr-FR')}</span>
        </div>
      ),
    },
    {
      header: 'Horaires',
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{row.startAt} - {row.endAt}</span>
        </div>
      ),
    },
    {
      header: 'Statut',
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Commentaire',
      accessor: 'comment',
      cell: (row) => row.comment ? (
        <span className="text-gray-600 truncate max-w-xs block" title={row.comment}>
          {row.comment}
        </span>
      ) : (
        <span className="text-gray-400">-</span>
      ),
    },
    {
      header: 'Créé le',
      cell: (row) => new Date(row.createdAt).toLocaleDateString('fr-FR'),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes demandes</h1>
          <p className="mt-2 text-base text-gray-600">
            Gérez vos demandes d'heures supplémentaires
          </p>
        </div>
        <Link to="/new-request">
          <Button className="btn-primary hover-lift shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle demande
          </Button>
        </Link>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card hover-lift animate-slide-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Total</p>
              <p className="stat-value text-blue-600">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="stat-card hover-lift animate-slide-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">En attente</p>
              <p className="stat-value text-yellow-600">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="stat-card hover-lift animate-slide-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Approuvées</p>
              <p className="stat-value text-green-600">{stats.approved}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="stat-card hover-lift animate-slide-in-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Rejetées</p>
              <p className="stat-value text-red-600">{stats.rejected}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card className="p-6 animate-slide-in-up" style={{ animationDelay: '500ms' }}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par date ou commentaire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full pl-10"
              />
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input min-w-40"
            >
              <option value="all">Tous les statuts</option>
              <option value="Pending">En attente</option>
              <option value="Approved">Approuvées</option>
              <option value="Rejected">Rejetées</option>
            </select>
            <Button variant="ghost" className="hover-lift">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </Card>

      {/* Tableau des demandes */}
      <Card className="animate-slide-in-up" style={{ animationDelay: '600ms' }}>
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Liste des demandes ({filteredRequests.length})
          </h2>
        </div>
        <Table
          columns={columns}
          data={filteredRequests}
          loading={isLoading}
          emptyMessage="Aucune demande trouvée"
        />
      </Card>
    </div>
  );
};

export default MyRequests;
