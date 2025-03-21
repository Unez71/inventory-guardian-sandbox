
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { loginUser as loginApi } from '@/lib/api';
import { AuthState, User } from '@/types';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'inventory_auth_token';
const USER_KEY = 'inventory_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // Check for stored authentication on mount
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        setState({
          user,
          token: storedToken,
          isAuthenticated: true,
          loading: false,
        });
      } catch (error) {
        // Invalid stored data, clean up
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setState({ ...state, loading: false });
      }
    } else {
      setState({ ...state, loading: false });
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setState({ ...state, loading: true });
      const { user, token } = await loginApi(username, password);
      
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      setState({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      });
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to login';
      toast({
        variant: "destructive",
        title: "Login failed",
        description: message,
      });
      setState({ ...state, loading: false });
    }
  };

  const logout = async () => {
    try {
      setState({ ...state, loading: true });
      // We don't have a logoutApi function, so we'll just handle it client-side
      
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      });
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout. Please try again.",
      });
      setState({ ...state, loading: false });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
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
