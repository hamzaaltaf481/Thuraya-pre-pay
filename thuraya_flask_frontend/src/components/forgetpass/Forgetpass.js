import React from "react";
import { Link } from "react-router-dom";

const forgetpass = () => {
  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-10 m-auto bg-white rounded-xl shadow-lg border-[1px] lg:max-w-xl ">
        <h1 className="text-3xl font-bold text-left text-[#2D3E50] ">
          Change Your Password
        </h1>
        <form className="mt-6">
          <div className="mb-2 mt-6">
            <input
              type="password"
              placeholder=" New Password"
              className="block w-full h-[70px] px-4 py-2 mt-2 text-[#2D3E50] bg-white border-[2px] rounded-xl focus:border-[#2D3E50] focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 shadow-md text-xl font-medium"
            />
          </div>
          <div className="flex mt-6">
            <Link to="/Login">
              <button className="flex w-[150px] h-[50px] px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-[#2D3E50] rounded-md hover:bg-[#7a9757] focus:outline-none focus:bg-[#7a9757] pt-2 gap-1 shadow-md font-medium">
                <h1 className=" text-xl ml-3 ">Enter</h1>
                <img
                  src="/images/arrow.png"
                  alt="i"
                  className="w-[20.25px] h-[24px] mt-1"
                />
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default forgetpass;
