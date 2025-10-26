import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { cart, loading, error, fetchCart, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = (item.product.discountedPrice || item.product.price) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading cart...</div>;
  if (error) return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;

  return (
    <div className="bg-white py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-light text-gray-900 mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.product._id} className="flex items-center space-x-4 border-b border-gray-200 pb-6">
                  <img
                    src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : '/placeholder-image.jpg'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-gray-500">{item.product.brand}</p>
                    <p className="text-gray-900 font-semibold">
                      ${((item.product.discountedPrice || item.product.price) || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => addToCart(item.product._id, -1)}
                      className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item.product._id, 1)}
                      className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ${(((item.product.discountedPrice || item.product.price) || 0) * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-red-500 hover:text-red-700 text-sm mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-light text-gray-900">Total:</span>
                <span className="text-2xl font-semibold text-gray-900">${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => navigate('/shop')}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => navigate('/checkout')}
                  className="flex-1 bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
