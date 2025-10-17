import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signupImage from '../assets/signup/signup.jpg';

// Custom Input Field Component for styling consistency
const InputField = ({ id, name, type, placeholder, value, onChange, required = false }) => (
  <input
    id={id}
    name={name}
    type={type}
    required={required}
    className="appearance-none block w-full px-0.5 py-1.5 border-0 border-b border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900 sm:text-sm"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
);

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.dispatchEvent(new Event('authChange'));
        navigate('/');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    // Outer container for the two-column layout (Image Left, Form Right)
    <div className="min-h-screen flex bg-white">
      {/* Left Section - Image */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-100">
        <img
          src={signupImage}
          alt="Signup"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Section - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-12">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-serif text-gray-900 tracking-wider mb-2">JAM Store</h1>
            <h2 className="text-xl font-normal text-gray-900">
              Create Account
            </h2>
          </div>


          
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-sm text-sm">
              {error}
            </div>
          )}

          {/* Signup Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Name */}
              <div>
                <InputField
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email Address */}
              <div>
                <InputField
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <InputField
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition duration-150"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          {/* Login Link and Terms */}
          <div className="text-center text-sm">
            <p className="text-gray-600">
              Already have an account? 
              <a 
                href="#" 
                onClick={() => navigate('/login')} 
                className="font-medium text-black hover:text-gray-800 ml-1"
              >
                Login
              </a>
            </p>
          </div>
          
          <div className="text-right text-xs pt-4">
            <a href="#" className="text-gray-500 hover:text-black">
              JAM Store Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;