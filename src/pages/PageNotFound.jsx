import React from 'react';

const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops! Page Not Found</h1>
        <p className="text-lg text-gray-700 mb-8">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <p className="text-lg text-gray-700 mb-8">Please check the URL for any mistakes or <a href="/" className="text-blue-600 hover:underline">return to the homepage</a>.</p>
      </div>
    </div>
  );
};

export default PageNotFound;
