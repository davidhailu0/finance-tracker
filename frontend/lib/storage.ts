'use client';

import { Transaction, SummaryData } from './types';

const STORAGE_KEY = 'finance_tracker_transactions';

// Mock database for server-side operations
let mockDatabase: Transaction[] = [];

// Initialize with sample data if needed
const initializeMockDatabase = () => {
  if (mockDatabase.length === 0) {
    mockDatabase = [
      {
        id: '1',
        amount: 5000,
        category: 'Salary',
        description: 'Monthly salary',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'income',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        amount: 50,
        category: 'Food',
        description: 'Grocery shopping',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'expense',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        amount: 1500,
        category: 'Freelance',
        description: 'Project payment',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'income',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        amount: 150,
        category: 'Entertainment',
        description: 'Movie tickets',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        createdAt: new Date().toISOString(),
      },
    ];
  }
};

// Client-side storage functions
export const getTransactionsFromStorage = (): Transaction[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveTransactionsToStorage = (transactions: Transaction[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

// Server-side functions (for API routes if needed)
export const getTransactions = (): Transaction[] => {
  initializeMockDatabase();
  return mockDatabase;
};

export const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
  initializeMockDatabase();
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  mockDatabase.push(newTransaction);
  return newTransaction;
};

export const updateTransaction = (id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>): Transaction | null => {
  initializeMockDatabase();
  const index = mockDatabase.findIndex((t) => t.id === id);
  if (index === -1) return null;
  mockDatabase[index] = { ...mockDatabase[index], ...updates };
  return mockDatabase[index];
};

export const deleteTransaction = (id: string): boolean => {
  initializeMockDatabase();
  const index = mockDatabase.findIndex((t) => t.id === id);
  if (index === -1) return false;
  mockDatabase.splice(index, 1);
  return true;
};

export const calculateSummary = (transactions: Transaction[]): SummaryData => {
  const summary: SummaryData = {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    byCategory: {},
  };

  transactions.forEach((t) => {
    if (t.type === 'income') {
      summary.totalIncome += t.amount;
    } else {
      summary.totalExpenses += t.amount;
    }

    const key = `${t.type}-${t.category}`;
    summary.byCategory[key] = (summary.byCategory[key] || 0) + t.amount;
  });

  summary.balance = summary.totalIncome - summary.totalExpenses;
  return summary;
};
