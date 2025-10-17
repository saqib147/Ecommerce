import React from 'react'

const Hero = () => {
  // Data for the categories (matching the bottom of the image)
  const categories = [
    'ELECTRONICS',
    'CLOTHING',
    'HOME APPLIANCES',
    'GROCERY',
    'ACCESSORIES'
  ]

  // Placeholder images for the three-column hero section
  const heroImages = {
    left: 'https://plus.unsplash.com/premium_photo-1714226830434-7dbc12f31bcf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687', // Man on box
    topCenter: 'https://images.pexels.com/photos/2015876/pexels-photo-2015876.jpeg', // Group of women
    bottomCenter: 'https://images.pexels.com/photos/17546502/pexels-photo-17546502.jpeg', // Two women laughing
    right: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=600&fit=crop&crop=center' // Man on stool
  };

  return (
    <div className="bg-white">
      {/* Hero Section: Smaller, Responsive Three-Column Layout */}
      {/* Reduced vertical padding (py-1, py-2) and set a max height for the container on large screens */}
      <section className="px-4 py-1 md:py-2 max-w-5xl mx-auto">
        <div className="flex justify-center items-center lg:max-h-[70vh] lg:overflow-hidden">
          {/* Left Column (Image) */}
          <div className="hidden lg:block w-1/4 h-[400px] bg-gray-100 overflow-hidden rounded-lg shadow-xl mr-2">
            <img
              src={heroImages.left}
              alt="Fashion model sitting"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Center Column (Text & Nested Images) */}
          <div className="w-full lg:w-2/4 h-full flex flex-col items-center justify-center p-4">
            
            {/* Top Center Image */}
            <div className="w-full h-[120px] mb-2 overflow-hidden rounded-lg shadow-lg">
              <img
                src={heroImages.topCenter}
                alt="New collection models"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Main Text Block */}
            <div className="text-center my-4">
              <h1 className="text-4xl sm:text-5xl font-light text-gray-900 tracking-tight leading-none mb-2">
                ULTIMATE
              </h1>
              <h2 className="text-5xl sm:text-6xl font-extralight text-gray-900 tracking-widest mb-2" style={{
                letterSpacing: '0.25em'
              }}>
                SALE
              </h2>
              <p className="text-xs font-medium tracking-widest text-gray-600 mb-4">
                NEW COLLECTION
              </p>
              <button className="px-4 py-2 bg-black text-white text-xs font-medium tracking-widest uppercase hover:bg-gray-800 transition duration-200">
                SHOP NOW
              </button>
            </div>

            {/* Bottom Center Image */}
            <div className="w-full h-[100px] mt-2 overflow-hidden rounded-lg shadow-lg">
              <img
                src={heroImages.bottomCenter}
                alt="Sale models laughing"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Right Column (Image) */}
          <div className="hidden lg:block w-1/4 h-[400px] bg-gray-100 overflow-hidden rounded-lg shadow-xl ml-2">
            <img
              src={heroImages.right}
              alt="Fashion model on stool"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* --- */}

      {/* Categories Section (Matching the bottom strip) */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-around items-center space-y-4 md:space-y-0">
          {categories.map((category, index) => (
            // In a real app, these would be high-quality SVG/PNG logo images,
            // but for styling, we'll use text that looks like a clean logo.
            <div key={index} className="text-lg sm:text-xl md:text-2xl font-serif tracking-widest text-gray-800 opacity-80 hover:opacity-100 transition duration-300 mx-2 md:mx-4">
              {category}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Hero
