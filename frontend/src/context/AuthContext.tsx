import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Page } from '../types';
import { api, fallbackUser } from '../services/api';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, targetRole: string, password?: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ai_coach_theme');
    return saved === 'dark';
  });

  // Check saved session on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.getProfile()
        .then(profile => {
          if (profile && profile.id) {
            setUser(profile);
          }
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          setUser(null);
        });
    } else {
      // Default initial presentation: Alex Rivera seeded user
      setUser(fallbackUser);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ai_coach_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ai_coach_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = async (email: string, password?: string) => {
    try {
      const res = await api.login(email, password || 'Password123!');
      setUser(res.user);
      showToast(`Welcome back, ${res.user.name}!`, 'success');
      setCurrentPage('dashboard');
    } catch (err: any) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
      throw err;
    }
  };

  const register = async (name: string, email: string, targetRole: string, password?: string) => {
    try {
      const res = await api.register(name, email, targetRole, password || 'Password123!');
      setUser(res.user);
      showToast(`Account created for ${res.user.name}!`, 'success');
      setCurrentPage('dashboard');
    } catch (err: any) {
      showToast(err.message || 'Registration failed. Please check provided details.', 'error');
      throw err;
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    showToast('Signed out of session.', 'info');
    setCurrentPage('landing');
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      const updated = await api.updateProfile(updates);
      setUser(updated);
      showToast('Profile updated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        currentPage,
        setCurrentPage,
        isDarkMode,
        toggleDarkMode,
        login,
        register,
        logout,
        updateUser,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
