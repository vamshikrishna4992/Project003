import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Target, Award } from 'lucide-react';

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const values = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Trust & Security',
      description: 'We prioritize the security of your data and devices with state-of-the-art encryption.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Customer First',
      description: 'Our dedicated support team is available 24/7 to assist you with any queries.'
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Innovation',
      description: 'Continuously developing new features and improving our tracking solutions.'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Quality',
      description: 'Premium hardware and software solutions built to last.'
    }
  ];

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      className="max-w-6xl mx-auto px-4 py-12"
    >
      <motion.div {...fadeIn} className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About Vrisan Trackings</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Leading provider of GPS tracking solutions, empowering businesses and individuals 
          with cutting-edge technology for enhanced security and efficiency.
        </p>
      </motion.div>

      <motion.div 
        {...fadeIn}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
      >
        {values.map((value, index) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="text-primary-600 mb-4">{value.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
            <p className="text-gray-600">{value.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        {...fadeIn}
        className="bg-primary-50 rounded-2xl p-8 md:p-12"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-8">
            To provide innovative tracking solutions that enhance security, improve efficiency, 
            and bring peace of mind to our customers through reliable technology and exceptional service.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-2xl font-bold text-primary-600 mb-2">1000+</h3>
              <p className="text-gray-600">Active Devices</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-2xl font-bold text-primary-600 mb-2">24/7</h3>
              <p className="text-gray-600">Support</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-2xl font-bold text-primary-600 mb-2">98%</h3>
              <p className="text-gray-600">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default About;
