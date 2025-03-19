import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Navigation,
  Mail,
  Phone,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const products = [
    { name: 'Wired Trackers', path: '/products/wired' },
    { name: 'Asset Trackers', path: '/products/asset' },
    { name: 'Pet Trackers', path: '/products/pet' },
    { name: 'OBD Trackers', path: '/products/obd' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 relative">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Navigation className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold text-white">Vrisan Trackings</span>
            </div>
            <p className="text-sm">
              Leading provider of GPS tracking solutions for vehicles, assets, and pets.
              Empowering businesses and individuals with real-time tracking technology.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li className="relative">
                <button
                  className="flex items-center space-x-1 hover:text-primary-400 transition-colors duration-200"
                  onMouseEnter={() => setIsProductsOpen(true)}
                  onMouseLeave={() => setIsProductsOpen(false)}
                >
                  <span>Products</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {isProductsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 mt-2 w-48 rounded-md bg-gray-800 shadow-lg z-50"
                      onMouseEnter={() => setIsProductsOpen(true)}
                      onMouseLeave={() => setIsProductsOpen(false)}
                    >
                      {products.map((product) => (
                        <Link
                          key={product.path}
                          to={product.path}
                          className="block px-4 py-2 text-sm hover:bg-gray-700 hover:text-primary-400 transition-colors duration-200"
                        >
                          {product.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
              <li>
                <Link to="/software" className="hover:text-primary-400 transition-colors duration-200">
                  Software Solutions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary-400" />
                <span>123 Tracking Street, Tech City, 12345</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-primary-400" />
                <a href="tel:+911234567890" className="hover:text-primary-400 transition-colors duration-200">
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-primary-400" />
                <a href="mailto:info@vrisantrackings.com" className="hover:text-primary-400 transition-colors duration-200">
                  info@vrisantrackings.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Follow Us</h3>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="hover:text-primary-400 transition-colors duration-200"
              >
                <Facebook className="h-6 w-6" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="hover:text-primary-400 transition-colors duration-200"
              >
                <Twitter className="h-6 w-6" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="hover:text-primary-400 transition-colors duration-200"
              >
                <Instagram className="h-6 w-6" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="hover:text-primary-400 transition-colors duration-200"
              >
                <Linkedin className="h-6 w-6" />
              </motion.a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Vrisan Trackings. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;