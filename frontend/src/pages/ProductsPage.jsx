import { useState, useEffect } from 'react';
import { productsAPI } from '../api/api';
import ProductCard from '../components/ProductCard';
import api from '../api/api';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSeedProducts = async () => {
    try {
      setSeeding(true);
      setError(null);
      const response = await api.get('/products/seed');
      
      if (response.status === 201 || response.status === 200) {
        await fetchProducts();
        alert(`Successfully seeded ${response.data.count} products!`);
      } else {
        setError(response.data.message || 'Failed to seed products');
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.message || 'Products already exist in database');
        await fetchProducts();
      } else {
        setError('Failed to seed products. Make sure the backend server is running.');
        console.error('Error seeding products:', err);
      }
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Products</h1>
        {products.length === 0 && (
          <button 
            onClick={handleSeedProducts} 
            disabled={seeding}
            style={{
              background: seeding ? '#6c757d' : '#28a745',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem'
            }}
          >
            {seeding ? 'Seeding...' : 'Seed Products'}
          </button>
        )}
      </div>
      
      {error && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f8d7da', 
          color: '#721c24',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No products available.</p>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Click "Seed Products" to populate the database with sample products.
          </p>
          <button 
            onClick={handleSeedProducts} 
            disabled={seeding}
            style={{
              background: seeding ? '#6c757d' : '#28a745',
              padding: '0.75rem 2rem',
              fontSize: '1.1rem'
            }}
          >
            {seeding ? 'Seeding Products...' : 'Seed Products Now'}
          </button>
        </div>
      ) : (
        <div className="grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;