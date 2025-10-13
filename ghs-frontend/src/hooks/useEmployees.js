import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '../services/ghs';
import toast from 'react-hot-toast';

export const useEmployees = (skip = 0, limit = 100) => {
  return useQuery({
    queryKey: ['employees', skip, limit],
    queryFn: () => employeeService.getEmployees(skip, limit),
  });
};

export const useEmployee = (id) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeeService.getEmployee(id),
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: employeeService.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employé créé avec succès');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Erreur lors de la création');
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => employeeService.updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employé mis à jour avec succès');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Erreur lors de la mise à jour');
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: employeeService.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employé supprimé avec succès');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Erreur lors de la suppression');
    },
  });
};
