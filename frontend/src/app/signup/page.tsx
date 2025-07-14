'use client'
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import axios from "axios";

export default function SignupPage() {
  const [firstName,setFirstName]=useState('')
  const [lastName,setLastName]=useState('')
  const [email,setemail]=useState('')
  const [password,setpassword]=useState('')
  const handleSignup= async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
const data={
 firstname: firstName,
 lastname: lastName,
 email: email,
 password: password
}
try {
  const response=await axios.post("http://localhost:5920/auth/signup",data,{
    withCredentials:true,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  console.log(response);
  
   if (response.status==200) {
    alert("user ajouter avec succes ")
   } if(response.status==400){
    alert("user déja existe")
   }
  
} catch (error) {
  console.log(error);
  
}

  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      <form className="flex flex-col gap-4 w-full max-w-sm" onSubmit={handleSignup}>
      <input
        type="text"
        placeholder="First Name"
        className="border rounded px-3 py-2"
        onChange={e=> setFirstName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        className="border rounded px-3 py-2"
        onChange={e=> setLastName(e.target.value)}
        required
      />
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
        Sign Up
      </button>
    </form>
      <Link href="/" className="mt-4 text-blue-600 hover:underline">
        Back to Home
      </Link>
    </div>
  );
} 