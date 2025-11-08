import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(true);
    setQuantity(newQuantity);
    const result = await updateCartItem(item._id, newQuantity);
    
    if (!result.success) {
      setQuantity(item.quantity);
      alert(result.error || 'Failed to update quantity');
    }
    setUpdating(false);
  };

  const handleRemove = async () => {
    if (!window.confirm('Remove this item from cart?')) return;
    
    setRemoving(true);
    const result = await removeFromCart(item._id);
    
    if (!result.success) {
      alert(result.error || 'Failed to remove item');
    }
    setRemoving(false);
  };

  const subtotal = item.price * quantity;

  return (
    <div className="cart-item" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <h4>{item.product?.name || 'Product'}</h4>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          {formatCurrency(item.price)} each
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <label>
          Qty:
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => {
              const newQty = parseInt(e.target.value) || 1;
              handleQuantityChange(newQty);
            }}
            disabled={updating}
            style={{ 
              width: '60px', 
              marginLeft: '0.5rem',
              padding: '0.25rem'
            }}
          />
        </label>
      </div>
      <div style={{ minWidth: '100px', textAlign: 'right' }}>
        <strong>{formatCurrency(subtotal)}</strong>
      </div>
      <button
        onClick={handleRemove}
        disabled={removing}
        style={{
          background: '#dc3545',
          padding: '0.5rem 1rem',
          opacity: removing ? 0.6 : 1
        }}
      >
        {removing ? 'Removing...' : 'Remove'}
      </button>
    </div>
  );
};

export default CartItem;