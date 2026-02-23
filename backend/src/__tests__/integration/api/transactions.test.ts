import request from 'supertest';
import app from '../../../app';
import { createTestUser, generateTestToken, createAuthHeader } from '../../helpers/testHelpers';

describe('Transaction API', () => {
  let testUser: any;
  let authToken: string;
  let authHeader: any;

  beforeEach(async () => {
    testUser = await createTestUser();
    authToken = generateTestToken(testUser.id, testUser.email);
    authHeader = createAuthHeader(authToken);
  });

  describe('POST /api/transactions', () => {
    it('should create a new transaction', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .set(authHeader)
        .send({
          amount: 100,
          type: 'income',
          category: 'Salary',
          description: 'Monthly salary',
          date: '2024-01-15',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.amount).toBe('100.00');
      expect(response.body.type).toBe('income');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .send({
          amount: 100,
          type: 'income',
          category: 'Salary',
          description: 'Monthly salary',
          date: '2024-01-15',
        });

      expect(response.status).toBe(401);
    });

    it('should return 400 with invalid data', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .set(authHeader)
        .send({
          amount: -100, // Invalid: negative amount
          type: 'income',
          category: 'Salary',
          description: 'Monthly salary',
          date: '2024-01-15',
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 with missing required fields', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .set(authHeader)
        .send({
          amount: 100,
          // Missing type, category, description, date
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/transactions', () => {
    beforeEach(async () => {
      // Create test transactions
      await request(app)
        .post('/api/transactions')
        .set(authHeader)
        .send({
          amount: 1000,
          type: 'income',
          category: 'Salary',
          description: 'Monthly salary',
          date: '2024-01-15',
        });

      await request(app)
        .post('/api/transactions')
        .set(authHeader)
        .send({
          amount: 200,
          type: 'expense',
          category: 'Food',
          description: 'Groceries',
          date: '2024-01-16',
        });
    });

    it('should get all transactions', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .set(authHeader);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should filter by type', async () => {
      const response = await request(app)
        .get('/api/transactions?type=income')
        .set(authHeader);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].type).toBe('income');
    });

    it('should filter by category', async () => {
      const response = await request(app)
        .get('/api/transactions?category=Food')
        .set(authHeader);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].category).toBe('Food');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/transactions');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/transactions/summary', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/transactions')
        .set(authHeader)
        .send({
          amount: 1000,
          type: 'income',
          category: 'Salary',
          description: 'Monthly salary',
          date: '2024-01-15',
        });

      await request(app)
        .post('/api/transactions')
        .set(authHeader)
        .send({
          amount: 200,
          type: 'expense',
          category: 'Food',
          description: 'Groceries',
          date: '2024-01-16',
        });
    });

    it('should get summary', async () => {
      const response = await request(app)
        .get('/api/transactions/summary')
        .set(authHeader);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalIncome');
      expect(response.body).toHaveProperty('totalExpenses');
      expect(response.body).toHaveProperty('balance');
      expect(response.body).toHaveProperty('byCategory');
      expect(response.body.totalIncome).toBe(1000);
      expect(response.body.totalExpenses).toBe(200);
      expect(response.body.balance).toBe(800);
    });
  });

  describe('PUT /api/transactions/:id', () => {
    let transactionId: number;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/transactions')
        .set(authHeader)
        .send({
          amount: 100,
          type: 'income',
          category: 'Salary',
          description: 'Monthly salary',
          date: '2024-01-15',
        });

      transactionId = response.body.id;
    });

    it('should update a transaction', async () => {
      const response = await request(app)
        .put(`/api/transactions/${transactionId}`)
        .set(authHeader)
        .send({
          amount: 200,
          description: 'Updated description',
        });

      expect(response.status).toBe(200);
      expect(response.body.amount).toBe('200.00');
      expect(response.body.description).toBe('Updated description');
    });

    it('should return 404 for non-existent transaction', async () => {
      const response = await request(app)
        .put('/api/transactions/99999')
        .set(authHeader)
        .send({
          amount: 200,
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/transactions/:id', () => {
    let transactionId: number;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/transactions')
        .set(authHeader)
        .send({
          amount: 100,
          type: 'income',
          category: 'Salary',
          description: 'Monthly salary',
          date: '2024-01-15',
        });

      transactionId = response.body.id;
    });

    it('should delete a transaction', async () => {
      const response = await request(app)
        .delete(`/api/transactions/${transactionId}`)
        .set(authHeader);

      expect(response.status).toBe(204);

      // Verify it's deleted
      const getResponse = await request(app)
        .get(`/api/transactions/${transactionId}`)
        .set(authHeader);

      expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existent transaction', async () => {
      const response = await request(app)
        .delete('/api/transactions/99999')
        .set(authHeader);

      expect(response.status).toBe(404);
    });
  });
});
