import DOMPurify from 'dompurify';
import CryptoJS from 'crypto-js';

// Security configuration
const SECURITY_CONFIG = {
  ENCRYPTION_KEY:
    import.meta.env.VITE_ENCRYPTION_KEY || 'yapi-medan-secure-key-2024',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
};

// Input sanitization untuk mencegah XSS
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};

// Input sanitization dengan HTML tags tertentu
export const sanitizeHTML = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['class'],
  });
};

// Encrypt sensitive data
export const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, SECURITY_CONFIG.ENCRYPTION_KEY).toString();
};

// Decrypt sensitive data
export const decryptData = (encryptedData: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(
      encryptedData,
      SECURITY_CONFIG.ENCRYPTION_KEY
    );
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};

// Generate secure random string
export const generateSecureToken = (length: number = 32): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Validate email format dengan regex yang aman
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Validate phone number format
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
  return phoneRegex.test(phone);
};

// Validate password strength
export const validatePassword = (
  password: string
): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  message: string;
} => {
  if (password.length < 8) {
    return {
      isValid: false,
      strength: 'weak',
      message: 'Password minimal 8 karakter',
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(
    Boolean
  ).length;

  if (score < 3) {
    return {
      isValid: false,
      strength: 'weak',
      message:
        'Password harus mengandung huruf besar, kecil, angka, dan karakter khusus',
    };
  }

  if (score === 3) {
    return {
      isValid: true,
      strength: 'medium',
      message: 'Password cukup kuat',
    };
  }

  return {
    isValid: true,
    strength: 'strong',
    message: 'Password sangat kuat',
  };
};

// Rate limiting untuk login attempts
export class LoginRateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> =
    new Map();

  isBlocked(identifier: string): boolean {
    const attempt = this.attempts.get(identifier);
    if (!attempt) return false;

    const now = Date.now();
    if (now - attempt.lastAttempt > SECURITY_CONFIG.LOCKOUT_DURATION) {
      this.attempts.delete(identifier);
      return false;
    }

    return attempt.count >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS;
  }

  recordAttempt(identifier: string): void {
    const attempt = this.attempts.get(identifier);
    const now = Date.now();

    if (attempt) {
      attempt.count++;
      attempt.lastAttempt = now;
    } else {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
    }
  }

  resetAttempts(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Session management
export class SecureSessionManager {
  private static instance: SecureSessionManager;
  private sessionStartTime: number = Date.now();

  static getInstance(): SecureSessionManager {
    if (!SecureSessionManager.instance) {
      SecureSessionManager.instance = new SecureSessionManager();
    }
    return SecureSessionManager.instance;
  }

  isSessionValid(): boolean {
    const now = Date.now();
    return now - this.sessionStartTime < SECURITY_CONFIG.SESSION_TIMEOUT;
  }

  refreshSession(): void {
    this.sessionStartTime = Date.now();
  }

  getSessionAge(): number {
    return Date.now() - this.sessionStartTime;
  }

  getSessionTimeout(): number {
    return SECURITY_CONFIG.SESSION_TIMEOUT;
  }
}

export default {
  sanitizeInput,
  sanitizeHTML,
  encryptData,
  decryptData,
  generateSecureToken,
  validateEmail,
  validatePhone,
  validatePassword,
  LoginRateLimiter,
  SecureSessionManager,
};
