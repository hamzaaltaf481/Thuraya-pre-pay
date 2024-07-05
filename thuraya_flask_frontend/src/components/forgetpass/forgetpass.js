import React, { useState } from "react";
import axios from "axios";
import swal from "sweetalert";

const Forgetpass = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("email", email);
    try {
      swal("Loading", "Please wait...", "info");
      const host = process.env.REACT_APP_ENV === 'production' ? process.env.REACT_APP_PROD_HOSTNAME : 'localhost';
      const response = await axios.post(
        `http://${host}:5000/api/forgot-password`,
        data
      );
      if (response.status === 200) {
        swal("Success!", "Password reset link sent to your email", "success");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        throw new Error("Error sending password reset link");
      }
    } catch (error) {
      console.error("Error sending password reset link:", error);
      swal("Error!", `${error}`, "error");
    }
  };
  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-10 m-auto bg-white rounded-xl shadow-lg border-[1px] lg:max-w-xl ">
        <h1 className="text-3xl font-bold text-left text-[#2D3E50] ">
          Enter your email
        </h1>
        <form className="mt-6">
          <div className="mb-2 mt-6">
            <input
              type="email"
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full h-[70px] px-4 py-2 mt-2 text-[#2D3E50] bg-white border-[2px] rounded-xl focus:border-[#2D3E50] focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 shadow-md text-xl font-medium"
            />
          </div>
          <div className="flex mt-6" onClick={(e) => handleForgotPassword(e)}>
            <button className="flex justify-centeer items-center gap-5 w-[150px] h-[50px] px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-[#2D3E50] rounded-md hover:bg-[#7a9757] focus:outline-none focus:bg-[#7a9757] pt-2 shadow-md font-medium">
              <h1 className=" text-xl ">Proceed</h1>
              <img
                src="/images/arrow.png"
                alt="i"
                className="w-[20.25px] h-[24px] "
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Forgetpass;
