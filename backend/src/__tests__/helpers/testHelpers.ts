import jwt from 'jsonwebtoken';
import { User } from '../../models/User';
import { Transaction } from '../../models/Transaction';
import { hashPassword } from '../../utils/passwordUtils';

export const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    passwordHash: await hashPassword('password123'),
  };

  return await User.create({ ...defaultUser, ...overrides });
};

export const createTestTransaction = async (userId: number, overrides = {}) => {
  const defaultTransaction = {
    userId,
    amount: 100,
    type: 'income' as const,
    category: 'Salary',
    description: 'Test transaction',
    date: new Date(),
  };

  return await Transaction.create({ ...defaultTransaction, ...overrides });
};

export const generateTestToken = (userId: number, email: string) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};

export const createAuthHeader = (token: string) => {
  return { Authorization: `Bearer ${token}` };
};
