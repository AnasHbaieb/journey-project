import React from 'react';

export interface Article {
  id: number;
  title: string;
  langue: string;
  imageUrl: string;
  summary: string;
  published: boolean;
  publishedAt?: string;
  userId: number;
  categoryId: number;
  createdAt: string;
  user: {
    id: number;
    firstname: string;
    lastname: string;
  };
  category: {
    id: number;
    name: string;
  };
  favoriteId?: number; // Add favoriteId to track if the article is favorited and its favorite ID
}

interface ArticleCardProps {
  article: Article;
  isFavorited: boolean;
  onToggleFavorite: (articleId: number, isFavorited: boolean) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, isFavorited, onToggleFavorite }) => {
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-sm mx-auto">
      <div className="flex items-center p-4">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-2">
          {getInitials(article.user.firstname, article.user.lastname)}
        </div>
        <span className="text-gray-800 font-medium">{article.user.firstname} {article.user.lastname}</span>
      </div>
      {article.imageUrl ? (
        <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
          <span className="text-xl">Article Image</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full mr-2">
            {article.category?.name || 'Uncategorized'}
          </span>
          <span className="bg-gray-300 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
            {article.langue.toUpperCase()}
          </span>
        </div>
        <h2 className="text-xl font-bold mb-2">{article.title}</h2>
        <p className="text-gray-700 text-sm mb-4">{article.summary}</p>
        <p className="text-green-600 text-xs mb-4">CreatedAt: {formattedDate}</p>
        {article.published ? (
          <p className="text-green-600 text-xs mb-4">Published: {article.publishedAt}</p>
        ) : (
          <p className="text-red-600 text-xs mb-4">Published: null</p>
        )}
        <div className="flex justify-between">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Read Article
          </button>
          <button
            onClick={() => onToggleFavorite(article.id, isFavorited)}
            className={`font-bold py-2 px-4 rounded ${isFavorited ? 'bg-gray-400 text-gray-700 ' : 'bg-green-500 hover:bg-green-600 text-white'}`}
          >
            {isFavorited ? 'Favorited' : 'Favorite'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard; 