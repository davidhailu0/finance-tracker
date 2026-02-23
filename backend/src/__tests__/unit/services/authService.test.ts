import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { registerUser, loginUser } from '../../../services/authService';
import { User } from '../../../models/User';
import { sequelize } from '../../../config/database';

describe('AuthService', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await User.destroy({ where: {}, truncate: true });
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const result = await registerUser('John Doe', 'john@example.com', 'password123');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.name).toBe('John Doe');
      expect(result.user.email).toBe('john@example.com');
      expect(result.user).not.toHaveProperty('passwordHash');
      expect(typeof result.token).toBe('string');
    });

    it('should throw error if email already exists', async () => {
      await registerUser('John Doe', 'john@example.com', 'password123');

      await expect(
        registerUser('Jane Doe', 'john@example.com', 'password456')
      ).rejects.toMatchObject({
        status: 409,
        message: 'Email already in use',
      });
    });

    it('should hash the password', async () => {
      await registerUser('John Doe', 'john@example.com', 'password123');

      const user = await User.findOne({ where: { email: 'john@example.com' } });
      expect(user?.passwordHash).toBeDefined();
      expect(user?.passwordHash).not.toBe('password123');
    });

    it('should create user with correct fields', async () => {
      const result = await registerUser('John Doe', 'john@example.com', 'password123');

      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('name');
      expect(result.user).toHaveProperty('email');
      expect(result.user).toHaveProperty('createdAt');
    });
  });

  describe('loginUser', () => {
    beforeEach(async () => {
      await registerUser('John Doe', 'john@example.com', 'password123');
    });

    it('should login user with correct credentials', async () => {
      const result = await loginUser('john@example.com', 'password123');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe('john@example.com');
      expect(typeof result.token).toBe('string');
    });

    it('should throw error for non-existent user', async () => {
      await expect(
        loginUser('nonexistent@example.com', 'password123')
      ).rejects.toMatchObject({
        status: 401,
        message: 'Invalid credentials',
      });
    });

    it('should throw error for incorrect password', async () => {
      await expect(
        loginUser('john@example.com', 'wrongpassword')
      ).rejects.toMatchObject({
        status: 401,
        message: 'Invalid credentials',
      });
    });

    it('should return valid JWT token', async () => {
      const result = await loginUser('john@example.com', 'password123');

      expect(result.token).toBeDefined();
      expect(result.token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should not return password hash', async () => {
      const result = await loginUser('john@example.com', 'password123');

      expect(result.user).not.toHaveProperty('passwordHash');
    });
  });
});
