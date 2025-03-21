
import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/lib/api";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    username?: string;
    role?: string;
    avatar?: string;
  } | null;
  loading: boolean;
}

interface AuthContextProps extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const user = localStorage.getItem("auth_user");
    
    if (token && user) {
      try {
        setState({
          isAuthenticated: true,
          user: JSON.parse(user),
          loading: false,
        });
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        setState({ ...state, loading: false });
      }
    } else {
      setState({ ...state, loading: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user, token } = await loginUser(email, password);
      
      // Store auth in localStorage
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
      
      setState({
        isAuthenticated: true,
        user,
        loading: false,
      });
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username || user.email}!`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to login";
      toast({
        variant: "destructive",
        title: "Login failed",
        description: message,
      });
      throw error;
    }
  };

  const logout = () => {
    // Clear auth from localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    
    setState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
