import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api.service';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGithub: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  handleGitHubCallback: (token: string) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load user data from localStorage on startup
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      apiService.setAuthToken(savedToken);
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await apiService.get<User>('/auth/me');
      setUser(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
      setError('Session expired. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.post<{ token: string; user: User }>('/auth/login', {
        email,
        password
      });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      apiService.setAuthToken(token);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await apiService.post<{ token: string; user: User }>('/auth/register', {
        name,
        email,
        password
      });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      apiService.setAuthToken(token);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const handleGitHubCallback = (token: string) => {
    setToken(token);
    localStorage.setItem('token', token);
    apiService.setAuthToken(token);
    fetchUser();
  };

  const loginWithGithub = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/github/login`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('token');
    apiService.clearAuthToken();
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        loginWithGithub,
        register,
        logout,
        handleGitHubCallback,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};