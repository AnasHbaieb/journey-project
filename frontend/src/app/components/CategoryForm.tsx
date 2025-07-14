'use client';
import React, { useState, useEffect } from 'react';

interface CategoryFormProps {
  initialData?: {
    name: string;
    descreption: string;
    imageUrl?: string;
  };
  onSubmit: (formData: FormData) => void;
  loading: boolean;
  error: string | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSubmit, loading, error }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [descreption, setDescreption] = useState(initialData?.descreption || '');
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescreption(initialData.descreption);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('descreption', descreption);
    if (image) {
      formData.append('image', image);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
        <input
          type="text"
          id="name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="descreption" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
        <textarea
          id="descreption"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={descreption}
          onChange={(e) => setDescreption(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Image:</label>
        <input
          type="file"
          id="image"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        />
        {initialData?.imageUrl && !image && (
          <div className="mt-2">
            <p>Current Image:</p>
            <img src={initialData.imageUrl} alt="Current" className="w-32 h-32 object-cover rounded" />
          </div>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Category'}
      </button>
      {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
    </form>
  );
};

export default CategoryForm; 