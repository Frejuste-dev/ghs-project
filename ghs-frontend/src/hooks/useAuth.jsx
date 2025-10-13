import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Test mode: bypass auth fully
    if (import.meta.env.VITE_DISABLE_AUTH === 'true') {
      const mock = { username: 'tester', profile: 'admin' };
      setUser(mock);
      localStorage.setItem('user', JSON.stringify(mock));
      setLoading(false);
      return;
    }

    const init = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setUser(null);
          return;
        }
        // Validate token with backend and refresh user snapshot
        const me = await authService.getCurrentUser();
        localStorage.setItem('user', JSON.stringify(me));
        setUser(me);
      } catch (e) {
        // Invalid/expired token -> clear and unauthenticate
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (credentials) => {
    if (import.meta.env.VITE_DISABLE_AUTH === 'true') {
      const mock = { username: credentials?.username || 'tester', profile: 'admin' };
      setUser(mock);
      return { success: true };
    }
    try {
      const response = await authService.login(credentials);
      // authService.login stocke déjà authToken et user dans le localStorage
      setUser(response.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  };

  const logout = () => {
    if (import.meta.env.VITE_DISABLE_AUTH === 'true') {
      // no-op in test mode
      return;
    }
    authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    if (import.meta.env.VITE_DISABLE_AUTH === 'true') {
      return user;
    }
    try {
      const me = await authService.getCurrentUser();
      localStorage.setItem('user', JSON.stringify(me));
      setUser(me);
      return me;
    } catch (e) {
      authService.logout();
      setUser(null);
      throw e;
    }
  };

  const hasPermission = (requiredProfiles) => {
    return authService.hasPermission(requiredProfiles);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    refreshUser,
    hasPermission,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
