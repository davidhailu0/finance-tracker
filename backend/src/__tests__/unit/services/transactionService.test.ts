import * as transactionService from '../../../services/transactionService';
import { createTestUser, createTestTransaction } from '../../helpers/testHelpers';

describe('TransactionService', () => {
  let testUser: any;

  beforeEach(async () => {
    testUser = await createTestUser();
  });

  describe('createTransaction', () => {
    it('should create a new transaction', async () => {
      const transaction = await transactionService.createTransaction(
        testUser.id,
        100,
        'income',
        'Salary',
        'Monthly salary',
        '2024-01-15'
      );

      expect(transaction).toBeDefined();
      expect(transaction.userId).toBe(testUser.id);
      expect(transaction.amount).toBe(100);
      expect(transaction.type).toBe('income');
      expect(transaction.category).toBe('Salary');
    });

    it('should create an expense transaction', async () => {
      const transaction = await transactionService.createTransaction(
        testUser.id,
        50,
        'expense',
        'Food',
        'Grocery shopping',
        '2024-01-15'
      );

      expect(transaction.type).toBe('expense');
      expect(transaction.category).toBe('Food');
    });
  });

  describe('getTransactions', () => {
    beforeEach(async () => {
      await createTestTransaction(testUser.id, {
        amount: 100,
        type: 'income',
        category: 'Salary',
      });
      await createTestTransaction(testUser.id, {
        amount: 50,
        type: 'expense',
        category: 'Food',
      });
    });

    it('should get all transactions for a user', async () => {
      const transactions = await transactionService.getTransactions(testUser.id);

      expect(transactions).toHaveLength(2);
      expect(transactions[0].userId).toBe(testUser.id);
    });

    it('should filter transactions by type', async () => {
      const transactions = await transactionService.getTransactions(testUser.id, {
        type: 'income',
      });

      expect(transactions).toHaveLength(1);
      expect(transactions[0].type).toBe('income');
    });

    it('should filter transactions by category', async () => {
      const transactions = await transactionService.getTransactions(testUser.id, {
        category: 'Food',
      });

      expect(transactions).toHaveLength(1);
      expect(transactions[0].category).toBe('Food');
    });
  });

  describe('updateTransaction', () => {
    it('should update a transaction', async () => {
      const transaction = await createTestTransaction(testUser.id);

      const updated = await transactionService.updateTransaction(
        testUser.id,
        transaction.id,
        { amount: 200, description: 'Updated description' }
      );

      expect(updated).toBeDefined();
      expect(updated!.amount).toBe(200);
      expect(updated!.description).toBe('Updated description');
    });

    it('should return null for non-existent transaction', async () => {
      const updated = await transactionService.updateTransaction(
        testUser.id,
        99999,
        { amount: 200 }
      );

      expect(updated).toBeNull();
    });
  });

  describe('deleteTransaction', () => {
    it('should delete a transaction', async () => {
      const transaction = await createTestTransaction(testUser.id);

      const deleted = await transactionService.deleteTransaction(
        testUser.id,
        transaction.id
      );

      expect(deleted).toBe(true);

      const found = await transactionService.getTransactionById(
        testUser.id,
        transaction.id
      );
      expect(found).toBeNull();
    });

    it('should return false for non-existent transaction', async () => {
      const deleted = await transactionService.deleteTransaction(testUser.id, 99999);

      expect(deleted).toBe(false);
    });
  });

  describe('getSummary', () => {
    beforeEach(async () => {
      await createTestTransaction(testUser.id, {
        amount: 1000,
        type: 'income',
        category: 'Salary',
      });
      await createTestTransaction(testUser.id, {
        amount: 500,
        type: 'income',
        category: 'Freelance',
      });
      await createTestTransaction(testUser.id, {
        amount: 200,
        type: 'expense',
        category: 'Food',
      });
      await createTestTransaction(testUser.id, {
        amount: 100,
        type: 'expense',
        category: 'Transport',
      });
    });

    it('should calculate correct summary', async () => {
      const summary = await transactionService.getSummary(testUser.id);

      expect(summary.totalIncome).toBe(1500);
      expect(summary.totalExpenses).toBe(300);
      expect(summary.balance).toBe(1200);
    });

    it('should group by category', async () => {
      const summary = await transactionService.getSummary(testUser.id);

      expect(summary.byCategory['income-Salary']).toBe(1000);
      expect(summary.byCategory['income-Freelance']).toBe(500);
      expect(summary.byCategory['expense-Food']).toBe(200);
      expect(summary.byCategory['expense-Transport']).toBe(100);
    });
  });
});
