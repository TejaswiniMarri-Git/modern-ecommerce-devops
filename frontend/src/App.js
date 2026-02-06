import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/products`)
      .then(res => setProducts(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>E-Commerce Platform</h1>
          <p>Modern DevOps Demo</p>
        </div>
      </header>
      <div className="container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="products-grid">
            {products.map(p => (
              <div key={p._id} className="product-card">
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <p>${p.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

