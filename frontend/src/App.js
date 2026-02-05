import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    stock: '',
    imageUrl: ''
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/products`);
      setProducts(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products. Please check if the backend is running.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/stats`);
      setStats(response.data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  // Handle form input
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/products`, {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });
      
      // Reset form and refresh products
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Electronics',
        stock: '',
        imageUrl: ''
      });
      setShowAddForm(false);
      fetchProducts();
      fetchStats();
    } catch (err) {
      alert('Failed to add product: ' + err.message);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_URL}/api/products/${id}`);
        fetchProducts();
        fetchStats();
      } catch (err) {
        alert('Failed to delete product: ' + err.message);
      }
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>🛒 E-Commerce Platform</h1>
          <p className="subtitle">Modern DevOps Pipeline Demo</p>
        </div>
      </header>

      {/* Stats Dashboard */}
      {stats && (
        <div className="stats-container">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>{stats.products}</h3>
                  <p>Total Products</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🛍️</div>
                <div className="stat-info">
                  <h3>{stats.orders}</h3>
                  <p>Total Orders</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <p>Total Revenue</p>
                </div>
              </div>
            </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container main-content">
        <div className="tabs">
          <button 
            className={activeTab === 'products' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('products')}
          >
          </button>
          <button 
            className={activeTab === 'add' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('add')}
            Add Product
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="products-section">
              <div className="loading">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <h3>No products yet</h3>
                <p>Add your first product to get started!</p>
                  Add Product
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <div key={product._id} className="product-card">
                    <div className="product-image">
                      <img 
                        src={product.imageUrl || 'https://via.placeholder.com/300'} 
                        alt={product.name}
                      />
                      <span className="category-badge">{product.category}</span>
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="description">{product.description}</p>
                      <div className="product-meta">
                        <div className="price">${product.price}</div>
                        <div className="stock">
                          Stock: <strong>{product.stock}</strong>
                        </div>
                      </div>
                      {product.rating > 0 && (
                        <div className="rating">
                          ⭐ {product.rating.toFixed(1)} ({product.reviews} reviews)
                        </div>
                      )}
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="btn-delete"
                <button onClick={() => setActiveTab('add')} className="btn-primary">
            {loading ? (
            ⚠️ {error}
                      >
          >
            Products
                        Delete
        {/* Tabs */}
          </div>
                      </button>
                    </div>

                  </div>

                ))}

              </div>
            )}
          </div>

        )}


        {/* Add Product Tab */}
        {activeTab === 'add' && (
          <div className="add-product-section">

            <h2>Add New Product</h2>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Product Name *</label>
                <input

                  type="text"
                  name="name"

                  value={formData.name}
                  onChange={handleInputChange}

                  required
                  placeholder="Enter product name"

                />
              </div>


              <div className="form-group">
                <label>Description *</label>

                <textarea
                  name="description"

                  value={formData.description}
                  onChange={handleInputChange}

                  required
                  placeholder="Enter product description"
                  rows="4"

                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>

                  <input
                    type="number"

                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Home">Home</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Image URL (optional)</label>
                <input
                  type="url"

                  name="imageUrl"

                  value={formData.imageUrl}

                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"

                />
              </div>


              <div className="form-actions">

                <button type="submit" className="btn-primary">
                  Add Product

                </button>

                <button 

                  type="button" 

                  onClick={() => setActiveTab('products')}
                  className="btn-secondary"

                >

                  Cancel

                </button>
              </div>
            </form>
          </div>
        )}

      </div>


      {/* Footer */}
      <footer className="footer">
        <div className="container">

          <p>
            Built with ❤️ by <strong>Tejaswini Marri</strong> | 

            Modern DevOps Pipeline Project 2026
          </p>

          <p className="tech-stack">
            React • Node.js • MongoDB • Docker • Kubernetes • GitHub Actions

          </p>
        </div>
      </footer>

    </div>
  );

}

export default App;
