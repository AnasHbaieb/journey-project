import React, { useState } from 'react';

interface ImageUploadFieldProps {
  label: string;
  id: string;
  currentImageUrl?: string; 
  onFileSelect: (file: File | null) => void; 
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  id,
  currentImageUrl,
  onFileSelect,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onFileSelect(file); 
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      onFileSelect(null);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700 block">
        {label}
      </label>
      {previewUrl && (
        <div className="mt-2">
          <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
        </div>
      )}
      <input
        id={id}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full text-sm text-gray-600 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition duration-200"
      />
    </div>
  );
};

export default ImageUploadField; 