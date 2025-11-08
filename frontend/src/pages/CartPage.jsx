import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { formatCurrency } from '../utils/formatCurrency';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cart, loading, error } = useCart();

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading cart...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/" style={{ display: 'inline-block', marginTop: '1rem' }}>
          <button>Continue Shopping</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Your Cart</h1>
      <div style={{ marginBottom: '2rem' }}>
        {cart.items.map((item) => (
          <CartItem key={item._id} item={item} />
        ))}
      </div>
      <div style={{ 
        borderTop: '2px solid #333', 
        paddingTop: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2>Total: {formatCurrency(cart.total || 0)}</h2>
        <Link to="/checkout">
          <button style={{ 
            background: '#28a745',
            fontSize: '1.1rem',
            padding: '0.75rem 2rem'
          }}>
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CartPage;