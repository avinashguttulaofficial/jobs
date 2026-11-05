import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { DataStore } from '../services/store';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password?: string) => { success: boolean; user?: UserProfile; error?: string };
  register: (data: { email: string; full_name: string; headline?: string; location?: string }) => {
    success: boolean;
    user?: UserProfile;
    error?: string;
  };
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  switchDemoRole: (role: 'seeker' | 'admin' | 'superadmin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => DataStore.getCurrentUser());

  useEffect(() => {
    const unsubscribe = DataStore.subscribe(() => {
      setUser(DataStore.getCurrentUser());
    });
    return unsubscribe;
  }, []);

  const login = (email: string, password?: string) => {
    const res = DataStore.login(email, password);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const register = (data: { email: string; full_name: string; headline?: string; location?: string }) => {
    const res = DataStore.register(data);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    DataStore.logout();
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = DataStore.updateProfile(user.id, updates);
    setUser(updated);
  };

  const switchDemoRole = (role: 'seeker' | 'admin' | 'superadmin') => {
    const users = DataStore.getUsers();
    if (role === 'admin') {
      const admin = users.find((u) => u.role === 'admin');
      if (admin) {
        DataStore.setCurrentUser(admin);
        setUser(admin);
      }
    } else if (role === 'superadmin') {
      const superadmin = users.find((u) => u.role === 'super_admin');
      if (superadmin) {
        DataStore.setCurrentUser(superadmin);
        setUser(superadmin);
      }
    } else {
      const seeker = users.find((u) => u.role === 'user');
      if (seeker) {
        DataStore.setCurrentUser(seeker);
        setUser(seeker);
      }
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isSuperAdmin,
        login,
        register,
        logout,
        updateProfile,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
