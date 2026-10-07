import { createContext, useEffect, useState, type ReactNode } from 'react';
import * as authApi from '../Api/auth.api';
import type { User } from '../types/Auth';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nom: string, prenom: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('accessToken', response.accessToken);
    setUser(response.user);
  };

  const register = async (nom: string, prenom: string, email: string, password: string) => {
    const response = await authApi.register({ nom, prenom, email, password, roleId: 1 });
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('accessToken', response.accessToken);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}