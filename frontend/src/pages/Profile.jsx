import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    fetchUserProfile();
    fetchUserOrders();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError('Failed to load profile');
    }
  };

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Processing': return 'text-blue-600 bg-blue-100';
      case 'Shipped': return 'text-purple-600 bg-purple-100';
      case 'Delivered': return 'text-green-600 bg-green-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;

  return (
    <div className="bg-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-light text-gray-900 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Details */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Account Details</h2>
              {user && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <p className="mt-1 text-sm text-gray-900">{user.isAdmin ? 'Admin' : 'User'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Member Since</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {/* Track Order Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      to="/track-order"
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-center block"
                    >
                      Track Your Orders
                    </Link>
                  </div>
                  {user.isAdmin && (
                    <div className="pt-4 border-t border-gray-200">
                      <Link
                        to="/admin-login"
                        className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-center block"
                      >
                        Admin Dashboard
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Order History</h2>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg mb-4">No orders yet</p>
                <button
                  onClick={() => navigate('/shop')}
                  className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Order #{order._id.slice(-8)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 bg-white rounded-md p-3">
                          <img
                            src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : '/placeholder-image.jpg'}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <div className="flex-grow">
                            <h4 className="text-sm font-medium text-gray-900">{item.product.name}</h4>
                            <p className="text-sm text-gray-500">{item.product.brand}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-900">
                              ${((item.product.discountedPrice || item.product.price) || 0).toFixed(2)} x {item.quantity}
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              ${(((item.product.discountedPrice || item.product.price) || 0) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.shippingAddress && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
