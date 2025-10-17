// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { isAuthenticated, user, login, logout, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setLoading(false);
    };
    
    verifyAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  };
};