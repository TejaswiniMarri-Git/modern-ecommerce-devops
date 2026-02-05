const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// ===========================================
// MIDDLEWARE
// ===========================================

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// ===========================================
// DATABASE CONNECTION
// ===========================================

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB Connected:', mongoose.connection.host);
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  process.exit(1);
});

// ===========================================
// MODELS
// ===========================================

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { 
    type: String, 
    required: true,
    enum: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other']
  },
  stock: { type: Number, default: 0, min: 0 },
  imageUrl: { type: String, default: 'https://via.placeholder.com/300' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model('Product', productSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    price: { type: Number, required: true }
  }],
  status: { 
    type: String, 
    default: 'pending'
  },
  customerName: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

const Order = mongoose.model('Order', orderSchema);
// ===========================================
// ROUTES
// ===========================================

app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'healthy',
    service: 'ecommerce-api',
    version: '1.0.0',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

app.get('/ready', (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({ ready: true, database: 'connected' });
  } else {
    res.status(503).json({ ready: false, database: 'disconnected' });
  }
});

// Metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    
    res.set('Content-Type', 'text/plain');
    res.send(`
# HELP products_total Total number of products in database
# TYPE products_total gauge
products_total ${productCount}

# HELP orders_total Total number of orders in database
# TYPE orders_total gauge
orders_total ${orderCount}

# HELP api_uptime_seconds API uptime in seconds
# TYPE api_uptime_seconds gauge
api_uptime_seconds ${Math.floor(process.uptime())}

# HELP nodejs_memory_usage_bytes Node.js memory usage in bytes
# TYPE nodejs_memory_usage_bytes gauge
nodejs_memory_usage_bytes ${process.memoryUsage().heapUsed}
    `);
  } catch (error) {
    res.status(500).send('# Error collecting metrics');
  }
});

// ===========================================
// PRODUCT ROUTES
// ===========================================

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    if (featured) query.featured = featured === 'true';
});
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });

  try {
    const product = new Product(req.body);
    res.status(400).json({ success: false, error: error.message });
});

  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { new: true, runValidators: true }
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
  } catch (error) {
// Update order status
app.patch('/api/orders/:id/status', async (req, res) => {
    const { status } = req.body;
      { status, updatedAt: Date.now() },
      { new: true }
    );
    if (!order) {
    }
    res.json({ success: true, data: order });
    res.status(400).json({ success: false, error: error.message });
});

// ===========================================
// STATS ROUTE (Dashboard)

app.get('/api/stats', async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
    ]);
    
    const recentOrders = await Order.find()
      .sort('-createdAt')
      .limit(5)
      .select('orderNumber totalAmount status createdAt');
    
    res.json({
      success: true,
      data: {
        products: productCount,
        orders: orderCount,
        revenue: totalRevenue[0]?.total || 0,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===========================================
// ERROR HANDLERS
// ===========================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message
  });
});

// ===========================================
// START SERVER
// ===========================================

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('🚀 =================================');
  console.log(`   E-Commerce API Server Running`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log('🚀 =================================');
});

// Graceful Shutdown
const gracefulShutdown = () => {
  console.log('\n🛑 Received shutdown signal, closing gracefully...');
  server.close(() => {
    console.log('✅ HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('❌ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = { app, server };      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
// ===========================================
  }
  } catch (error) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    const order = await Order.findByIdAndUpdate(
      req.params.id,
  try {
  }
});

    res.status(500).json({ success: false, error: error.message });
});

    res.json({ success: true, data: order });
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
// ===========================================
// ORDER ROUTES
  }
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.productId');
});

// Get single order
// ===========================================

    await order.save();
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
    });
      orderNumber
    const order = new Order({
      ...req.body,
// Get all orders
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
app.get('/api/orders', async (req, res) => {
app.post('/api/orders', async (req, res) => {
  try {

// Create order
  try {
});
    res.status(500).json({ success: false, error: error.message });
  }
    const orders = await Order.find()
  } catch (error) {
      .populate('products.productId')
      .sort('-createdAt')
      .limit(100);
    res.json({ success: true, count: orders.length, data: orders });
  }
    );
      { ...req.body, updatedAt: Date.now() },
// Update product
app.put('/api/products/:id', async (req, res) => {
  }
  } catch (error) {
    await product.save();
    res.status(201).json({ success: true, data: product });
// Create product
app.post('/api/products', async (req, res) => {
  }
});
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
    if (!product) {
// Get single product
    const product = await Product.findById(req.params.id);
app.get('/api/products/:id', async (req, res) => {
  try {

    res.json({
  }
      data: products
    res.status(500).json({ success: false, error: error.message });
    });
  } catch (error) {
      success: true,
      count: products.length,
    const products = await Product.find(query)
    
      .sort(sort)
      .limit(parseInt(limit));
    
    if (category) query.category = category;
    const { category, featured, sort = '-createdAt', limit = 50 } = req.query;
    
    let query = {};
    memory: process.memoryUsage()
// Health Checks

});
  updatedAt: { type: Date, default: Date.now }
  customerEmail: { type: String, required: true },
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
  totalAmount: { type: Number, required: true },
    quantity: { type: Number, required: true },

