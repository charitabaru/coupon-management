// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/services/api';

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token') || null
  );
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
    
      const response = await authAPI.login(email, password);
      
      if (response.token) {
        console.log('Received token:', response.token);
        localStorage.setItem('token', response.token);
        setToken(response.token);
        console.log('Stored token:', localStorage.getItem('token'));
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/admin');
  };

  const value = {
    token,
    login,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};