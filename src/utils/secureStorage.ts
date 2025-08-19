import { encryptData, decryptData } from './security';
import Cookies from 'js-cookie';

// Secure storage configuration
const STORAGE_CONFIG = {
  TOKEN_KEY: 'yapi_auth_token',
  USER_KEY: 'yapi_user_data',
  SESSION_KEY: 'yapi_session',
  COOKIE_EXPIRES: 7, // 7 days
  SECURE_COOKIES: true,
};

// Secure localStorage wrapper dengan encryption
export class SecureLocalStorage {
  private static instance: SecureLocalStorage;

  static getInstance(): SecureLocalStorage {
    if (!SecureLocalStorage.instance) {
      SecureLocalStorage.instance = new SecureLocalStorage();
    }
    return SecureLocalStorage.instance;
  }

  // Set encrypted data
  setItem(key: string, value: any): void {
    try {
      const encryptedValue = encryptData(JSON.stringify(value));
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Failed to encrypt data:', error);
      // Fallback to plain storage for non-sensitive data
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  // Get decrypted data
  getItem<T>(key: string): T | null {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;

      // Try to decrypt first
      try {
        const decryptedValue = decryptData(encryptedValue);
        return JSON.parse(decryptedValue);
      } catch (decryptError) {
        console.log(
          'Decryption failed, clearing corrupted data:',
          decryptError
        );
        // If decryption fails, clear corrupted data
        localStorage.removeItem(key);
        return null;
      }
    } catch (error) {
      console.error('Failed to get data:', error);
      // Clear corrupted data
      localStorage.removeItem(key);
      return null;
    }
  }

  // Remove item
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all data
  clear(): void {
    localStorage.clear();
  }

  // Check if key exists
  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}

// Secure cookie storage
export class SecureCookieStorage {
  private static instance: SecureCookieStorage;

  static getInstance(): SecureCookieStorage {
    if (!SecureCookieStorage.instance) {
      SecureCookieStorage.instance = new SecureCookieStorage();
    }
    return SecureCookieStorage.instance;
  }

  // Set secure cookie
  setCookie(key: string, value: any, options?: Cookies.CookieAttributes): void {
    try {
      const encryptedValue = encryptData(JSON.stringify(value));
      const cookieOptions: Cookies.CookieAttributes = {
        expires: STORAGE_CONFIG.COOKIE_EXPIRES,
        secure: STORAGE_CONFIG.SECURE_COOKIES,
        sameSite: 'strict',
        ...options,
      };

      Cookies.set(key, encryptedValue, cookieOptions);
    } catch (error) {
      console.error('Failed to set secure cookie:', error);
      // Fallback to plain cookie
      Cookies.set(key, JSON.stringify(value), options);
    }
  }

  // Get secure cookie
  getCookie<T>(key: string): T | null {
    try {
      const encryptedValue = Cookies.get(key);
      if (!encryptedValue) return null;

      const decryptedValue = decryptData(encryptedValue);
      return JSON.parse(decryptedValue);
    } catch (error) {
      console.error('Failed to decrypt cookie:', error);
      // Fallback to plain cookie
      try {
        const plainValue = Cookies.get(key);
        return plainValue ? JSON.parse(plainValue) : null;
      } catch {
        return null;
      }
    }
  }

  // Remove cookie
  removeCookie(key: string): void {
    Cookies.remove(key);
  }

  // Check if cookie exists
  hasCookie(key: string): boolean {
    return Cookies.get(key) !== undefined;
  }
}

// Auth token management
export class AuthTokenManager {
  private static instance: AuthTokenManager;
  private secureStorage = SecureLocalStorage.getInstance();
  private secureCookies = SecureCookieStorage.getInstance();

  static getInstance(): AuthTokenManager {
    if (!AuthTokenManager.instance) {
      AuthTokenManager.instance = new AuthTokenManager();
    }
    return AuthTokenManager.instance;
  }

  // Set auth token
  setAuthToken(token: string): void {
    this.secureStorage.setItem(STORAGE_CONFIG.TOKEN_KEY, token);
    this.secureCookies.setCookie(STORAGE_CONFIG.TOKEN_KEY, token);
  }

  // Get auth token
  getAuthToken(): string | null {
    // Try localStorage first, then cookies
    let token = this.secureStorage.getItem<string>(STORAGE_CONFIG.TOKEN_KEY);
    if (!token) {
      token = this.secureCookies.getCookie<string>(STORAGE_CONFIG.TOKEN_KEY);
    }
    return token;
  }

  // Remove auth token
  removeAuthToken(): void {
    this.secureStorage.removeItem(STORAGE_CONFIG.TOKEN_KEY);
    this.secureCookies.removeCookie(STORAGE_CONFIG.TOKEN_KEY);
  }

  // Check if token exists
  hasAuthToken(): boolean {
    return this.getAuthToken() !== null;
  }

  // Check if token is valid (basic check)
  isTokenValid(token: string): boolean {
    if (!token) return false;

    try {
      // Basic JWT structure validation
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      // Check if token is not expired (if it's a JWT)
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}

// User data management
export class UserDataManager {
  private static instance: UserDataManager;
  private secureStorage = SecureLocalStorage.getInstance();

  static getInstance(): UserDataManager {
    if (!UserDataManager.instance) {
      UserDataManager.instance = new UserDataManager();
    }
    return UserDataManager.instance;
  }

  // Set user data
  setUserData(userData: any): void {
    this.secureStorage.setItem(STORAGE_CONFIG.USER_KEY, userData);
  }

  // Get user data
  getUserData<T>(): T | null {
    return this.secureStorage.getItem<T>(STORAGE_CONFIG.USER_KEY);
  }

  // Remove user data
  removeUserData(): void {
    this.secureStorage.removeItem(STORAGE_CONFIG.USER_KEY);
  }

  // Check if user data exists
  hasUserData(): boolean {
    return this.secureStorage.hasItem(STORAGE_CONFIG.USER_KEY);
  }
}

// Session management
export class SessionManager {
  private static instance: SessionManager;
  private secureStorage = SecureLocalStorage.getInstance();
  private sessionStartTime: number = Date.now();

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  // Start new session
  startSession(): void {
    this.sessionStartTime = Date.now();
    this.secureStorage.setItem(STORAGE_CONFIG.SESSION_KEY, {
      startTime: this.sessionStartTime,
      lastActivity: this.sessionStartTime,
    });
  }

  // Update session activity
  updateSessionActivity(): void {
    const sessionData = this.secureStorage.getItem<{
      startTime: number;
      lastActivity: number;
    }>(STORAGE_CONFIG.SESSION_KEY);

    if (sessionData) {
      sessionData.lastActivity = Date.now();
      this.secureStorage.setItem(STORAGE_CONFIG.SESSION_KEY, sessionData);
    }
  }

  // Get session info
  getSessionInfo(): {
    startTime: number;
    lastActivity: number;
    duration: number;
  } | null {
    const sessionData = this.secureStorage.getItem<{
      startTime: number;
      lastActivity: number;
    }>(STORAGE_CONFIG.SESSION_KEY);

    if (!sessionData) return null;

    return {
      ...sessionData,
      duration: Date.now() - sessionData.startTime,
    };
  }

  // End session
  endSession(): void {
    this.secureStorage.removeItem(STORAGE_CONFIG.SESSION_KEY);
    this.sessionStartTime = 0;
  }

  // Check if session is active
  isSessionActive(): boolean {
    const sessionData = this.getSessionInfo();
    if (!sessionData) return false;

    // Session expires after 30 minutes of inactivity
    const inactiveThreshold = 30 * 60 * 1000; // 30 minutes
    return Date.now() - sessionData.lastActivity < inactiveThreshold;
  }

  // Get session timeout (30 minutes)
  getSessionTimeout(): number {
    return 30 * 60 * 1000; // 30 minutes in milliseconds
  }
}

// Utility function to clear all secure storage
export const clearAllSecureStorage = () => {
  try {
    // Clear localStorage
    localStorage.clear();

    // Clear cookies
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });

    console.log('✅ All secure storage cleared successfully');
  } catch (error) {
    console.error('❌ Failed to clear secure storage:', error);
  }
};

export default {
  SecureLocalStorage,
  SecureCookieStorage,
  AuthTokenManager,
  UserDataManager,
  SessionManager,
  clearAllSecureStorage,
};
