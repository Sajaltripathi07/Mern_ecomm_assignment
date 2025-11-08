import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../api/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.get();
      setCart(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);
      const response = await cartAPI.addItem(productId, quantity);
      setCart(response.data);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to add item to cart';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      setError(null);
      await cartAPI.updateItem(itemId, quantity);
      await fetchCart();
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update cart item';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setError(null);
      await cartAPI.removeItem(itemId);
      await fetchCart();
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to remove item from cart';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      await cartAPI.clear();
      await fetchCart();
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to clear cart';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};