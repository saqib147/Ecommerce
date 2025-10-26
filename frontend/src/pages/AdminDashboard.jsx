import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductManagement from '../components/ProductManagement';
import UserManagement from '../components/UserManagement';
import OrderManagement from '../components/OrderManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin-login');
      return;
    }

    // Check if user is admin
    const checkAdmin = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.data.isAdmin) {
          navigate('/admin-login');
          return;
        }
        setUser(response.data);
      } catch (err) {
        console.error('Failed to check admin status:', err);
        navigate('/admin-login');
      }
    };

    checkAdmin();
  }, [navigate]);

  const tabs = [
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'orders', label: 'Orders', icon: '📋' }
  ];

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your e-commerce store</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'orders' && <OrderManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
