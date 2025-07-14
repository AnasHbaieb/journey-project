'use client'
import React, { useState, useEffect } from 'react';
import { User, Edit3, Plus, Calendar, Eye, MessageCircle, Heart, Share2, MoreVertical, BookOpen, Users, UserPlus,Trash2, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

interface Article {
  id: number;
  title: string;
  slug?: string | null; 
  contenu: string;
  langue: string;
  image: string;
  summary: string;
  published: boolean;
  publishedAt?: string | null; 
  createdAt: string; 
  userId: number;
  categoryId: number;
  category?: { id: number; name: string; }; // Add this line
}

interface UserInfo {
  name: string;
  descreption: string;
  joinDate: string;
  location: string;
  articlesCount: number;
  avatar: string | null;
  email: string;
  intrest:string;
  adresse:string;
}

const ProfilePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    descreption: "",
    joinDate: "",
    location: "",
    articlesCount: 0, 
    avatar: null,
    email: "",
    intrest:"",
    adresse:""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = localStorage.getItem("iduser"); 
        if (!userId) {
          router.push('/signin'); 
          return;
        }
        const userResponse = await axios.get(`http://localhost:5920/auth/getuserbyid/${userId}`);
        const userData = userResponse.data;
        setUserInfo(prevInfo => ({
          ...prevInfo,
          name: `${userData.firstname || ''} ${userData.lastname || ''}`.trim() || "John Developer",
          descreption: userData.descreption || "",
          joinDate: userData.createdAt ? formatDate(userData.createdAt) : "N/A",
          location: userData.adresse || "N/A",
          avatar: userData.imageUrl || null,
          email:userData.email || "N/A",
          intrest:userData.intrest || "N/A",
          adresse:userData.adresse || "N/A",
        }));
      } catch (err) {
        setError('Failed to fetch user data. Please try again later.');
        console.error('Error fetching user data:', err);
      }
    };

    const fetchUserArticles = async () => {
      try {
        const userId = localStorage.getItem("iduser"); 
        if (!userId) {
          router.push('/signin'); 
          return;
        }
        const response = await axios.get<Article[]>(`http://localhost:5920/article/getarticlebyuser/${userId}`);
        setArticles(response.data.map(article => ({
          ...article,
          readTime: `${Math.ceil(article.contenu.length / 200)} min read`,
        })));
        setUserInfo(prevInfo => ({
            ...prevInfo,
            articlesCount: response.data.length
        }));
      } catch (err) {
        setError('Failed to fetch articles. Please try again later.');
        console.error('Error fetching user articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchUserArticles();
  }, []);

  const formatDate = (dateString:string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDeleteArticle = async (articleId: number) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await axios.delete(`http://localhost:5920/article/deletearticle/${articleId}`);
        setArticles(articles.filter(article => article.id !== articleId));
        setUserInfo(prevInfo => ({
          ...prevInfo,
          articlesCount: prevInfo.articlesCount - 1
        }));
        alert('Article deleted successfully!');
      } catch (err) {
        setError('Failed to delete article. Please try again later.');
        console.error('Error deleting article:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center  shadow-xl  max-w-350 mx-auto mt-8" >
     
      <div className="bg-white shadow-sm w-270 mx-auto mt-3 rounded-4xl " >
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                {userInfo.avatar ? (
                  <img src={userInfo.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{userInfo.name}</h1>
                <p className="text-gray-600 mt-1 max-w-md">{userInfo.descreption}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>Joined {userInfo.joinDate}</span>
                  <span>•</span>
                  <span>{userInfo.location}</span>
                </div>
              </div>
            </div>
            <Link href="/profile/edit">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button></Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{userInfo.articlesCount}</p>
                <p className="text-gray-600">Articles</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto w-300 px-4 pb-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'articles'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('articles')}
              >
                Articles ({articles.length})
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'about'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('about')}
              >
                About
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'articles' && (
              <div>
                {/* Add Article Section */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">My Articles</h2>
                  <button
                    onClick={() => router.push('/article/add')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Article</span>
                  </button>
                </div>

                {loading && <div className="text-center py-8">Loading articles...</div>}
                {error && <div className="text-center py-8 text-red-500">{error}</div>}
                {!loading && !error && (
                <div className="space-y-6">
                  {articles.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No articles yet. Create your first article!</p>
                    </div>
                  ) : (
                    articles.map((article) => (
                      <div key={article.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow w-250">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.contenu}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(article.createdAt)}</span>
                              </span>
                              {article.category?.name && (
                                <span className="flex items-center space-x-1 ml-4">
                                  <BookOpen className="w-4 h-4" />
                                  <span>{article.category.name}</span>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="relative">
                            <button className="text-gray-400 hover:text-gray-600"
                              onClick={() => setIsOpen(isOpen === article.id ? null : article.id)}
                            >
                              <MoreVertical className="w-5 h-5"/>
                            </button>

                            {isOpen === article.id && (
                              <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-50">
                                <button
                                  onClick={() => {
                                    router.push(`/article/edit/${article.id}`);
                                    setIsOpen(null);
                                  }}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteArticle(article.id)}
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                           
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">About Me</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {userInfo.descreption}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Skills & Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {userInfo.intrest.split(',').map((skill, index) => (
                        <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Location:</strong> {userInfo.location}</p>
                      <p><strong>Member since:</strong> {userInfo.joinDate}</p>
                      <p><strong>Email:</strong> {userInfo.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;