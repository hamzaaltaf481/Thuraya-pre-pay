import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import swal from "sweetalert";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      // Show loading alert if response is not ready
      swal("Loading", "Please wait...", "info");

      // Send form data to backend API
      const response = await axios.post(
        "http://localhost:5000/api/signup",
        formData
      );
      console.log(response);
      if (response.status === 200) {
        swal("Success!", "Form submitted successfully", "success");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        throw new Error("Error submitting form");
      }
    } catch (error) {
      console.log("Error submitting form:", error);
      // Show error message
      swal(
        "Error!",
        `Error submitting form: ${error?.response?.data?.message}`,
        "error"
      );
    }
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden px-4 sm:px-0 mt-20">
      <div className="w-full pt-10 px-4 pb-10 m-auto bg-white rounded-xl shadow-lg border-[1px] lg:max-w-xl sm:px-10">
        <h1 className="text-3xl font-bold text-left text-[#2D3E50]">SignUp</h1>
        <form onSubmit={handleSignUp} className="mt-6">
          <div className="flex flex-col sm:flex-row mb-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="block w-full h-[70px]  px-4 py-2 mt-2 text-[#2D3E50] bg-white border-[2px] rounded-xl focus:border-[#2D3E50] focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 shadow-md text-xl font-medium"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="block w-full h-[70px] px-4 py-2 mt-2 text-[#2D3E50] bg-white border-[2px] rounded-xl focus:border-[#2D3E50] focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 shadow-md text-xl font-medium"
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
              className="block w-full h-[70px]  px-4 py-2 mt-2 text-[#2D3E50] bg-white border-[2px] rounded-xl focus:border-[#2D3E50] focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 shadow-md text-xl font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row mt-6 items-center lg:gap-[240px] gap-4">
            <button
              type="submit"
              className="flex w-full sm:w-auto h-[50px] px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-[#2D3E50] rounded-md hover:bg-[#7a9757] focus:outline-none focus:bg-[#2D3E50] gap-1 shadow-md font-medium items-center justify-center"
            >
              <h1 className="text-xl">Signup</h1>
              <img
                src="/images/arrow.png"
                alt="Arrow"
                className="w-[20.25px] h-[24px]"
              />
            </button>
            <a
              href="#"
              className="text-md text-[#2D3E50] hover:underline mt-4 sm:mt-0"
            >
              Forget Password?
            </a>
          </div>
        </form>
        <p className="mt-8 text-sm font-light text-center text-gray-700">
          Have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[#2D3E50] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
