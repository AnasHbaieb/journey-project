'use client'
import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import InputField from '@/app/components/InputField';
import CheckboxField from '@/app/components/CheckboxField';
import { useRouter } from 'next/navigation';

interface categorie{
  id:number;
  name:String;
  descreption?:string;
imageUrl?: string
}
export default function AddArticle() {
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [contenu, setContenu] = useState('')
    const [langue, setLangue] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [summary, setSummary] = useState('')
    const [published, setPublished] = useState(false)
    const [publishedAt, setPublishedAt] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [allcategory,setAllCategory]= useState<categorie[]>()
    const [categorieSelected,setcategorieSelected]=useState('')

    let iduser=localStorage.getItem("iduser") || null
    const router = useRouter();
    const AjoutArticle = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            setErrorMessage(null);
            setSuccessMessage(null);

            if (!title || !contenu || !langue || !summary || !categorieSelected || !iduser) {
                setErrorMessage("Please fill in all required fields (Title, Content, Language, Summary).");
                return;
            }

            setIsLoading(true);

            const new_article = new FormData()
            new_article.append("title", title)
            new_article.append("slug", slug)
            new_article.append("contenu", contenu)
            new_article.append("langue", langue)
            new_article.append("summary", summary)
            new_article.append("published", String(published))
            
            new_article.append("userId",iduser)
        
            if (publishedAt) {
                new_article.append("publishedAt", new Date(publishedAt).toISOString())
            }
         
            
            new_article.append("categoryId", categorieSelected)
 
            if (selectedFile) {
                new_article.append("image", selectedFile)
            }

            const response = await axios.post("http://localhost:5920/article/addarticle", new_article, {
                withCredentials: true,
            })
            
            if (response.status === 200) {
                setSuccessMessage("Article added successfully!");
                setTitle('');
                setSlug('');
                setContenu('');
                setLangue('');
                setSelectedFile(null);
                setSummary('');
                setPublished(false);
                setPublishedAt('');
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                  setSuccessMessage(null);
                  router.push('/profile');
                }, 3000);
            } else {
                setErrorMessage(response.data.message || "Failed to add article. Please try again.");
            }
        } catch (error: any) {
            console.error(error);
            setErrorMessage(error.response?.data?.message || "An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const handlefile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setSelectedFile(e.target.files?.[0])
        }
    }
    useEffect(()=>{
      getallcatgeory()
    },[])
const getallcatgeory=async()=>{
  try {
    const response=await axios.get("http://localhost:5920/category/getcategory")
    if(response.status==200){
      setAllCategory(response.data)
    }
  } catch (error) {
    console.log(error);
    
  }
}
const handleCatgeory=(e: React.ChangeEvent<HTMLSelectElement>)=>{
    setcategorieSelected(e.target.value)

}
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Article</h1>
                    <p className="text-lg text-gray-600">Share your thoughts with the world</p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-green-700">Success!</h3>
                                <button onClick={() => setSuccessMessage(null)} className="text-gray-400 hover:text-gray-600">&times;</button>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-green-700 font-medium">{successMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-red-700">Error!</h3>
                                <button onClick={() => setErrorMessage(null)} className="text-gray-400 hover:text-gray-600">&times;</button>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <p className="text-red-700 font-medium">{errorMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600">
                        <h2 className="text-2xl font-semibold text-white">Article Details</h2>
                        <p className="text-blue-100 mt-1">Fill in the information below to create your article</p>
                    </div>

                    <form onSubmit={AjoutArticle} className="px-8 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <InputField
                                    label="Title"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter an engaging title"
                                />
                                
                                <InputField
                                    label="Slug"
                                    id="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="url-friendly-slug"
                                />
                                
                                <InputField
                                    label="Language"
                                    id="langue"
                                    value={langue}
                                    onChange={(e) => setLangue(e.target.value)}
                                    placeholder="e.g., English, French, Spanish"
                                />

                                <div className="space-y-4">
                                    <CheckboxField
                                        label="Published"
                                        id="published"
                                        checked={published}
                                        onChange={(e) => setPublished(e.target.checked)}
                                    />
                                    
                                    <InputField
                                        label="Published At"
                                        id="publishedAt"
                                        type="date"
                                        value={publishedAt}
                                        onChange={(e) => setPublishedAt(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="image" className="text-sm font-semibold text-gray-700 block">Featured Image</label>
                                    <input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handlefile}
                                        className="w-full text-sm text-gray-600 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition duration-200"
                                    />
                                </div>
                                <select name="" id=""
                                value={categorieSelected}
                                onChange={handleCatgeory}
                                required
                                >
                                  <option value="">Select a category</option>
                                  {allcategory?.map(cat=>(
                                    <option  key={cat.id}  value={cat.id}>{cat.name} </option>
                                  ))}
                                </select>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <InputField
                                    label="Summary"
                                    id="summary"
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    placeholder="Write a compelling summary..."
                                    rows={4}
                                />
                                
                                <InputField
                                    label="Content"
                                    id="contenu"
                                    value={contenu}
                                    onChange={(e) => setContenu(e.target.value)}
                                    placeholder="Write your article content here..."
                                    rows={12}
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {errorMessage && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <p className="text-red-700 font-medium">{errorMessage}</p>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg shadow-lg"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Publishing Article...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Publish Article
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-gray-500 text-sm">
                        Need help? Check out our 
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium ml-1">writing guidelines</a>
                    </p>
                </div>
            </div>
        </div>
    )
}