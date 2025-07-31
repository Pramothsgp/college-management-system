// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, Role } from '~/types/authTypes';
import { loginUser } from '~/api/auth.api';
import { decodeJWT } from '~/utils/decodeJWT';

const AuthContext = createContext<AuthContextType>({
  role: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) setRole(decodeJWT(token) as Role);
      } catch (e) {
        console.error('Error loading auth state', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthState();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginUser(email, password);
      setRole(response.role);
      await AsyncStorage.setItem('token', response.token);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
