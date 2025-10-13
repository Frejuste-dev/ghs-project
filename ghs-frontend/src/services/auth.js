import api from './api';

export const authService = {
  // Connexion
  async login(credentials) {
    // Utiliser URLSearchParams pour un encodage x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);

    const response = await api.post('/auth/login', params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    const { access_token, user } = response.data;
    
    // Stocker le token et les infos utilisateur
    localStorage.setItem('authToken', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  // Déconnexion
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Récupérer les infos de l'utilisateur connecté
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  // Récupérer l'utilisateur depuis le localStorage
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Vérifier les permissions
  hasPermission(requiredProfiles) {
    const user = this.getUser();
    if (!user) return false;
    
    if (Array.isArray(requiredProfiles)) {
      return requiredProfiles.includes(user.profile);
    }
    
    return user.profile === requiredProfiles;
  },
};