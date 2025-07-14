'use client'
import React, { useState } from "react";
import { mostPopularArticles } from "./data/mockdata";
import { FaBars } from "react-icons/fa";
import HeroSection from "./components/HeroSection";
import StatisticsSection from "./components/StatisticsSection";
import FeaturesSection from "./components/FeaturesSection";
import Dashboard from "./components/Dashboard";
import CategorySection from"./components/Catgeorypage"
export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">


      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 `}>
        <HeroSection articles={mostPopularArticles} />
        <div className="relative overflow-hidden  text-center flex justify-center bg-[#330066] "
           
        >
       <CategorySection />
       </div> 
        <main className="flex-1 p-8 bg-gray-900 text-white">
          <StatisticsSection />
          <FeaturesSection />
        </main>
      </div>
    </div>
  );
}
