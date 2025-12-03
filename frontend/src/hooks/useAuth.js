import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      const storedRole = localStorage.getItem('role');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (authToken, userData) => {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userData.roleName);
    
    setToken(authToken);
    setUser(userData);
    setRole(userData.roleName);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    
    setToken(null);
    setUser(null);
    setRole(null);
    
    navigate('/login');
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const isAdmin = () => {
    return role === 'Administrador';
  };

  const isClient = () => {
    return role === 'Usuario Normal';
  };

  const isReceptionist = () => {
    return role === 'Recepcionista';
  };

  const hasRole = (allowedRoles) => {
    if (!role) return false;
    return allowedRoles.includes(role);
  };

  return {
    user,
    token,
    role,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isClient,
    isReceptionist,
    hasRole,
    checkAuth,
  };
};
