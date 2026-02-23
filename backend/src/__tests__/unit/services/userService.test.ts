import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { listUsers, updateUser } from '../../../services/userService';
import { User } from '../../../models/User';
import { sequelize } from '../../../config/database';
import { hashPassword } from '../../../utils/passwordUtils';

describe('UserService', () => {
  let testUser: User;

  beforeEach(async () => {
    await sequelize.sync({ force: true });

    // Create test users
    const passwordHash = await hashPassword('password123');
    testUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash,
    });

    await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      passwordHash,
    });

    await User.create({
      name: 'Bob Johnson',
      email: 'bob@example.com',
      passwordHash,
    });
  });

  afterEach(async () => {
    await User.destroy({ where: {}, truncate: true });
  });

  describe('listUsers', () => {
    it('should list all users with pagination', async () => {
      const result = await listUsers({ page: '1', limit: '10' });

      expect(result.users).toHaveLength(3);
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.page).toBe('1');
      expect(result.pagination.limit).toBe('10');
      expect(result.pagination.totalPages).toBe(1);
    });

    it('should paginate results correctly', async () => {
      const result = await listUsers({ page: '1', limit: '2' });

      expect(result.users).toHaveLength(2);
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.totalPages).toBe(2);
    });

    it('should search users by name', async () => {
      const result = await listUsers({ search: 'John' });

      expect(result.users).toHaveLength(2); // John Doe and Bob Johnson
      expect(result.users.some((u) => u.name === 'John Doe')).toBe(true);
      expect(result.users.some((u) => u.name === 'Bob Johnson')).toBe(true);
    });

    it('should search users by email', async () => {
      const result = await listUsers({ search: 'jane@' });

      expect(result.users).toHaveLength(1);
      expect(result.users[0].email).toBe('jane@example.com');
    });

    it('should not return password hashes', async () => {
      const result = await listUsers({});

      result.users.forEach((user) => {
        expect(user).not.toHaveProperty('passwordHash');
      });
    });

    it('should order users by creation date descending', async () => {
      const result = await listUsers({});

      // Most recent first
      expect(result.users[0].email).toBe('bob@example.com');
      expect(result.users[2].email).toBe('john@example.com');
    });
  });

  describe('updateUser', () => {
    it('should update user name', async () => {
      const result = await updateUser(testUser.id, { name: 'John Updated' });

      expect(result.name).toBe('John Updated');
      expect(result.email).toBe('john@example.com');

      const updated = await User.findByPk(testUser.id);
      expect(updated?.name).toBe('John Updated');
    });

    it('should update user email', async () => {
      const result = await updateUser(testUser.id, { email: 'newemail@example.com' });

      expect(result.email).toBe('newemail@example.com');

      const updated = await User.findByPk(testUser.id);
      expect(updated?.email).toBe('newemail@example.com');
    });

    it('should update user avatar URL', async () => {
      const result = await updateUser(testUser.id, { avatarUrl: 'https://example.com/avatar.jpg' });

      expect(result.avatar).toBe('https://example.com/avatar.jpg');

      const updated = await User.findByPk(testUser.id);
      expect(updated?.avatarUrl).toBe('https://example.com/avatar.jpg');
    });

    it('should update multiple fields at once', async () => {
      const result = await updateUser(testUser.id, {
        name: 'John Updated',
        email: 'updated@example.com',
        avatarUrl: 'https://example.com/avatar.jpg',
      });

      expect(result.name).toBe('John Updated');
      expect(result.email).toBe('updated@example.com');
      expect(result.avatar).toBe('https://example.com/avatar.jpg');
    });

    it('should throw error for non-existent user', async () => {
      await expect(updateUser(99999, { name: 'Test' })).rejects.toMatchObject({
        status: 404,
        message: 'User not found',
      });
    });

    it('should not return password hash', async () => {
      const result = await updateUser(testUser.id, { name: 'John Updated' });

      expect(result).not.toHaveProperty('passwordHash');
    });
  });
});
