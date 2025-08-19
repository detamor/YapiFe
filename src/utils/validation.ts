import {
  validateEmail as secureValidateEmail,
  validatePhone as secureValidatePhone,
  validatePassword as secureValidatePassword,
} from './security';

// Re-export secure validation functions
export const validateEmail = secureValidateEmail;
export const validatePhone = secureValidatePhone;
export const validatePassword = secureValidatePassword;

// Additional validation functions
export const validateName = (name: string): boolean => {
  if (!name || typeof name !== 'string') return false;

  // Remove extra spaces and check length
  const trimmedName = name.trim();
  if (trimmedName.length < 2 || trimmedName.length > 100) return false;

  // Check for valid characters (letters, spaces, dots, hyphens)
  const nameRegex = /^[a-zA-Z\s\.\-']+$/;
  return nameRegex.test(trimmedName);
};

export const validateAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 1000000000; // Max 1 billion
};

export const validateStory = (story: string): string => {
  if (!story || typeof story !== 'string') return '';

  const trimmedStory = story.trim();
  if (trimmedStory.length < 10) return 'Cerita minimal 10 karakter';
  if (trimmedStory.length > 2000) return 'Cerita maksimal 2000 karakter';

  return '';
};

export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';

  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};
