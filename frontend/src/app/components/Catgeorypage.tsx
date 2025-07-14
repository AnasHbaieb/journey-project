"use client"
import React ,{useState,useEffect} from "react";
import {categories} from "../data/datacategory"
import { FaTh } from 'react-icons/fa';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import axios from "axios";
import Link from "next/link";
import "./style.css"
interface CategorySection {
  category: typeof categories;
}
interface categorie{
  id:number;
  name:String;
  descreption?:string;
imageUrl?: string
}
export default function CategorySection() {
  const [AllCatgories,setAllCatgories]=useState([])

    const [currentPage, setCurrentPage] = useState(1);
   let nombre_category= 4
  let nombre_page = Math.ceil(AllCatgories.length / nombre_category);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5; 

    if (nombre_page <= maxPageNumbersToShow) {
      for (let i = 1; i <= nombre_page; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
      const endPage = Math.min(nombre_page, startPage + maxPageNumbersToShow - 1);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < nombre_page) {
        if (endPage < nombre_page - 1) {
          pageNumbers.push('...');
        }
        pageNumbers.push(nombre_page);
      }
    }
    return pageNumbers;
  };

  const indexOfLast = currentPage * nombre_category;
  const indexOfFirst = indexOfLast - nombre_category;
  const currentArticles:categorie[] = AllCatgories.slice(indexOfFirst, indexOfLast);
useEffect(()=>{
  fetchAllCategories()
},[])
const fetchAllCategories=async()=>{
  const response=await axios.get("http://localhost:5920/category/getcategory")
  const data=await response.data

  setAllCatgories(data)
}
  return (
    <div className="flex flex-col items-center w-full">
      <section className="bg-white rounded-3xl shadow-md p-6 w-[95.5%] mt-4 mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="text-red-500 mr-2"><FaTh /></span> All Category
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {currentArticles.map((category) => (
            <div key={category.id}>
           <Link href={`/article/getall?category=${category.id}`}><div
             
              className="flex gap-4 items-start p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-300 shadow-sm"
            >
              <img
                src={category.imageUrl}
                alt="this is image "
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.descreption}</p>
              </div>
            </div>
            </Link>
            </div>
          ))}
        </div>
  
        {/* Pagination */}
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
                onClick={() => setCurrentPage(Math.min(nombre_page, currentPage + 1))}
                disabled={currentPage === nombre_page}
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
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        } rounded-md`}
                      >
                        {pageNumber}
                      </button>
                    )
                  ))}
                </div>
  
                <button
                  onClick={() => setCurrentPage(Math.min(nombre_page, currentPage + 1))}
                  disabled={currentPage === nombre_page}
                  className="relative inline-flex items-center rounded-r-md p-2 text-gray-400 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}