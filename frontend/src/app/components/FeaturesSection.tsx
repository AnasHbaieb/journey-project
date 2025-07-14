import React from 'react';

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-gray-950 text-white text-center">
      <h2 className="text-4xl font-bold mb-12">Why Choose Expert..Journey?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        <div className="p-8 rounded-lg bg-gray-800 border border-gray-700 flex flex-col items-center justify-center">
          {/* Placeholder for Icon */}
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
            {/* Icon will go here, e.g., <img src="/path/to/icon.svg" alt="Icon" /> */}
            <span className="text-3xl">💡</span>
          </div>
          <h3 className="text-2xl font-semibold mb-4">Real Inspiration</h3>
          <p className="text-md text-gray-300">
            Discover real-life experiences and lessons learned from experts' journeys, 
            mistakes, and triumphs.
          </p>
        </div>
        <div className="p-8 rounded-lg bg-gray-800 border border-gray-700 flex flex-col items-center justify-center">
          {/* Placeholder for Icon */}
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            {/* Icon will go here */}
            <span className="text-3xl">🚀</span>
          </div>
          <h3 className="text-2xl font-semibold mb-4">Actionable Insights</h3>
          <p className="text-md text-gray-300">
            Receive practical advice and actionable guidance you can apply to your 
            career pursuits immediately.
          </p>
        </div>
        <div className="p-8 rounded-lg bg-gray-800 border border-gray-700 flex flex-col items-center justify-center">
          {/* Placeholder for Icon */}
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
            {/* Icon will go here */}
            <span className="text-3xl">🌱</span>
          </div>
          <h3 className="text-2xl font-semibold mb-4">Career Growth</h3>
          <p className="text-md text-gray-300">
            Enhance your knowledge and skills, and unlock new opportunities for 
            personal and professional growth.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 