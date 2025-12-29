import axios from 'axios';
import type { Property, Home, About, Contact, ContactStats } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Public API endpoints
export const publicApi = {
  // Home
  getHome: async (): Promise<Home> => {
    const response = await api.get('/home');
    return response.data.data.home || response.data.data;
  },

  // Properties
  getProperties: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<{ galleryItems: Property[]; pagination: { total: number; page: number; pages: number; limit: number } }> => {
    const response = await api.get('/properties', { params });
    return response.data.data;
  },

  getProperty: async (id: string): Promise<Property> => {
    const response = await api.get(`/properties/${id}`);
    return response.data.data.galleryItem;
  },

  // About
  getAbout: async (): Promise<About> => {
    const response = await api.get('/about');
    return response.data.data.about || response.data.data;
  },

  // Contact
  submitContact: async (data: Contact): Promise<void> => {
    await api.post('/contact', data);
  },
};

// Admin API endpoints
export const adminApi = {
  // Properties
  createProperty: async (data: Partial<Property>): Promise<Property> => {
    const response = await api.post('/properties/admin', data);
    return response.data.data.galleryItem;
  },

  updateProperty: async (id: string, data: Partial<Property>): Promise<Property> => {
    const response = await api.put(`/properties/admin/${id}`, data);
    return response.data.data.galleryItem;
  },

  deleteProperty: async (id: string): Promise<void> => {
    await api.delete(`/properties/admin/${id}`);
  },

  uploadPropertyImages: async (id: string, files: File[]): Promise<Property> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    const response = await api.post(`/properties/admin/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.galleryItem;
  },

  deletePropertyImage: async (id: string, filename: string): Promise<Property> => {
    const response = await api.delete(`/properties/admin/${id}/image/${filename}`);
    return response.data.data.galleryItem;
  },

  // Contacts
  getContacts: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ contacts: Contact[]; total: number; page: number; pages: number }> => {
    const response = await api.get('/contact/admin', { params });
    return response.data.data;
  },

  getContactStats: async (): Promise<ContactStats> => {
    const response = await api.get('/contact/admin/stats');
    return response.data.data;
  },

  getContact: async (id: string): Promise<Contact> => {
    const response = await api.get(`/contact/admin/${id}`);
    return response.data.data;
  },

  updateContactStatus: async (id: string, status: 'new' | 'read' | 'replied'): Promise<Contact> => {
    const response = await api.patch(`/contact/admin/${id}/status`, { status });
    return response.data.data;
  },

  deleteContact: async (id: string): Promise<void> => {
    await api.delete(`/contact/admin/${id}`);
  },

  replyToContact: async (id: string, reply: string): Promise<Contact> => {
    const response = await api.post(`/contact/admin/${id}/reply`, { reply });
    return response.data.data.contact;
  },

  // About
  updateAbout: async (data: Partial<About>): Promise<About> => {
    const response = await api.put('/about/admin', data);
    return response.data.data;
  },

  uploadAboutImages: async (files: File[]): Promise<About> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    const response = await api.post('/about/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  deleteAboutImage: async (filename: string): Promise<About> => {
    const response = await api.delete(`/about/admin/image/${filename}`);
    return response.data.data;
  },

  // Home
  updateHome: async (data: Partial<Home>): Promise<Home> => {
    const response = await api.put('/home/admin', data);
    return response.data.data;
  },

  uploadHeroImage: async (file: File): Promise<Home> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/home/admin/hero-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  uploadSectionImage: async (sectionIndex: number, file: File): Promise<Home> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post(`/home/admin/section/${sectionIndex}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  uploadTestimonialImage: async (testimonialIndex: number, file: File): Promise<Home> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post(`/home/admin/testimonial/${testimonialIndex}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};

// Auth API
export const authApi = {
  logout: async () => {
    const response = await api.post('/auth/logout');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    return response.data;
  },
  getCurrentAdmin: async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },
};

export default api;
