import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { User } from '../types';
import { authService, LoginData, RegisterData } from '../services/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          const response = await authService.getProfile();
          setUser(response.data);
        } catch (error) {
          console.log('Profile fetch failed, using localStorage data:', error);
          // Fallback to localStorage data instead of clearing everything
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
          } catch (parseError) {
            console.log(
              'Failed to parse localStorage user data, clearing auth'
            );
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginData) => {
    const response = await authService.login(data);
    const { user: userData, access_token } = response.data;

    console.log('🔐 Login successful:', {
      userData,
      tokenLength: access_token?.length,
      tokenPreview: access_token
        ? access_token.substring(0, 20) + '...'
        : 'none',
    });

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (data: RegisterData) => {
    const response = await authService.register(data);
    const { user: userData, access_token } = response.data;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.log('Logout API failed, clearing local data anyway:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
