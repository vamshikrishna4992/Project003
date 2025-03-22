import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  ChevronDown,
  Navigation,
  MapPin
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const cartItemsCount = useSelector((state) => state.cart.items.length);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    {
      name: 'Products',
      children: [
        { name: 'Wired Trackers', path: '/products/wired' },
        { name: 'Asset Trackers', path: '/products/asset' },
        { name: 'Pet Trackers', path: '/products/pet' },
        { name: 'OBD Trackers', path: '/products/obd' },
      ],
    },
    { name: 'Software Solutions', path: '/software' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-lg relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Navigation className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-primary-600">Vrisan Trackings</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.children ? (
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => setIsProductsOpen(true)}
                  onMouseLeave={() => setIsProductsOpen(false)}
                >
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors duration-200">
                    <span>{item.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <AnimatePresence>
                    {isProductsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                      >
                        <div className="py-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.path}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/tracking" className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center">
              <MapPin className="h-6 w-6" />
            </Link>
            <Link to="/cart" className="relative text-gray-600 hover:text-primary-600 transition-colors duration-200">
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <Link to="/login" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
              <User className="h-6 w-6" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                item.children ? (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => setIsProductsOpen(!isProductsOpen)}
                      className="w-full text-left px-3 py-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
                    >
                      {item.name}
                    </button>
                    <AnimatePresence>
                      {isProductsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-4"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.path}
                              className="block px-3 py-2 text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="block px-3 py-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <div className="flex items-center space-x-6 px-3 py-2">
                <Link to="/tracking" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  <MapPin className="h-6 w-6" />
                </Link>
                <Link to="/cart" className="relative text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  <User className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;