// src/lib/api.ts
import axios from 'axios';
import { toast } from 'sonner';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Rediriger vers la page de connexion en cas d'erreur 401
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.message || 'Une erreur est survenue';
    toast.error(message);
    
    return Promise.reject(error);
  }
);