import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Footer from '../common/Footer';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/images/logo-nobg.png" alt="Tokenly" className="h-20 w-auto object-contain" />
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </Link>
            <Link 
              to="/explore" 
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition"
            >
              Explore
            </Link>
            <Link 
              to="/dashboard" 
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

