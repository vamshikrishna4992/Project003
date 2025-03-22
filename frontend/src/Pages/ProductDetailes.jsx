import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Shield, Battery, Wifi, Scale, ChevronDown, ChevronUp } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../Store/cartSlice';
import { products } from '../Data/Products';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSpecifications, setShowSpecifications] = useState(true);
  const [showFeatures, setShowFeatures] = useState(true);

  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (!product) {
      navigate('/not-found');
    }
  }, [product, navigate]);

  if (!product) return null;

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 py-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="relative aspect-square rounded-2xl overflow-hidden shadow-lg"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="text-3xl font-bold text-primary-600">
            ₹{product.price}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-primary-700 transition-colors duration-200"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Add to Cart</span>
          </button>

          {/* Specifications */}
          <div className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setShowSpecifications(!showSpecifications)}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="font-semibold">Specifications</span>
              {showSpecifications ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {showSpecifications && (
              <div className="p-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <Battery className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-500">Battery Life</p>
                    <p className="font-medium">{product.specifications.batteryLife}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Wifi className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-500">Connectivity</p>
                    <p className="font-medium">{product.specifications.connectivity}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-500">Dimensions</p>
                    <p className="font-medium">{product.specifications.dimensions}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Scale className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">{product.specifications.weight}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setShowFeatures(!showFeatures)}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="font-semibold">Features</span>
              {showFeatures ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {showFeatures && (
              <div className="p-4">
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-primary-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
