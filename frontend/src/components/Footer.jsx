import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-6">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <h2 className="text-2xl font-serif font-semibold text-gray-800 mb-4 md:mb-0">
            JAM Store
          </h2>

          {/* Links */}
          <div className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-8 text-gray-600 font-medium">
            <Link to="/support" className="hover:text-black transition-colors duration-200 mb-2 md:mb-0">Support Center</Link>
            <Link to="/invoicing" className="hover:text-black transition-colors duration-200 mb-2 md:mb-0">Invoicing</Link>
            <Link to="/contract" className="hover:text-black transition-colors duration-200 mb-2 md:mb-0">Contract</Link>
            <Link to="/careers" className="hover:text-black transition-colors duration-200 mb-2 md:mb-0">Careers</Link>
            <Link to="/blog" className="hover:text-black transition-colors duration-200 mb-2 md:mb-0">Blog</Link>
            <Link to="/faqs" className="hover:text-black transition-colors duration-200 mb-2 md:mb-0">FAQs</Link>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-4 border-t border-gray-200"></div>

        {/* Copyright */}
        <div className="mt-3 text-center text-sm text-gray-500">
          Copyright © 2025 JAM Store . All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
