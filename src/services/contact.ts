import api from './api';
import { ApiResponse } from '../types';

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const contactService = {
  async send(data: ContactData): Promise<ApiResponse<void>> {
    const response = await api.post('/contact', data);
    return response.data;
  }
};





