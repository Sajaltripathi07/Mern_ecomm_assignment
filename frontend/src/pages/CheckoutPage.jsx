import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { checkoutAPI } from '../api/api';
import { useNavigate } from 'react-router-dom';
import ReceiptModal from '../components/ReceiptModal';
import { formatCurrency } from '../utils/formatCurrency';

const CheckoutPage = () => {
  const { cart, loading, refreshCart } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.address) {
      setError('Please fill in all fields');
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setProcessing(true);
    try {
      const response = await checkoutAPI.process(formData);
      setReceipt(response.data);
      setOrderPlaced(true);
      await refreshCart();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process checkout');
      console.error('Checkout error:', err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (orderPlaced && receipt) {
    return (
      <>
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            padding: '2rem',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <h1 style={{ color: '#155724', marginBottom: '1rem' }}>✓ Order Placed Successfully!</h1>
            <p style={{ color: '#155724', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              Thank you for your purchase!
            </p>
            <p style={{ color: '#155724' }}>
              Your order ID is: <strong>{receipt.orderId}</strong>
            </p>
          </div>
          <button 
            onClick={() => {
              setOrderPlaced(false);
              setReceipt(null);
              navigate('/');
            }}
            style={{
              background: '#28a745',
              fontSize: '1.1rem',
              padding: '0.75rem 2rem',
              marginRight: '1rem'
            }}
          >
            Continue Shopping
          </button>
          <button 
            onClick={() => {}}
            style={{
              background: '#007bff',
              fontSize: '1.1rem',
              padding: '0.75rem 2rem'
            }}
          >
            View Receipt
          </button>
        </div>
        {receipt && (
          <ReceiptModal 
            receipt={receipt} 
            onClose={() => setReceipt(null)} 
          />
        )}
      </>
    );
  }

  if ((!cart || !cart.items || cart.items.length === 0) && !orderPlaced) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
        <button onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Checkout</h1>
      
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

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              fontSize: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              fontSize: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Shipping Address *
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            rows="4"
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              fontSize: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ 
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <h3>Order Summary</h3>
          <p>Items: {cart.items.length}</p>
          <p><strong>Total: {formatCurrency(cart.total || 0)}</strong></p>
        </div>

        <button
          type="submit"
          disabled={processing}
          style={{
            width: '100%',
            background: processing ? '#6c757d' : '#28a745',
            fontSize: '1.1rem',
            padding: '0.75rem',
            opacity: processing ? 0.6 : 1,
            cursor: processing ? 'not-allowed' : 'pointer'
          }}
        >
          {processing ? 'Processing...' : 'Place Order'}
        </button>
      </form>

      {receipt && (
        <ReceiptModal 
          receipt={receipt} 
          onClose={() => {
            setReceipt(null);
            if (!orderPlaced) {
              navigate('/');
            }
          }} 
        />
      )}
    </div>
  );
};

export default CheckoutPage;