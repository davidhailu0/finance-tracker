'use client';

import { Transaction, SummaryData } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const session = localStorage.getItem('finance_tracker_current_session');
  if (!session) return null;
  try {
    const parsed = JSON.parse(session);
    return parsed.token;
  } catch {
    return null;
  }
};

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    return apiRequest<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  login: async (email: string, password: string) => {
    return apiRequest<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    return apiRequest<any>('/users/profile');
  },

  updateProfile: async (data: { name?: string; avatarUrl?: string }) => {
    return apiRequest<any>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Transaction API
export const transactionAPI = {
  create: async (transaction: {
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
    date: string;
  }) => {
    return apiRequest<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  },

  getAll: async (filters?: {
    startDate?: string;
    endDate?: string;
    type?: 'income' | 'expense';
    category?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.category) params.append('category', filters.category);

    const query = params.toString();
    return apiRequest<Transaction[]>(`/transactions${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest<Transaction>(`/transactions/${id}`);
  },

  update: async (
    id: string,
    updates: {
      amount?: number;
      type?: 'income' | 'expense';
      category?: string;
      description?: string;
      date?: string;
    }
  ) => {
    return apiRequest<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string) => {
    return apiRequest<void>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },

  getSummary: async (filters?: { startDate?: string; endDate?: string }) => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const query = params.toString();
    return apiRequest<SummaryData>(`/transactions/summary${query ? `?${query}` : ''}`);
  },
};
