export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'donatur' | 'volunteer';
  phone?: string;
  address?: string;
  profileImage?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  images?: string[];
  story: string;
  currentStatus: {
    living: string;
    health: string;
    education: string;
  };
  skills?: string[];
  achievements?: Achievement[];
  isActive: boolean;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  title: string;
  date: string;
  description: string;
  category?: string;
}

export interface Donation {
  id: string;
  donatorName: string;
  email: string;
  phone?: string;
  amount: number;
  currency: string;
  type: 'one-time' | 'monthly' | 'yearly';
  category: string;
  purpose?: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  isAnonymous: boolean;
  receiptNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'event' | 'program' | 'workshop' | 'competition';
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  schedule: {
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
  };
  location: {
    name: string;
    address: string;
  };
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  email: string;
  type: 'donatur' | 'orang-tua' | 'volunteer' | 'partner' | 'alumni' | 'pengunjung';
  title: string;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}





