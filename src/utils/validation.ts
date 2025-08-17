export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password minimal 8 karakter');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password harus mengandung huruf kecil');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password harus mengandung huruf besar');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password harus mengandung angka');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};





