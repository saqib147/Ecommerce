import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data.items || []);
      setTotalQuantity((response.data.items || []).reduce((sum, item) => sum + item.quantity, 0));
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/cart/add`, {
        productId,
        quantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCart(response.data.items || []);
      setTotalQuantity((response.data.items || []).reduce((sum, item) => sum + item.quantity, 0) || 0);
      return response.data;
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setError('Failed to add item to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCart(response.data.items || []);
      setTotalQuantity(response.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      setError('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/cart/update`, {
        productId,
        quantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCart(response.data.items || []);
      setTotalQuantity(response.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
    } catch (err) {
      console.error('Failed to update cart:', err);
      setError('Failed to update item quantity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const value = {
    cart,
    totalQuantity,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
