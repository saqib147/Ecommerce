import React from 'react';
import highQualityIcon from '../assets/icons/high-quality.png';
import warrantyIcon from '../assets/icons/warrenty.png';
import freeShippingIcon from '../assets/icons/free-shipping.png';
import supportIcon from '../assets/icons/support.png';

const ServiceFeatures = () => {
  // Define the features data
  const features = [
    {
      icon: highQualityIcon,
      title: 'High Quality',
      description: 'crafted from top materials'
    },
    {
      icon: warrantyIcon,
      title: 'Warranty Protection',
      description: 'Over 2 years'
    },
    {
      icon: freeShippingIcon,
      title: 'Free Shipping',
      description: 'Order over 150 $'
    },
    {
      icon: supportIcon,
      title: '24 / 7 Support',
      description: 'Dedicated support'
    }
  ];

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Icon */}
            <div className="flex-shrink-0">
              <img
                src={feature.icon}
                alt={feature.title}
                className="w-12 h-12 object-contain hover:opacity-90 transition-opacity duration-200"
              />
            </div>

            {/* Text Content */}
            <div>
              <h3 className="text-base font-medium text-gray-800">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceFeatures;