// AI Professor Auth Module
const aiProfessorAuth = {
  isAuthenticated() {
    if (typeof COSMOS_AUTH !== 'undefined') return COSMOS_AUTH.isAuthenticated();
    return !!(localStorage.getItem('cosmos_token') && localStorage.getItem('cosmos_user'));
  },
  
  getUserInfo() {
    if (typeof COSMOS_AUTH !== 'undefined') return COSMOS_AUTH.getUser();
    try {
      const user = localStorage.getItem('cosmos_user');
      return user ? JSON.parse(user) : null;
    } catch { return null; }
  },
  
  logout() {
    if (typeof COSMOS_AUTH !== 'undefined') COSMOS_AUTH.logout();
    else {
      localStorage.removeItem('cosmos_token');
      localStorage.removeItem('cosmos_user');
      location.reload();
    }
  }
};
