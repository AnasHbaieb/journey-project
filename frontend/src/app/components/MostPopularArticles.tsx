import React from "react";
import { mostPopularArticles } from "../data/mockdata";
import { FaFire } from 'react-icons/fa';

interface MostPopularArticlesProps {
  articles: typeof mostPopularArticles;
}
export default function MostPopularArticles({ articles }: MostPopularArticlesProps) {
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <span className="text-red-500 mr-2"><FaFire /></span> Most Popular Articles
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {articles.map((article) => (
          <div key={article.id} className="flex items-start p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-300">
            <div className={`w-10 h-10 rounded-lg mr-3 ${article.categoryColor}`}></div>
            <div>
              <h3 className="text-md font-semibold text-gray-800">{article.title}</h3>
              <p className="text-sm text-gray-600">{article.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 