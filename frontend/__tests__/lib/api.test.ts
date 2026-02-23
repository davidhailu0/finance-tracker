import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authAPI, userAPI, transactionAPI } from '@/lib/api';

// Mock fetch
global.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('authAPI', () => {
    it('should register a new user', async () => {
      const mockResponse = {
        user: { id: '1', name: 'John', email: 'john@example.com' },
        token: 'test-token',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await authAPI.register('John', 'john@example.com', 'password123');

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'John', email: 'john@example.com', password: 'password123' }),
        })
      );
    });

    it('should login a user', async () => {
      const mockResponse = {
        user: { id: '1', name: 'John', email: 'john@example.com' },
        token: 'test-token',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await authAPI.login('john@example.com', 'password123');

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'john@example.com', password: 'password123' }),
        })
      );
    });
  });

  describe('userAPI', () => {
    beforeEach(() => {
      localStorage.setItem(
        'finance_tracker_current_session',
        JSON.stringify({ token: 'test-token' })
      );
    });

    it('should get user profile with auth token', async () => {
      const mockUser = { id: '1', name: 'John', email: 'john@example.com' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const result = await userAPI.getProfile();

      expect(result).toEqual(mockUser);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/profile'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('should update user profile', async () => {
      const mockUser = { id: '1', name: 'John Updated', email: 'john@example.com' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const result = await userAPI.updateProfile({ name: 'John Updated' });

      expect(result).toEqual(mockUser);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/profile'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ name: 'John Updated' }),
        })
      );
    });
  });

  describe('transactionAPI', () => {
    beforeEach(() => {
      localStorage.setItem(
        'finance_tracker_current_session',
        JSON.stringify({ token: 'test-token' })
      );
    });

    it('should create a transaction', async () => {
      const mockTransaction = {
        id: '1',
        amount: 100,
        type: 'expense' as const,
        category: 'Food',
        description: 'Groceries',
        date: '2024-01-15',
        createdAt: '2024-01-15T00:00:00Z',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransaction,
      });

      const result = await transactionAPI.create({
        amount: 100,
        type: 'expense',
        category: 'Food',
        description: 'Groceries',
        date: '2024-01-15',
      });

      expect(result).toEqual(mockTransaction);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/transactions'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should get all transactions with filters', async () => {
      const mockTransactions = [
        {
          id: '1',
          amount: 100,
          type: 'expense' as const,
          category: 'Food',
          description: 'Groceries',
          date: '2024-01-15',
          createdAt: '2024-01-15T00:00:00Z',
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransactions,
      });

      const result = await transactionAPI.getAll({
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        type: 'expense',
      });

      expect(result).toEqual(mockTransactions);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('startDate=2024-01-01'),
        expect.any(Object)
      );
    });

    it('should update a transaction', async () => {
      const mockTransaction = {
        id: '1',
        amount: 150,
        type: 'expense' as const,
        category: 'Food',
        description: 'Updated groceries',
        date: '2024-01-15',
        createdAt: '2024-01-15T00:00:00Z',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransaction,
      });

      const result = await transactionAPI.update('1', {
        amount: 150,
        description: 'Updated groceries',
      });

      expect(result).toEqual(mockTransaction);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/transactions/1'),
        expect.objectContaining({
          method: 'PUT',
        })
      );
    });

    it('should delete a transaction', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await transactionAPI.delete('1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/transactions/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('should get transaction summary', async () => {
      const mockSummary = {
        totalIncome: 5000,
        totalExpenses: 3000,
        balance: 2000,
        byCategory: { Food: 500, Transport: 300 },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSummary,
      });

      const result = await transactionAPI.getSummary({
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      });

      expect(result).toEqual(mockSummary);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/transactions/summary'),
        expect.any(Object)
      );
    });

    it('should throw error on failed request', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Bad request' }),
      });

      await expect(
        transactionAPI.create({
          amount: 100,
          type: 'expense',
          category: 'Food',
          description: 'Test',
          date: '2024-01-15',
        })
      ).rejects.toThrow('Bad request');
    });
  });
});
