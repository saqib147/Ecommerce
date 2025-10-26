import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (page = currentPage) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders/all?page=${page}&limit=15`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
      setTotalOrders(response.data.totalOrders);
      setCurrentPage(response.data.currentPage);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}/status`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (err) {
      console.error('Failed to delete order:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-gray-900">Order Management</h2>
        <p className="text-sm text-gray-600 mt-1">Showing {orders.length} of {totalOrders} orders</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Order #{order._id.slice(-8)}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()} • {order.user.name} ({order.user.email})
                </p>
              </div>
              <div className="text-right">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 bg-gray-50 rounded-md p-3">
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
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleDelete(order._id)}
                className="text-red-600 hover:text-red-900 text-sm font-medium"
              >
                Delete Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => fetchOrders(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchOrders(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  page === currentPage
                    ? 'text-white bg-black'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => fetchOrders(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {orders.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
