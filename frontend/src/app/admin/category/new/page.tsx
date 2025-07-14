'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import CategoryForm from '../../../components/CategoryForm';

const AddCategoryPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    try {
      await axios.post('http://localhost:5920/category/addcategory', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.push('/admin/category');
    } catch (err) {
      console.error('Failed to add category:', err);
      setError('Failed to add category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Category</h1>
      <CategoryForm onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  );
};

export default AddCategoryPage;