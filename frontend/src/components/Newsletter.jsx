// Newsletter.js
import React from 'react';

const Newsletter = () => {
  return (
    <div className="flex justify-center items-center h-auto bg-gray-100 p-8 relative">
      <div className="bg-white p-12 text-center shadow-xl z-10">
        <h2 className="text-4xl font-serif font-semibold text-gray-800 mb-4">
          Subscribe To Our Newsletter
        </h2>
        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultricies lacus sed eu pulvinar.
        </p>
        <div className="flex flex-col items-center gap-4">
          <input
            type="email"
            placeholder="michael@ymail.com"
            className="p-3 border border-gray-300 rounded-md w-80 text-center focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
          <button className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors duration-300">
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;