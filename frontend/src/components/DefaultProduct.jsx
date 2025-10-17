import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../assets/default-product.png';
// Mock product structure for demonstration if no prop is passed
const defaultProduct = {
  name: "Peaky Blinders",
  category: "Mens Collection",
  price: 100.00,
  shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin.",
  // The main image for the LEFT side will be the full screenshot image
  // This is a placeholder for the entire left panel image
  mainImagePanel: defaultImage, // **IMPORTANT: Replace with your actual screenshot URL or the specific left panel image**
};





const DefaultProduct= ({ product = defaultProduct }) => {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('M');
  const availableSizes = ['S', 'M', 'L', 'XL']; // Mock sizes as they are not in your API response
  
const handleClick = () => {
    navigate(`/product/68f27e63659cc07d204dceb6`);
  }; 
  return (
    <div className="bg-white flex flex-col lg:flex-row relative overflow-hidden h-auto lg:h-[50vh]">

      {/* 1. Left Section: Static Image Panel */}
      <div className="relative w-full lg:w-1/2 bg-gray-100 p-0 h-64 lg:h-full">
        <img
          src={defaultProduct.mainImagePanel}
          alt="Product details with highlighted features"
          className="w-full h-full object-contain object-center"
        />
      </div>

      {/* 2. Right Section: Product Details Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-200 p-4 sm:p-8 lg:p-20 relative z-10">

        <div
            className="absolute left-0 top-0 bottom-0 w-3/5 md:w-1/2 transform -skew-x-12 origin-top-left bg-white z-0 hidden lg:block"
        ></div>

        <div className="max-w-md w-full space-y-4 lg:space-y-6 relative z-10">

          <p className="text-sm uppercase text-gray-600 font-light tracking-widest">
            {product.category || 'Women Collection'}
          </p>

          <h1 className="text-3xl lg:text-5xl font-serif text-gray-800 leading-tight">
            {product.name}
          </h1>

          <h2 className="text-sm font-semibold uppercase text-gray-600 border-b border-gray-400 pb-1 w-20">
            Description
          </h2>

          <p className="text-gray-600 leading-relaxed text-sm pr-0 lg:pr-10">
            {product.shortDescription}
          </p>

         

          <div className="pt-4">
            <span className="text-2xl lg:text-3xl font-medium text-gray-900">
              {product.discountedPrice ? `$${product.discountedPrice.toFixed(2)}` : `$${product.price.toFixed(2)}`}
            </span>
          </div>

          <button className="w-full lg:w-48 py-3 bg-black text-white text-base font-medium uppercase tracking-widest hover:bg-gray-800 transition-colors" onClick={handleClick}  >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DefaultProduct;