import React from 'react';

const StatisticsSection = () => {
  return (
    <section className="py-16 bg-gray-950 text-white text-center">
      <h2 className="text-4xl font-bold mb-12">Trusted by Professionals Worldwide</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
        <div className="p-6 rounded-lg bg-gray-800 border border-gray-700 flex flex-col items-center justify-center">
          <p className="text-5xl font-bold mb-2 text-green-400">500+</p>
          <p className="text-xl text-gray-300">Expert Stories</p>
        </div>
        <div className="p-6 rounded-lg bg-gray-800 border border-gray-700 flex flex-col items-center justify-center">
          <p className="text-5xl font-bold mb-2 text-yellow-400">50+</p>
          <p className="text-xl text-gray-300">Years of Experience</p>
        </div>
        <div className="p-6 rounded-lg bg-gray-800 border border-gray-700 flex flex-col items-center justify-center">
          <p className="text-5xl font-bold mb-2 text-purple-400">200+</p>
          <p className="text-xl text-gray-300">Success Stories</p>
        </div>
        <div className="p-6 rounded-lg bg-gray-800 border border-gray-700 flex flex-col items-center justify-center">
          <p className="text-5xl font-bold mb-2 text-red-400">15+</p>
          <p className="text-xl text-gray-300">Industries Covered</p>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection; 