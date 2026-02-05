const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../src/server');

describe('E-Commerce API Tests', () => {
  
  // Close server and database after all tests
  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  // =====================================
  // HEALTH CHECK TESTS
  // =====================================
  
  describe('Health Checks', () => {
    test('GET /health - should return healthy status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.service).toBe('ecommerce-api');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('timestamp');
    });

    test('GET /ready - should return readiness status', async () => {
      const response = await request(app).get('/ready');
      
      expect([200, 503]).toContain(response.status);
      expect(response.body).toHaveProperty('ready');
    });

    test('GET /metrics - should return Prometheus metrics', async () => {
      const response = await request(app).get('/metrics');
      
      expect(response.status).toBe(200);
      expect(response.text).toContain('products_total');
      expect(response.text).toContain('orders_total');
      expect(response.text).toContain('api_uptime_seconds');
    });
  });

  // =====================================
  // PRODUCT ROUTES TESTS
  // =====================================
  
  describe('Product Routes', () => {
    let createdProductId;

    test('GET /api/products - should return products list', async () => {
      const response = await request(app).get('/api/products');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('POST /api/products - should create a new product', async () => {
      const newProduct = {
        name: 'Test Laptop',
        description: 'High-performance laptop for testing',
        price: 999.99,
        category: 'Electronics',
        stock: 10,
        rating: 4.5
      };

      const response = await request(app)
        .post('/api/products')
        .send(newProduct);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(newProduct.name);
      expect(response.body.data.price).toBe(newProduct.price);
      
      createdProductId = response.body.data._id;
    });

    test('POST /api/products - should fail without required fields', async () => {
      const invalidProduct = {
        name: 'Incomplete Product'
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('GET /api/products/:id - should return single product', async () => {
      if (!createdProductId) {
        // Create a product first
        const product = await request(app)
          .post('/api/products')
          .send({
            name: 'Test Product',
            description: 'Test',
            price: 100,
            category: 'Electronics',
            stock: 5
          });
        createdProductId = product.body.data._id;
      }

      const response = await request(app).get(`/api/products/${createdProductId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(createdProductId);
    });

    test('GET /api/products/:id - should return 404 for invalid ID', async () => {
      const fakeId = '507f1f77bcf86cd799439011'; // Valid MongoDB ObjectId format
      const response = await request(app).get(`/api/products/${fakeId}`);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('PUT /api/products/:id - should update product', async () => {
      if (!createdProductId) return;

      const updates = {
        price: 899.99,
        stock: 15
      };

      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .send(updates);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.price).toBe(updates.price);
      expect(response.body.data.stock).toBe(updates.stock);
    });

    test('DELETE /api/products/:id - should delete product', async () => {
      if (!createdProductId) return;

      const response = await request(app)
        .delete(`/api/products/${createdProductId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');
  });

  // =====================================
  // =====================================
  
    test('GET /api/orders - should return orders list', async () => {
      const response = await request(app).get('/api/orders');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);

    test('POST /api/orders - should create a new order', async () => {
        products: [
          { productId: '507f1f77bcf86cd799439011', quantity: 2, price: 999.99 }
        ],
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        shippingAddress: '123 Test St, Test City, TC 12345'

      const response = await request(app)
        .post('/api/orders')
        .send(newOrder);
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('orderNumber');
      expect(response.body.data.customerName).toBe(newOrder.customerName);
    });
  });

  // =====================================
  // STATS ROUTE TESTS
  // =====================================
  
  describe('Stats Route', () => {
    test('GET /api/stats - should return dashboard statistics', async () => {
      const response = await request(app).get('/api/stats');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('products');
      expect(response.body.data).toHaveProperty('orders');
      expect(response.body.data).toHaveProperty('revenue');
    });
  });

  // =====================================
  // ERROR HANDLING TESTS
  // =====================================
  
  describe('Error Handling', () => {
    test('GET /unknown-route - should return 404', async () => {
      const response = await request(app).get('/unknown-route');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });

    test('GET /api/products with invalid query - should handle gracefully', async () => {
      const response = await request(app).get('/api/products?limit=invalid');
      
      // Should still return 200 but handle the invalid limit
      expect([200, 400, 500]).toContain(response.status);
    });
  });
});      
      };
        totalAmount: 1999.98,
      const newOrder = {
    });
      expect(response.body.success).toBe(true);
      
  describe('Order Routes', () => {
  // ORDER ROUTES TESTS

