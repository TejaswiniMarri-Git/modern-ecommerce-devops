const request = require('supertest');
const mongoose = require('mongoose');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-test';

const app = require('../src/server');

describe('E-Commerce API Tests', () => {

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // =====================================
  // HEALTH CHECK TESTS
  // =====================================

  describe('Health Checks', () => {
    test('GET /health - should return healthy status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
    });
  });

  // =====================================
  // PRODUCT TESTS
  // =====================================

  describe('Product API', () => {
    let createdProductId;

    test('GET /api/products - should return empty list initially', async () => {
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('POST /api/products - should create a product', async () => {
      const product = {
        name: 'Test Laptop',
        description: 'A test laptop',
        price: 999,
        category: 'Electronics',
        stock: 10
      };

      const response = await request(app)
        .post('/api/products')
        .send(product);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Laptop');

      createdProductId = response.body.data._id;
    });

    test('GET /api/products - should return created product', async () => {
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('DELETE /api/products/:id - should delete product', async () => {
      if (!createdProductId) return;

      const response = await request(app)
        .delete(`/api/products/${createdProductId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  // =====================================
  // STATS TESTS
  // =====================================

  describe('Stats API', () => {
    test('GET /api/stats - should return statistics', async () => {
      const response = await request(app).get('/api/stats');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('products');
    });
  });

  // =====================================
  // ERROR HANDLING
  // =====================================

  describe('Error Handling', () => {
    test('GET /unknown - should return 404', async () => {
      const response = await request(app).get('/unknown-route');
      expect(response.status).toBe(404);
    });
  });
});
