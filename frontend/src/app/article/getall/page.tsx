'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArticleCard, { Article } from '../../components/ArticleCard';
import { useSearchParams } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

interface Category {
  id: string;
  name: string;
}

const GetAllArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;
  const params=useSearchParams()
  const [userId, setUserId] = useState<number | null>(null); // Assuming userId will be fetched from auth context or localStorage
  const [favoritedArticles, setFavoritedArticles] = useState<any[]>([]);
 

  useEffect(() => {
    const categoriesparam = params.get("category");
    setSelectedCategory(categoriesparam);

    const fetchArticlesAndFavorites = async () => {
      setLoading(true);
      setError(null);
      try {
        let currentFavoritedArticles: any[] = [];
        if (userId) {
          const favoriteResponse = await axios.get(`http://localhost:5920/favorite/getfavorite/${userId}`);
          currentFavoritedArticles = favoriteResponse.data;
          setFavoritedArticles(currentFavoritedArticles); // تحديث الحالة للاستخدامات الأخرى
        }

        let url = "";
        if (categoriesparam == null) {
          url = 'http://localhost:5920/article/getallarticle';
        } else {
          url = `http://localhost:5920/article/getarticlebycategory/${categoriesparam}`;
        }

        const articleResponse = await axios.get<Article[]>(url);
        setArticles(articleResponse.data.map(article => ({
          ...article,
          favoriteId: currentFavoritedArticles.find((fav: any) => fav.articleId === article.id)?.id
        })));

      } catch (err) {
        setError('Failed to fetch articles. Please try again later.');
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticlesAndFavorites();
  }, [selectedCategory, userId]); 
  useEffect(() => {
    const storedUserId = localStorage.getItem('iduser'); 
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>('http://localhost:5920/category/getcategory');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleToggleFavorite = async (articleId: number, isCurrentlyFavorited: boolean) => {
    if (!userId) {
      alert('Please log in to favorite articles.');
      return;
    }

    try {
      if (isCurrentlyFavorited) {
        // Remove from favorites
        const favoriteItem = favoritedArticles.find(fav => fav.articleId === articleId);
        if (favoriteItem) {
          await axios.delete(`http://localhost:5920/favorite/deletefavorite/${favoriteItem.id}`);
          setFavoritedArticles(favoritedArticles.filter(fav => fav.articleId !== articleId));
          setArticles(prevArticles => prevArticles.map(article => 
            article.id === articleId ? { ...article, favoriteId: undefined } : article
          ));
          localStorage.setItem('lastFavoriteChangeTimestamp', Date.now().toString()); // Update timestamp
          console.log('Article unfavorited. Updated articles:', articles);
        }
      } else {
        // Add to favorites
        const response = await axios.post('http://localhost:5920/favorite/addfavorite', {
          userId,
          articleId,
        });
        console.log('Add favorite response:', response.data);
        // Assuming the backend returns the new favorite item with an ID
        setFavoritedArticles([...favoritedArticles, { id: response.data.id, userId, articleId }]); // Use response.data.id
        setArticles(prevArticles => prevArticles.map(article => 
          article.id === articleId ? { ...article, favoriteId: response.data.id } : article // Use response.data.id
        ));
        localStorage.setItem('lastFavoriteChangeTimestamp', Date.now().toString()); // Update timestamp
        console.log('Article favorited. Updated articles:', articles);
      }
    } catch (err) {
      console.error('Error toggling favorite status:', err);
      alert('Failed to update favorite status. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;

    if (totalPages <= maxPageNumbersToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
      const endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">All Articles</h1>
      <div className="mb-4 flex flex-col md:flex-row items-center md:justify-end gap-4">
        <input
          type="text"
          placeholder="Search articles..."
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md mb-2 md:mb-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedCategory === null
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {categories.slice(0, 3).map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
          {categories.length > 3 && (
            <div className="relative">
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="px-3 py-1 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {showAllCategories && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  {categories.slice(3).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id === selectedCategory ? null : category.id);
                        setShowAllCategories(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        selectedCategory === category.id
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {filteredArticles.length === 0 ? (
        <p className="text-center">No articles available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isFavorited={!!article.favoriteId}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredArticles.length > articlesPerPage && (
        <div className="mt-8 w-full">
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </button>
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md p-2 text-gray-400 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>

                <div className="flex items-center gap-1">
                  {renderPageNumbers().map((pageNumber, index) => (
                    pageNumber === '...' ? (
                      <span key={index} className="px-3 py-1 text-gray-500">...</span>
                    ) : (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber as number)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                          currentPage === pageNumber
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        } rounded-md`}
                      >
                        {pageNumber}
                      </button>
                    )
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md p-2 text-gray-400 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllArticlesPage;
