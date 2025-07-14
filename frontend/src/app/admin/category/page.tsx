'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  descreption: string;
  imageUrl: string;
}

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5920/category/getcategory');
      setCategories(response.data);
    } catch (err) {
      setError('Failed to fetch categories.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5920/category/deletecategory/${id}`);
      setCategories(categories.filter((category) => category.id !== id));
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('Failed to delete category.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Categories</h1>
      <Link href="/admin/category/new" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Add New Category
      </Link>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4 text-left text-green-700">Image</th>
              <th className="py-2 px-4 text-left text-green-700">Name</th>
              <th className="py-2 px-4 text-left text-green-700">Description</th>
              <th className="py-2 px-4 text-left text-green-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b">
                <td className="py-2 px-4">
                  {category.imageUrl ? (
                    <img src={category.imageUrl} alt={category.name} className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">No Image</div>
                  )}
                </td>
                <td className="py-2 px-4">{category.name}</td>
                <td className="py-2 px-4">{category.descreption}</td>
                <td className="py-2 px-4 flex space-x-2">
                  <Link href={`/admin/category/edit/${category.id}`} className="bg-yellow-500 text-white px-3 py-1 rounded">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryPage;
