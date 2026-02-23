export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO date string
  type: TransactionType;
  createdAt: string; // ISO timestamp
  userId?: string;
}

export interface SummaryData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  byCategory: Record<string, number>;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  createdAt: string;
}

export interface Session {
  userId: string;
  username: string;
  token: string;
  expiresAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  session?: Session;
}

export const TRANSACTION_CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  expense: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Other'],
} as const;
