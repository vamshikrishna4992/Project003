import React from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Smartphone, 
  Cloud, 
  Bell, 
  Map, 
  BarChart, 
  Shield, 
  Settings 
} from 'lucide-react';

const Software = () => {
  const features = [
    {
      icon: <Monitor className="h-8 w-8" />,
      title: 'Web Dashboard',
      description: 'Access your tracking data from any browser with our intuitive web interface.'
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: 'Mobile App',
      description: 'Stay connected on the go with our powerful mobile application.'
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: 'Cloud Storage',
      description: 'Secure cloud storage for all your tracking history and reports.'
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: 'Real-time Alerts',
      description: 'Instant notifications for important events and triggers.'
    },
    {
      icon: <Map className="h-8 w-8" />,
      title: 'Advanced Mapping',
      description: 'Detailed maps with custom overlays and route optimization.'
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: 'Analytics',
      description: 'Comprehensive reports and analytics for data-driven decisions.'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Security',
      description: 'Enterprise-grade security with end-to-end encryption.'
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: 'Customization',
      description: 'Flexible settings and configurations for your specific needs.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 py-12"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold mb-6">Software Solutions</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Powerful software solutions designed to give you complete control over your tracking devices
          with real-time monitoring and advanced analytics.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="text-primary-600 mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 bg-primary-50 rounded-2xl p-8 md:p-12"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Try Our Software</h2>
          <p className="text-lg text-gray-700">
            Experience the power of our tracking software with a free demo account.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <a
            href="#"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
          >
            Request Demo
          </a>
          <a
            href="#"
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
          >
            View Documentation
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Software;
