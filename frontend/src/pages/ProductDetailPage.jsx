import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, RotateCcw, MessageCircle, Share2, Truck, RefreshCw, Star } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

// Mock product data structure based on your previous examples
const mockProduct = {
  _id: '68efe211b92eb696c161bf34',
  brand: "FASCO", // Used as the small header text
  name: "Denim Jacket",
  price: 69.00,
  discountedPrice: 39.00,
  stock: 9,
  rating: 3, // Mock value
  numReviews: 13, // Mock value
  // Mock image gallery based on the screenshot (first is the main image)
  images: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=800&fit=crop', // Main image (Red Jacket)
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop', // Thumb 1 (Purple)
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop', // Thumb 2 (Red)
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop', // Thumb 3 (Blue 1)
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop', // Thumb 4 (Blue 2)
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop', // Thumb 5 (Black)
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop', // Thumb 6 (Black)
  ],
};

// Mock function for the countdown timer
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 5, seconds: 47 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="font-bold text-red-500 space-x-2 flex items-center">
      <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">{timeLeft.hours.toString().padStart(2, '0')}</span>
      <span>:</span>
      <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">{timeLeft.minutes.toString().padStart(2, '0')}</span>
      <span>:</span>
      <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">{timeLeft.seconds.toString().padStart(2, '0')}</span>
    </span>
  );
};

// Mock Star Rating Component
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const starArray = [...Array(5)].map((_, i) => (
    <Star key={i} className={`w-4 h-4 ${i < fullStars ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
  ));
  return <div className="flex">{starArray}</div>;
};


const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
        setMainImage(data.images && data.images.length > 0 ? data.images[0] : '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Calculate the save percentage
  const savePercentage = product && product.price > (product.discountedPrice || 0)
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : null;

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleAddToCart = async () => {
    setIsAdding(true);

    try {
      await addToCart(product._id, quantity);
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

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-64 text-red-500">Error: {error}</div>;
  if (!product) return <div className="flex justify-center items-center h-64">Product not found</div>;

  return (
    <div className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-10">

        {/* 1. Left Section: Image Gallery */}
        <div className="w-full lg:w-1/2 flex gap-4">

          {/* Thumbnails */}
          <div className="flex flex-col space-y-3">
            {product.images && product.images.slice(0, 7).map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`w-16 h-16 object-cover border cursor-pointer transition-all ${mainImage === img ? 'border-black' : 'border-gray-200'}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-grow aspect-w-3 aspect-h-4 overflow-hidden">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* 2. Right Section: Product Details */}
        <div className="w-full lg:w-1/2 space-y-5">

          {/* Brand & Favorite Icon */}
          <div className="flex justify-between items-start">
            <p className="text-xs uppercase tracking-wider text-gray-500">{product.brand}</p>
            <Heart className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-500 transition-colors" />
          </div>

          {/* Product Name & Rating */}
          <h1 className="text-4xl font-normal text-gray-900">{product.name}</h1>
          <div className="flex items-center space-x-2">
            <StarRating rating={product.rating || 0} />
            <span className="text-sm text-gray-600">({product.numReviews || 0})</span>
          </div>

          {/* Price and Discount */}
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-semibold text-gray-900">
              ${((product.discountedPrice || product.price) || 0).toFixed(2)}
            </span>
            {product.discountedPrice && product.price > product.discountedPrice && (
              <span className="text-lg text-gray-500 line-through">${product.price.toFixed(2)}</span>
            )}
            {savePercentage && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-sm font-medium">
                SAVE {savePercentage}%
              </span>
            )}
          </div>

          {/* Stock and Viewers */}
          <p className="text-sm text-gray-600">
            <span className="font-semibold">24</span> people are viewing this right now
          </p>

          {/* Sale Countdown */}
          <div className="pt-2 pb-4 border-b border-gray-200">
            <p className="text-base text-red-600 mb-2 font-medium">Hurry up! Sale ends in:</p>
            <CountdownTimer />
          </div>

          {/* Stock Count */}
          <p className="text-sm text-gray-600 border-b border-gray-200 pb-4">
            Only <span className="font-semibold text-red-500">{product.stock || 0} item(s)</span> left in stock!
          </p>

          {/* Quantity Selector and Add to Cart */}
          <div className="flex items-center space-x-4 pt-4">

            {/* Quantity Selector */}
            <div className="flex border border-gray-300 rounded-md">
              <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 border-r" onClick={decrementQuantity}>-</button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-12 text-center text-gray-900 border-none focus:ring-0"
              />
              <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 border-l" onClick={incrementQuantity}>+</button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-grow py-3 border border-black text-black text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>

          {/* Secondary Actions */}
          {/* <div className="flex items-center justify-start space-x-6 pt-2 text-sm text-gray-600">
            <button className="flex items-center space-x-1 hover:text-black transition-colors">
              <RotateCcw className="w-4 h-4" />
              <span>Compare</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-black transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>Ask a question</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-black transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div> */}

          {/* Delivery and Returns Info */}
          <div className="space-y-3 pt-4 text-sm">
            <p className="flex items-center space-x-2 text-gray-700 font-medium">
              <Truck className="w-5 h-5" />
              <span>Estimated Delivery: Jul 30 - Aug 03</span>
            </p>
            <p className="flex items-center space-x-2 text-gray-700 font-medium">
              <RefreshCw className="w-5 h-5" />
              <span>Free Shipping & Returns: On all orders over $75</span>
            </p>
          </div>

          {/* Payment Icons */}
          <div className="pt-4 bg-gray-50 p-4 rounded-md text-center">
            <div className="flex justify-center space-x-2 mb-2">
              <div className="w-8 h-6 bg-blue-600 rounded"></div>
              <div className="w-8 h-6 bg-red-500 rounded"></div>
              <div className="w-8 h-6 bg-yellow-500 rounded"></div>
              <div className="w-8 h-6 bg-green-600 rounded"></div>
            </div>
            <p className="text-xs text-gray-600">
              Guarantee safe & secure checkout
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
