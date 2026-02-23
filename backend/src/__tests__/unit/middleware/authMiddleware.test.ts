import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { authenticateJWT } from '../../../middleware/authMiddleware';
import { User } from '../../../models/User';
import { sequelize } from '../../../config/database';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../../config/jwt';

describe('AuthMiddleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let testUser: User;

  beforeEach(async () => {
    await sequelize.sync({ force: true });

    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
    });

    mockReq = {
      headers: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn().mockReturnThis() as any,
    };

    mockNext = jest.fn() as any;
  });

  afterEach(async () => {
    await User.destroy({ where: {}, truncate: true });
  });

  it('should authenticate valid JWT token', async () => {
    const token = jwt.sign(
      { userId: testUser.id, email: testUser.email },
      jwtConfig.secret as string,
      { expiresIn: jwtConfig.expiresIn as string | number }
    );

    mockReq.headers = {
      authorization: `Bearer ${token}`,
    };

    await authenticateJWT(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect((mockReq as any).user).toBeDefined();
    expect((mockReq as any).user.id).toBe(testUser.id);
  });

  it('should reject request without authorization header', async () => {
    await authenticateJWT(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'No token provided',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject request with invalid token format', async () => {
    mockReq.headers = {
      authorization: 'InvalidFormat',
    };

    await authenticateJWT(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'No token provided',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject request with invalid token', async () => {
    mockReq.headers = {
      authorization: 'Bearer invalid.token.here',
    };

    await authenticateJWT(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Invalid or expired token',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject request with expired token', async () => {
    const token = jwt.sign(
      { userId: testUser.id, email: testUser.email },
      jwtConfig.secret as string,
      { expiresIn: -1 } // Already expired
    );

    mockReq.headers = {
      authorization: `Bearer ${token}`,
    };

    await authenticateJWT(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Invalid or expired token',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject request for non-existent user', async () => {
    const token = jwt.sign(
      { userId: 99999, email: 'nonexistent@example.com' },
      jwtConfig.secret as string,
      { expiresIn: jwtConfig.expiresIn as string | number }
    );

    mockReq.headers = {
      authorization: `Bearer ${token}`,
    };

    await authenticateJWT(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'User not found',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should attach user object to request', async () => {
    const token = jwt.sign(
      { userId: testUser.id, email: testUser.email },
      jwtConfig.secret as string,
      { expiresIn: jwtConfig.expiresIn as string | number }
    );

    mockReq.headers = {
      authorization: `Bearer ${token}`,
    };

    await authenticateJWT(mockReq as Request, mockRes as Response, mockNext);

    expect((mockReq as any).user).toBeDefined();
    expect((mockReq as any).user.id).toBe(testUser.id);
    expect((mockReq as any).user.email).toBe(testUser.email);
    expect((mockReq as any).user.name).toBe(testUser.name);
  });
});
