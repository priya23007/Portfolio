import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { portfolioApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('portfolio_admin_token') || null);
  const [admin, setAdmin] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const currentToken = localStorage.getItem('portfolio_admin_token');
    if (!currentToken) {
      setAdmin(null);
      setSystemStatus(null);
      setLoading(false);
      return;
    }
    try {
      const data = await portfolioApi.getProfile();
      setAdmin({ email: data.email, createdAt: data.createdAt });
      setSystemStatus(data.systemStatus);
    } catch (err) {
      localStorage.removeItem('portfolio_admin_token');
      setToken(null);
      setAdmin(null);
      setSystemStatus(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();

    const handleAuthExpired = () => {
      setToken(null);
      setAdmin(null);
    };

    window.addEventListener('auth_expired', handleAuthExpired);
    return () => window.removeEventListener('auth_expired', handleAuthExpired);
  }, [fetchProfile]);

  const login = async (email, password) => {
    const res = await portfolioApi.login(email, password);
    localStorage.setItem('portfolio_admin_token', res.accessToken);
    setToken(res.accessToken);
    await fetchProfile();
    return res;
  };

  const logout = () => {
    localStorage.removeItem('portfolio_admin_token');
    setToken(null);
    setAdmin(null);
    setSystemStatus(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        systemStatus,
        isAuthenticated: !!token && !!admin,
        loading,
        login,
        logout,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
