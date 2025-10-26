import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

const Checkout = () => {
  const { cart, loading: cartLoading, error: cartError, fetchCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shippingAddress: {
      address: '',
      city: '',
      postalCode: '',
      country: ''
    },
    paymentMethod: 'Credit Card'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = (item.product.discountedPrice || item.product.price) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.shippingAddress) {
      setFormData({
        ...formData,
        shippingAddress: {
          ...formData.shippingAddress,
          [name]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to place an order');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Clear cart after successful order
      await fetchCart();
      navigate('/', { state: { message: 'Order placed successfully!' } });
    } catch (err) {
      console.error('Failed to place order:', err);
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (cartError) return <div className="flex justify-center items-center h-64 text-red-500">{cartError}</div>;

  if (cart.length === 0) {
    return (
      <div className="bg-white py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-light text-gray-900 mb-8">Checkout</h1>
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-light text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product._id} className="flex items-center space-x-4 border-b border-gray-200 pb-4">
                  <img
                    src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : '/placeholder-image.jpg'}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-gray-500 text-sm">{item.product.brand}</p>
                    <p className="text-gray-900 font-semibold text-sm">
                      ${((item.product.discountedPrice || item.product.price) || 0).toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ${(((item.product.discountedPrice || item.product.price) || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-light text-gray-900">Total:</span>
                <span className="text-2xl font-semibold text-gray-900">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Shipping & Payment</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-sm text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Address</h3>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={formData.shippingAddress.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.shippingAddress.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code"
                      value={formData.shippingAddress.postalCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={formData.shippingAddress.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Method</h3>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
