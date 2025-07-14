'use client'
import React, { useState , useEffect } from "react";
import { Home, BookOpen, BarChart3, Settings, LogIn, Menu, User, Star} from "lucide-react";
import Link from "next/link";
const Dashboard = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => {

  const [iduser, setIduser] = useState<string | null>(null);
  const [nom, setNom] = useState<string | null>(null);
  const [prenom, setPrenom] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  React.useEffect(() => {
    setIduser(localStorage.getItem("iduser"));
    setNom(localStorage.getItem("nom"));
    setPrenom(localStorage.getItem("prenom"));

    const storedUserProfile = localStorage.getItem('userProfile');
    if (storedUserProfile) {
      try {
        const parsedProfile = JSON.parse(storedUserProfile);
        console.log('Dashboard: Initial profile loaded from localStorage:', parsedProfile);
        setProfileImageUrl(parsedProfile.imageUrl || null);
      } catch (e) {
        console.error("Dashboard: Failed to parse user profile from localStorage", e);
      }
    }

    const handleStorageChange = () => {
      console.log('Dashboard: Storage event triggered.');
      const updatedProfile = localStorage.getItem('userProfile');
      if (updatedProfile) {
        try {
          const parsedUpdatedProfile = JSON.parse(updatedProfile);
          console.log('Dashboard: Updated profile from storage event:', parsedUpdatedProfile);
          setProfileImageUrl(parsedUpdatedProfile.imageUrl || null);
        } catch (e) {
          console.error("Dashboard: Failed to parse updated user profile from localStorage (storage event)", e);
        }
      } else {
        setProfileImageUrl(null);
        console.log('Dashboard: userProfile removed from localStorage.');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };

  }, []);
  return (
    <>
      {/* Toggle button - always visible with high z-index */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-all duration-200 z-50 ${
          isOpen ? 'left-60' : 'left-4'
        }`}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white transition-all duration-300 ${
          isOpen ? "w-64" : "w-0"
        } overflow-hidden fixed h-full z-40`}
      >
        {isOpen && (
          <div className="h-full p-4 pt-16">
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-2xl font-bold">Dashboard</h2>
            </div>
            
            {/* Profile Section */}
           <Link href="/profile"> <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-gray-300 mb-2">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <User className="w-12 h-12" />
                )}
              </div>
              <p className="text-lg font-semibold">{nom || "anas "} {" "} {prenom || "anas"}</p>
            </div></Link>
            
            {/* Navigation */}
            <nav>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="flex items-center hover:bg-gray-700 p-3 rounded-lg transition-colors duration-200">
                    <Home className="mr-3 w-5 h-5" /> Home
                  </a>
                </li>
                <li>
                  <a href="/favorite" className="flex items-center hover:bg-gray-700 p-3 rounded-lg transition-colors duration-200">
                    <Star className="mr-3 w-5 h-5" /> Favorite
                  </a>
                </li>
                <li>
                  <a href="/article/getall" className="flex items-center hover:bg-gray-700 p-3 rounded-lg transition-colors duration-200">
                    <BookOpen className="mr-3 w-5 h-5" /> Articles
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center hover:bg-gray-700 p-3 rounded-lg transition-colors duration-200">
                    <BarChart3 className="mr-3 w-5 h-5" /> Statistics
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center hover:bg-gray-700 p-3 rounded-lg transition-colors duration-200">
                    <Settings className="mr-3 w-5 h-5" /> Settings
                  </a>
                </li>
                <li>
                  <a href="/signin" className="flex items-center hover:bg-gray-700 p-3 rounded-lg transition-colors duration-200">
                    <LogIn className="mr-3 w-5 h-5" /> Login
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};
export default Dashboard;