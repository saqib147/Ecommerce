import React from 'react'

const WebsiteInfo = () => {
  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif text-gray-800 text-center mb-8">About Our Website</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-medium text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-600 mb-4">
              We strive to provide a seamless online shopping experience with a wide range of high-quality products at competitive prices.
            </p>
            <h3 className="text-xl font-medium text-gray-800 mb-4">Our Vision</h3>
            <p className="text-gray-600 mb-4">
              To become the leading e-commerce platform that customers trust for their everyday needs and special purchases.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-800 mb-4">Technology Stack</h3>
            <ul className="text-gray-600 space-y-2 mb-4">
              <li>• Frontend: React.js with Vite</li>
              <li>• Backend: Node.js with Express.js</li>
              <li>• Database: MongoDB</li>
              <li>• Styling: Tailwind CSS</li>
              <li>• State Management: React Context</li>
            </ul>
            <h3 className="text-xl font-medium text-gray-800 mb-4">Key Features</h3>
            <ul className="text-gray-600 space-y-2">
              <li>• User authentication and profiles</li>
              <li>• Product catalog with search and filters</li>
              <li>• Shopping cart and checkout</li>
              <li>• Order tracking and history</li>
              <li>• Responsive design for all devices</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-800 mb-4">What We Offer</h3>
            <ul className="text-gray-600 space-y-2">
              <li>• Wide variety of products across multiple categories</li>
              <li>• Secure and fast checkout process</li>
              <li>• Excellent customer support</li>
              <li>• Fast and reliable shipping</li>
              <li>• Quality assurance on all products</li>
            </ul>
            
          </div>
        </div>
      </div>
    </section>
  )
}

export default WebsiteInfo
