"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InputField from '../../components/InputField';
import ImageUploadField from '../../components/ImageUploadField';

interface UserData {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    descreption?: string;
    intrest?: string;
    adresse?: string;
    imageUrl?: string;
}

const EditProfilePage = () => {
    const [userData, setUserData] = useState<UserData>({
        id: 0,
        firstname: '',
        lastname: '',
        email: '',
        descreption: '',
        intrest: '',
        adresse: '',
        imageUrl: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        
        const fetchUserData = async () => {
            try {
             
                const userId = localStorage.getItem('iduser'); 
                if (!userId) {
                    router.push('/signin'); 
                    return;
                }
                const response = await fetch(`http://localhost:5920/auth/getuserbyid/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                setUserData(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target; 
        setUserData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleImageChange = (url: string) => {
        setUserData((prevData) => ({
            ...prevData,
            imageUrl: url,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            let updatedImageUrl = userData.imageUrl;

            if (selectedFile) {
                const formData = new FormData();
                formData.append('image', selectedFile);
                
                const uploadResponse = await fetch('http://localhost:5920/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(errorData.message || 'Failed to upload image');
                }
                const uploadData = await uploadResponse.json();
                updatedImageUrl = uploadData.imageUrl;
            }

            const response = await fetch(`http://localhost:5920/auth/updateuser/${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userData,
                    imageUrl: updatedImageUrl,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }
            alert('Profile updated successfully!');
            localStorage.setItem('userProfile', JSON.stringify({
                id: userData.id,
                firstname: userData.firstname,
                lastname: userData.lastname,
                email: userData.email,
                descreption: userData.descreption,
                intrest: userData.intrest,
                adresse: userData.adresse,
                imageUrl: updatedImageUrl
            }));
            router.push('/profile'); // Redirect to profile page after successful update
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Edit Profile
                </h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <InputField
                        label="First Name"
                        id="firstname"
                        type="text"
                        value={userData.firstname}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Last Name"
                        id="lastname"
                        type="text"
                        value={userData.lastname}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Email"
                        id="email"
                        type="email"
                        value={userData.email}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Description"
                        id="descreption"
                        type="textarea"
                        value={userData.descreption || ''}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Interests"
                        id="intrest"
                        type="text"
                        value={userData.intrest || ''}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Address"
                        id="adresse"
                        type="text"
                        value={userData.adresse || ''}
                        onChange={handleChange}
                    />
                    <ImageUploadField
                        label="Profile Image"
                        id="imageUrl"
                        currentImageUrl={userData.imageUrl}
                        onFileSelect={setSelectedFile} 
                    />

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;
