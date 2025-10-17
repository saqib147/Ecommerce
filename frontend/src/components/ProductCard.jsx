import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';


const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, loading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAdding(true);

    try {
      await addToCart(product._id, 1);
      alert('Product added to cart!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      if (err.message === 'User not authenticated') {
        navigate('/signin');
      } else {
        alert('Failed to add product to cart. Please try again.');
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      {/* Product Image */}
      <div className="aspect-square overflow-hidden mb-2 rounded-md">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.jpg'}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Product Details */}
      <div className="px-1">
        <h3 className="text-xs md:text-sm font-semibold text-gray-900 truncate mb-1">
          {product.name || 'Product Name'}
        </h3>
        <p className="text-xs text-gray-500 mb-1">
          {product.brand || 'Al Karom'}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm md:text-lg font-bold text-gray-900">
            {/* Display discounted price if available, otherwise regular price */}
            {product.discountedPrice
              ? `$${product.discountedPrice.toFixed(2)}`
              : `$${(product.price || 0).toFixed(2)}`}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-black text-white text-xs md:text-sm font-medium py-1 md:py-2 rounded-md hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
