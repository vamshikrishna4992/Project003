import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, AlertCircle } from 'lucide-react';

const Tracking = () => {
  const [trackingId, setTrackingId] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleTracking = (e) => {
    e.preventDefault();
    // Simulated tracking result
    setSearchResult({
      status: 'In Transit',
      location: 'Mumbai, Maharashtra',
      timestamp: new Date().toLocaleString(),
      nextUpdate: '2 hours',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 py-12"
    >
      <div className="text-center mb-12">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold mb-4"
        >
          Track Your Device
        </motion.h1>
        <p className="text-xl text-gray-600">
          Enter your tracking ID to get real-time updates on your device
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleTracking} className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter tracking ID (e.g., VT-12345)"
              className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
            >
              Track
            </button>
          </div>
        </form>

        {searchResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-primary-600">
                  <MapPin className="h-6 w-6" />
                  <div>
                    <p className="text-sm text-gray-500">Current Location</p>
                    <p className="font-semibold">{searchResult.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-green-600">
                  <AlertCircle className="h-6 w-6" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-semibold">{searchResult.status}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-blue-600">
                  <Clock className="h-6 w-6" />
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-semibold">{searchResult.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-orange-600">
                  <Clock className="h-6 w-6" />
                  <div>
                    <p className="text-sm text-gray-500">Next Update In</p>
                    <p className="font-semibold">{searchResult.nextUpdate}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Tracking;
