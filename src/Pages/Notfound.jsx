import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-8">The page you are looking for does not exist.</p>
      <Link to="/" className="text-primary-600 hover:text-primary-700">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
