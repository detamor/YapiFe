import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { User } from '../types';
import { authService, LoginData, RegisterData } from '../services/auth';
import {
  AuthTokenManager,
  UserDataManager,
  SessionManager,
  clearAllSecureStorage,
} from '../utils/secureStorage';
import { LoginRateLimiter } from '../utils/security';

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
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Initialize security managers
  const tokenManager = AuthTokenManager.getInstance();
  const userDataManager = UserDataManager.getInstance();
  const sessionManager = SessionManager.getInstance();
  const rateLimiter = new LoginRateLimiter();

  useEffect(() => {
    const initAuth = async () => {
      console.log('🔍 Initializing auth...');

      // Clear corrupted storage on first load
      if (localStorage.getItem('storage_initialized') !== 'true') {
        console.log('🧹 First time load, clearing corrupted storage...');
        clearAllSecureStorage();
        localStorage.setItem('storage_initialized', 'true');
      }

      const token = tokenManager.getAuthToken();
      const userData = userDataManager.getUserData<User>();

      console.log('🔑 Auth check:', {
        hasToken: !!token,
        tokenLength: token?.length,
        hasUserData: !!userData,
        userData: userData,
      });

      if (token && userData && tokenManager.isTokenValid(token)) {
        try {
          const response = await authService.getProfile();
          setUser(response.data);
          userDataManager.setUserData(response.data);
          sessionManager.startSession();
        } catch (error) {
          console.log(
            'Profile fetch failed, using secure storage data:',
            error
          );
          // Fallback to secure storage data
          try {
            setUser(userData);
            sessionManager.startSession();
          } catch (parseError) {
            console.log(
              'Failed to get user data from secure storage, clearing auth'
            );
            tokenManager.removeAuthToken();
            userDataManager.removeUserData();
            sessionManager.endSession();
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginData) => {
    // Check rate limiting (disabled for development)
    const isDevelopment = import.meta.env.MODE === 'development';
    if (!isDevelopment && rateLimiter.isBlocked(data.email)) {
      throw new Error(
        'Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.'
      );
    }

    try {
      const response = await authService.login(data);

      console.log('🔍 Full login response:', {
        response: response,
        data: response.data,
        success: response.success,
        message: response.message,
        dataKeys: Object.keys(response.data || {}),
        userData: response.data?.user,
        tokenData: response.data?.access_token,
      });

      // Try different possible token field names
      const userData = response.data?.user || response.data?.userData;
      const access_token =
        response.data?.access_token ||
        response.data?.token ||
        response.data?.accessToken ||
        response.data?.authToken;

      console.log('🔐 Login successful:', {
        userData,
        tokenLength: access_token?.length,
        tokenPreview: access_token
          ? access_token.substring(0, 20) + '...'
          : 'none',
      });

      // Check if we have valid data
      if (!userData) {
        throw new Error('Data user tidak valid dari server');
      }

      if (!access_token) {
        console.warn('⚠️ No access token received, but login was successful');
        // Continue without token for now
      }

      // Store data securely
      if (access_token) {
        tokenManager.setAuthToken(access_token);
      }
      userDataManager.setUserData(userData);
      sessionManager.startSession();

      // Reset rate limiting on successful login
      rateLimiter.resetAttempts(data.email);
      setLoginAttempts(0);

      setUser(userData);
    } catch (error) {
      // Record failed login attempt (disabled for development)
      const isDevelopment = import.meta.env.MODE === 'development';
      if (!isDevelopment) {
        rateLimiter.recordAttempt(data.email);
        setLoginAttempts((prev) => prev + 1);

        // Check if user is blocked
        if (rateLimiter.isBlocked(data.email)) {
          throw new Error(
            'Akun Anda diblokir sementara karena terlalu banyak percobaan login gagal.'
          );
        }
      }

      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    const response = await authService.register(data);
    const { user: userData, access_token } = response.data;

    // Store data securely
    tokenManager.setAuthToken(access_token);
    userDataManager.setUserData(userData);
    sessionManager.startSession();

    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.log('Logout API failed, clearing secure data anyway:', error);
    } finally {
      // Clear all secure data
      tokenManager.removeAuthToken();
      userDataManager.removeUserData();
      sessionManager.endSession();
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
