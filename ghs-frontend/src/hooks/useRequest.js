import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestService } from '../services/ghs';
import toast from 'react-hot-toast';

export const useRequests = (skip = 0, limit = 100) => {
  return useQuery({
    queryKey: ['requests', skip, limit],
    queryFn: () => requestService.getRequests(skip, limit),
  });
};

export const useMyRequests = () => {
  return useQuery({ queryKey: ['myRequests'], queryFn: requestService.getMyRequests });
};

export const usePendingRequests = () => {
  return useQuery({ queryKey: ['pendingRequests'], queryFn: requestService.getPendingRequests });
};

export const useRequest = (id) => {
  return useQuery({
    queryKey: ['request', id],
    queryFn: () => requestService.getRequest(id),
    enabled: !!id,
  });
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: requestService.createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      toast.success('Demande créée avec succès');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Erreur lors de la création');
    },
  });
};

export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, level }) => requestService.approveRequest(id, level),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
      toast.success('Demande approuvée avec succès');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'approbation');
    },
  });
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: requestService.rejectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
      toast.success('Demande rejetée');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Erreur lors du rejet');
    },
  });
};