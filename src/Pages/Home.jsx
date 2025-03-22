import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Package, 
  Dog, 
  Cpu,
  ArrowRight,
  Shield,
  Clock,
  MapPin,
  Battery
} from 'lucide-react';

const features = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Advanced Security',
    description: 'State-of-the-art encryption and security features to protect your assets',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Real-time Tracking',
    description: '24/7 live tracking with instant notifications and alerts',
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: 'Geofencing',
    description: "Set up virtual boundaries and receive alerts when they're crossed",
  },
  {
    icon: <Battery className="h-6 w-6" />,
    title: 'Long Battery Life',
    description: 'Extended battery life with smart power management',
  },
];

const productCategories = [
  {
    icon: <Car className="h-12 w-12" />,
    title: 'Wired Trackers',
    description: 'Professional vehicle tracking solutions',
    link: '/products/wired',
  },
  {
    icon: <Package className="h-12 w-12" />,
    title: 'Asset Trackers',
    description: 'Keep track of valuable assets and equipment',
    link: '/products/asset',
  },
  {
    icon: <Dog className="h-12 w-12" />,
    title: 'Pet Trackers',
    description: 'Monitor and protect your beloved pets',
    link: '/products/pet',
  },
  {
    icon: <Cpu className="h-12 w-12" />,
    title: 'OBD Trackers',
    description: 'Advanced vehicle diagnostics and tracking',
    link: '/products/obd',
  },
];

// Motion variant to reuse
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center" aria-label="Hero section with background image">
        <div
          role="img"
          aria-label="Tracking devices background"
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1492366254240-43affaefc3e3?auto=format&fit=crop&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <h1 className="text-5xl font-bold mb-6">
              Advanced GPS Tracking Solutions for Every Need
            </h1>
            <p className="text-xl mb-8">
              Secure, reliable, and real-time tracking for vehicles, assets, and pets.
              Experience the future of tracking technology with Vrisan.
            </p>
            <Link
              to="/products/wired"
              className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
            >
              Explore Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {productCategories.map((category, index) => (
            <motion.div
              key={category.title}
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <div className="text-primary-600 mb-4">{category.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <Link
                to={category.link}
                className="inline-flex items-center text-primary-600 hover:text-primary-700"
              >
                Learn More
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Vrisan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Vrisan for their tracking needs.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/contact"
              className="bg-white text-primary-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Contact Sales
            </Link>
            <Link
              to="/products/wired"
              className="border-2 border-white text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
