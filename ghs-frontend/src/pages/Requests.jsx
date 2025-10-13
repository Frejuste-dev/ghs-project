import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { requestService } from '../services/ghs';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Edit,
  Trash2
} from 'lucide-react';

const Requests = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Récupérer les demandes
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: requestService.getAll,
  });

  // Mutation pour créer une demande
  const createMutation = useMutation({
    mutationFn: requestService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Demande créée avec succès');
      setIsModalOpen(false);
      reset();
    },
    onError: () => {
      toast.error('Erreur lors de la création de la demande');
    },
  });

  // Mutation pour supprimer une demande
  const deleteMutation = useMutation({
    mutationFn: requestService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Demande supprimée avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    },
  });

  const onSubmit = (data) => {
    const requestData = {
      requestDate: data.requestDate,
      startAt: data.startAt,
      endAt: data.endAt,
      reason: data.reason,
      employeeID: user?.employeeID,
    };
    createMutation.mutate(requestData);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-5 h-5 text-success-600" />;
      case 'Rejected':
        return <XCircle className="w-5 h-5 text-danger-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-warning-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Approved':
        return 'Approuvée';
      case 'Rejected':
        return 'Rejetée';
      default:
        return 'En attente';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-success-100 text-success-800';
      case 'Rejected':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-warning-100 text-warning-800';
    }
  };

  const myRequests = (requests || []).filter((r) => r.employeeID === user?.employeeID);

  const computeDurationHours = (startAt, endAt) => {
    if (!startAt || !endAt) return '-';
    try {
      const [sh, sm] = String(startAt).split(':').map(Number);
      const [eh, em] = String(endAt).split(':').map(Number);
      const start = sh * 60 + (sm || 0);
      const end = eh * 60 + (em || 0);
      const diffMin = Math.max(0, end - start);
      const hours = (diffMin / 60).toFixed(1).replace(/\.0$/, '');
      return `${hours}h`;
    } catch {
      return '-';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes demandes</h1>
          <p className="text-gray-600">
            Gérez vos demandes d'heures supplémentaires
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle demande</span>
        </Button>
      </div>

      {/* Liste des demandes */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {new Date(request.requestDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {computeDurationHours(request.startAt, request.endAt)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">
                      {request.reason}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(request.status)}
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {request.status === 'Pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingRequest(request);
                              setIsModalOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(request.id)}
                            className="text-danger-600 hover:text-danger-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {myRequests.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune demande
              </h3>
              <p className="text-gray-600 mb-4">
                Vous n'avez pas encore créé de demande d'heures supplémentaires.
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                Créer ma première demande
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Modal de création/édition */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRequest(null);
          reset();
        }}
        title={editingRequest ? 'Modifier la demande' : 'Nouvelle demande'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Date de la demande</label>
            <input
              {...register('requestDate', { required: 'La date est requise' })}
              type="date"
              className="input"
              defaultValue={editingRequest?.requestDate}
            />
            {errors.requestDate && (
              <p className="mt-1 text-sm text-danger-600">{errors.requestDate.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Heure de début</label>
              <input
                {...register('startAt', { required: 'L\'heure de début est requise' })}
                type="time"
                className="input"
                defaultValue={editingRequest?.startAt}
              />
              {errors.startAt && (
                <p className="mt-1 text-sm text-danger-600">{errors.startAt.message}</p>
              )}
            </div>
            <div>
              <label className="label">Heure de fin</label>
              <input
                {...register('endAt', { required: 'L\'heure de fin est requise' })}
                type="time"
                className="input"
                defaultValue={editingRequest?.endAt}
              />
              {errors.endAt && (
                <p className="mt-1 text-sm text-danger-600">{errors.endAt.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="label">Motif</label>
            <textarea
              {...register('reason', { required: 'Le motif est requis' })}
              className="input"
              rows="3"
              placeholder="Décrivez la raison de cette demande..."
              defaultValue={editingRequest?.reason}
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-danger-600">{errors.reason.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingRequest(null);
                reset();
              }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              loading={createMutation.isLoading}
              disabled={createMutation.isLoading}
            >
              {editingRequest ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Requests;