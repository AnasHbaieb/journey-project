'use client'
import React, { useState, FormEvent } from "react";
import axios from "axios";

export default function VerificationPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    const data = {
      codeverif: parseInt(code),
    };
    try {
      const response = await axios.put("http://localhost:5920/auth/verify", data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response);

      if (response.status==200) {
        alert("Account verified successfully!")
       } if(response.status==400){
        alert("Invalid user avec code.")
       }
      
    } catch (error) {
      console.log(error);
      
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Account Verification</h1>
      <p className="text-gray-600 mb-4">Please enter the code sent to your email.</p>
      <form className="flex flex-col gap-4 w-full max-w-sm" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Verification Code"
        className="border rounded px-3 py-2"
        required
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={4}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
      >
        Verify Account
      </button>
      {message && (
        <p className={isError ? "text-red-500" : "text-green-500"}>
          {message}
        </p>
      )}
    </form>
    </div>
  );
} 