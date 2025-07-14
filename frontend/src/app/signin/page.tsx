'use client'
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import axios from "axios";

export default function SigninPage() {
    const [email,setemail]=useState('')
    const [password,setpassword]=useState('')
    const handleSignin= async(e:FormEvent<HTMLFormElement>)=>{
      e.preventDefault()
  const data={
    email,
    password
  }
  try {
    const response=await axios.post("http://localhost:5920/auth/signin",data, {
      withCredentials:true,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log(response);
    
     if (response.status==200) {
      alert("email d'activation envoyer avec succes ")
      localStorage.setItem("token",response.data.token)
      localStorage.setItem("iduser",response.data.utilistauer.id)
      localStorage.setItem("prenom",response.data.utilistauer.firstname)
      localStorage.setItem("nom",response.data.utilistauer.lastname)

    
      } else if(response.status==401){
      alert("Check your email or password")
     }
    
     } catch (error:any) {
  
    console.log(error);
    if (error.response) {
      
     alert(error.response.data || "An error occurred");
   } else {
     alert("An error occurred during signin.");
   }
  }
}
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>
      <form className="flex flex-col gap-4 w-full max-w-sm" onSubmit={handleSignin}>
      <input
        type="email"
        placeholder="Email"
        className="border rounded px-3 py-2"
        onChange={e=> setemail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="border rounded px-3 py-2"
        onChange={e=> setpassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
      >
        Sign In
      </button>
    </form>
      <Link href="/" className="mt-4 text-blue-600 hover:underline">
        Back to Home
      </Link>
    </div>
  );
} 