'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import CategoryForm from '../../../../components/CategoryForm';

interface Category {
  id: number;
  name: string;
  descreption: string;
  imageUrl: string;
}

const EditCategoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          const response = await axios.get(`http://localhost:5920/category/getcategory`);
          const foundCategory = response.data.find((cat: Category) => cat.id === parseInt(id as string));
          if (foundCategory) {
            setCategory(foundCategory);
          } else {
            setError('Category not found.');
          }
        } catch (err) {
          setError('Failed to fetch category.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchCategory();
    }
  }, [id]);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`http://localhost:5920/category/updatecategory/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.push('/admin/category');
    } catch (err) {
      console.error('Failed to update category:', err);
      setError('Failed to update category.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!category) return <div>Category not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
      <CategoryForm
        initialData={category}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default EditCategoryPage; 