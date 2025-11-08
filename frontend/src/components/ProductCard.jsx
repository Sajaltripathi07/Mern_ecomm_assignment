import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      setMessage('Out of stock');
      return;
    }

    setAdding(true);
    setMessage('');
    const result = await addToCart(product._id, 1);
    
    if (result.success) {
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage(result.error || 'Failed to add to cart');
      setTimeout(() => setMessage(''), 3000);
    }
    setAdding(false);
  };

  return (
    <div className="product-card">
      {product.image && !imageError ? (
        <img 
          src={product.image} 
          alt={product.name} 
          onError={() => setImageError(true)}
          style={{ 
            width: '100%', 
            height: '250px', 
            objectFit: 'cover', 
            borderRadius: '4px',
            backgroundColor: '#f0f0f0'
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '250px',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '0.9rem'
        }}>
          {imageError ? 'Image not available' : 'No image'}
        </div>
      )}
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          {formatCurrency(product.price)}
        </span>
        <span style={{ color: product.stock > 0 ? 'green' : 'red' }}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </span>
      </div>
      <button 
        onClick={handleAddToCart} 
        disabled={adding || product.stock === 0}
        style={{ 
          width: '100%', 
          marginTop: '0.5rem',
          opacity: (adding || product.stock === 0) ? 0.6 : 1,
          cursor: (adding || product.stock === 0) ? 'not-allowed' : 'pointer'
        }}
      >
        {adding ? 'Adding...' : 'Add to Cart'}
      </button>
      {message && (
        <p style={{ 
          marginTop: '0.5rem', 
          color: message.includes('Added') ? 'green' : 'red',
          fontSize: '0.9rem'
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ProductCard;