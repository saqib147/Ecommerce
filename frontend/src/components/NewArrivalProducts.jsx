import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';



const NewArrivalProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products?limit=8&sort=-createdAt`);
        const fetchedProducts = response.data.products || [];

        setProducts(fetchedProducts);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to fetch new arrival products.');
        setLoading(false);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  // --- Render Loading State ---
  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light text-center mb-10">New Arrivals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white border border-gray-100 p-3 shadow-sm overflow-hidden">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200 animate-pulse mb-3"></div>
                <div className="px-1 space-y-2">
                  <div className="h-5 bg-gray-200 w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 w-1/3 animate-pulse"></div>
                  <div className="flex justify-between pt-2">
                    <div className="h-4 bg-gray-200 w-1/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 w-1/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // --- Render Error State ---
  if (error && products.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </section>
    );
  }

  // --- Main Rendered Component ---
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Title and Description */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-light text-gray-900 mb-2">New Arrivals</h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin
          </p>
        </div>
        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalProducts;