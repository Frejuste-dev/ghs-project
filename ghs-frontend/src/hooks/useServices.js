import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '../services/ghs';
import toast from 'react-hot-toast';

export const useServices = (skip = 0, limit = 100) => {
  return useQuery({
    queryKey: ['services', skip, limit],
    queryFn: () => serviceService.getServices(skip, limit),
  });
};

export const useService = (id) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => serviceService.getService(id),
    enabled: !!id,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: serviceService.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service créé avec succès');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Erreur lors de la création');
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => serviceService.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service mis à jour avec succès');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Erreur lors de la mise à jour');
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: serviceService.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service supprimé avec succès');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Erreur lors de la suppression');
    },
  });
};