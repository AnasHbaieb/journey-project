'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArticleCard, { Article } from '../components/ArticleCard';

const FavoriteArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null); 
  const [favoritedArticles, setFavoritedArticles] = useState<any[]>([]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('iduser'); // Get userId from localStorage
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    }
  }, []);

  useEffect(() => {
    const fetchFavoritedArticles = async () => {
      if (!userId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5920/favorite/getfavorite/${userId}`);
        const favoritedData = response.data;
        console.log('Favorited Data from Backend:', favoritedData);
        setFavoritedArticles(favoritedData);

        const fetchedArticles = favoritedData.map((fav: { id: number; articleId: number; article: Article; }) => ({
          ...fav.article,
          user: fav.article.user || { id: fav.article.userId || 0, firstname: 'Unknown', lastname: 'User' },
          favoriteId: fav.id // Store the favorite ID to allow unfavoriting
        }));
        console.log('Fetched Articles (before unique filter):', fetchedArticles.map((a: Article) => a.id));

        // Filter out duplicate articles by article.id to ensure unique keys
        const uniqueArticles = Array.from(new Map(fetchedArticles.map((article: Article) => [article.id, article])).values()) as Article[];
        console.log('Unique Articles (after filter):', uniqueArticles.map((a: Article) => a.id));
        setArticles(uniqueArticles);
      } catch (err) {
        setError('Failed to fetch favorited articles. Please try again later.');
        console.error('Error fetching favorited articles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavoritedArticles();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'lastFavoriteChangeTimestamp') {
        console.log('localStorage changed, re-fetching favorites...');
        fetchFavoritedArticles();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [userId]);

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
          // Update local state to remove the unfavorited article
          setArticles(prevArticles => prevArticles.filter(article => article.id !== articleId));
          setFavoritedArticles(prevFav => prevFav.filter(fav => fav.articleId !== articleId));
          localStorage.setItem('lastFavoriteChangeTimestamp', Date.now().toString()); // Update timestamp
        }
      } 
      // Removed the 'else' block for adding to favorites, as it's not expected on this page
      // and can lead to duplicate key issues if an already favorited article is somehow clicked to be 'added'.
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">My Favorite Articles</h1>
      {articles.length === 0 ? (
        <p className="text-center">You have no favorited articles yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isFavorited={!!article.favoriteId}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteArticlesPage;

