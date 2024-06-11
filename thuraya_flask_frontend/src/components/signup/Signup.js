import React, { useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
export default function Signup() {
  const[name,setName]= useState('')
  // const[lname,setLname]= useState('')
  const[email,setEmail]= useState('')
  const[password,setPassword]= useState('')
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);

      // Send form data to backend API
      const response = await axios.post('http://localhost:5000/api/signup',formData).then((response)=>{
        console.log(response)
      })
      // console.log('Form submitted successfully:', response);
      // Show success message or handle other actions
    } catch (error) {
      console.error('Error submitting form:', error);
      // Show error message to the user
    }
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div  className="w-full pt-10 pl-10 pr-10 pb-10 m-auto bg-white rounded-xl shadow-lg border-[1px] lg:max-w-xl ">
        <h1 className="text-3xl font-bold text-left text-[#2D3E50] ">
          SignUp
        </h1>
        <form onSubmit={handleSignUp} className="mt-6">
          <div className=" flex mb-2 gap-[10px]">
            <input
              type="Text"
              placeholder="First Name"
              className="block w-full h-[70px] px-4 py-2 mt-2 text-[#2D3E50] bg-white border-[2px] rounded-xl focus:border-[#2D3E50] focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 shadow-md text-xl font-medium"
              value={name}
        onChange={(e) => setName(e.target.value)}
            />
            <input
              type="Text"
              placeholder="Last Name"
              className="block w-full px-4 py-2 mt-2 text-[#2D3E50] bg-white border-[2px] rounded-xl focus:border-[#2D3E50] focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 shadow-md text-xl font-medium"
            />
          </div>
          <div className="mb-2 mt-6">
            <input
              type="email"
              placeholder="Email"
              className="block w-full h-[70px] px-4 py-2 mt-2 text-[#2D3E50] bg-white border-[2px] rounded-xl focus:border-[#2D3E50] focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 shadow-md text-xl font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-2 mt-6">
            <input
              type="password"
              placeholder="Password"
              className="block w-full h-[70px] px-4 py-2 mt-2 text-[#2D3E50] bg-white border-[2px] rounded-xl focus:border-[#2D3E50] focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 shadow-md text-xl font-medium"
              value={password}
        onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex mt-6">
            <button type='submit' className="flex w-[150px] h-[50px] px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-[#2D3E50] rounded-md hover:bg-[#7a9757] focus:outline-none focus:bg-[#2D3E50]  pt-2 gap-1 shadow-md font-medium">
              <h1 className=" text-xl ml-3" >
                Signup
              </h1>
              <img
                src="/images/arrow.png"
                alt="i"
                className="w-[20.25px] h-[24px] mt-1"
              />
            </button>
            <a
              href="#"
              className="text-md text-[#2D3E50] hover:underline ml-[210px] mt-4"
            >
              Forget Password?
            </a>
          </div>
        </form>

        <p className="mt-8 text-sm font-light text-center text-gray-700">
          {" "}
          Have an account?{" "}
          <Link to="/login" className="font-medium text-[#2D3E50] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
