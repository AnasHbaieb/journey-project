import React from 'react';
import MostPopularArticles from "./MostPopularArticles";

interface HeroSectionProps {
  articles: any[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ articles }) => {
  return (
    <section className="relative overflow-hidden py-20 text-center text-white"
      style={{ background: 'linear-gradient(180deg, #1A0033 0%, #330066 100%)' }}>
      <div className="container mx-auto px-4">
        <p className="text-lg mb-2">Browse Professionals & Experts</p>
        <h1 className="text-6xl font-bold mb-4">
          Discover <span className="bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">Most Popular Articles</span>
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Explore the inspiring professional journeys of industry experts. Learn from
          their experiences, mistakes, and achievements as they share their path to
          <span className="font-bold text-blue-300"> SUCCESS.</span>
        </p>
        <div className="flex justify-center mb-12">
          <input
            type="text"
            placeholder="Search for an expert or topic..."
            className="p-4 rounded-l-lg border-none outline-none w-full max-w-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
          />
          <button className="bg-purple-600 px-6 py-4 rounded-r-lg hover:bg-purple-700 font-semibold text-lg">
            Search
          </button>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12">
        <MostPopularArticles articles={articles} />
      </div>
    </section>
  );
};

export default HeroSection; 