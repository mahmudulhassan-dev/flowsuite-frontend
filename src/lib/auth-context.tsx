'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from './api';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  organizationId: string;
  isSuperAdmin: boolean;
}

interface Workspace {
  id: string;
  name: string;
  organizationId: string;
}

interface AuthContextType {
  user: User | null;
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, orgName: string, password: string) => Promise<void>;
  logout: () => void;
  switchWorkspace: (workspaceId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('fs_token');
      if (!token) {
        setLoading(false);
        if (pathname?.startsWith('/panel')) {
          router.push('/auth/login');
        }
        return;
      }

      try {
        const data = await api.get<{ user: User; activeWorkspaceId: string; workspaces: Workspace[] }>('/api/v1/auth/me');
        setUser(data.user);
        setWorkspaces(data.workspaces);
        setActiveWorkspaceId(localStorage.getItem('fs_active_workspace') || data.activeWorkspaceId);
      } catch (err) {
        console.error('Failed to load user session:', err);
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [pathname]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await api.post<{ user: User; token: string; workspaces: Workspace[] }>('/api/v1/auth/login', {
        email,
        password,
      });
      localStorage.setItem('fs_token', data.token);
      setUser(data.user);
      setWorkspaces(data.workspaces);
      if (data.workspaces.length > 0) {
        localStorage.setItem('fs_active_workspace', data.workspaces[0].id);
        setActiveWorkspaceId(data.workspaces[0].id);
      }
      router.push('/panel');
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const register = async (fullName: string, email: string, orgName: string, password: string) => {
    setLoading(true);
    try {
      const data = await api.post<{ user: User; token: string }>('/api/v1/auth/register', {
        fullName,
        email,
        organizationName: orgName,
        password,
      });
      localStorage.setItem('fs_token', data.token);
      
      // Fetch fresh session profile details immediately
      const profile = await api.get<{ user: User; activeWorkspaceId: string; workspaces: Workspace[] }>('/api/v1/auth/me');
      setUser(profile.user);
      setWorkspaces(profile.workspaces);
      localStorage.setItem('fs_active_workspace', profile.activeWorkspaceId);
      setActiveWorkspaceId(profile.activeWorkspaceId);
      
      router.push('/panel');
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('fs_token');
    localStorage.removeItem('fs_active_workspace');
    setUser(null);
    setWorkspaces([]);
    setActiveWorkspaceId(null);
    router.push('/auth/login');
  };

  const switchWorkspace = (workspaceId: string) => {
    localStorage.setItem('fs_active_workspace', workspaceId);
    setActiveWorkspaceId(workspaceId);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{
      user,
      workspaces,
      activeWorkspaceId,
      loading,
      login,
      register,
      logout,
      switchWorkspace
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
