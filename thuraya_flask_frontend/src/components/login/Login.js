import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import swal from "sweetalert";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      // Show loading alert if response is not ready
      swal("Loading", "Please wait...", "info");

      // Send form data to backend API
      const response = await axios.post(
        "http://localhost:5000/api/login",
        formData
      );
      if (response.status === 200) {
        swal("Success!", "Logged in successfully", "success");
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      localStorage.setItem('token', response.data.access_token);
      } else {
        throw new Error("Error logging in");
      }
    } catch (error) {
      console.log("Error logging in:", error);
      // Show error message
      swal("Error!", `${error.response.data.message}`, "error");
    }
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full pt-10 pl-10 pr-10 pb-10 m-auto bg-white rounded-xl shadow-lg border-[1px] lg:max-w-xl ">
        <h1 className="text-3xl font-bold text-left text-[#2D3E50] ">Login</h1>
        <form onSubmit={handleLogin} className="mt-6">
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
            <button
              type="submit"
              className="flex w-[150px] h-[50px] px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-[#2D3E50] rounded-md hover:bg-[#7a9757] focus:outline-none focus:bg-[#2D3E50]  pt-2 gap-1 shadow-md font-medium"
            >
              <h1 className=" text-xl ml-3">Login</h1>
              <img
                src="/images/arrow.png"
                alt="i"
                className="w-[20.25px] h-[24px] mt-1"
              />
            </button>
            <a
              href="/forget-pass"
              className="text-md text-[#2D3E50] hover:underline ml-[210px] mt-4"
            >
              Forget Password?
            </a>
          </div>
        </form>

        <p className="mt-8 text-sm font-light text-center text-gray-700">
          {" "}
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-[#2D3E50] hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}