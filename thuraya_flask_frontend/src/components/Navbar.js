import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar bg-[#2D3E50] text-white h-[100px] w-full top-0 z-10 fixed ">
      <div className="flex">
        <div className="logo flex pl-20 pt-8 gap-1">
          {/* <Link to="/"> */}
            <img src="./images/logo.png" className="w-[75px] h-[30px] mt-2 " />
            <h1 className="flex text-4xl font-bold  ">
              Thuraya<div className="text-[#7a9757]">Refill</div>
            </h1>
          {/* </Link> */}
        </div>

        <ul className="nav-links flex pt-8 gap-5 ml-[800px] text-2xl font-bold ">
          <Link
            className="border-b-4 border-transparent focus:border-[#7a9757] hover:border-[#7a9757] hover:text-[#7a9757]"
            to="/"
          >
            Home
          </Link>
        </ul>
        <Link
          to="/login"
          className="mt-7 ml-8 text-xl font-semibold border-[1px] px-6 border-[#7a9757] rounded-xl p-2 hover:text-[#7a9757]"
        >
          Login
        </Link>
        <Link
          to="/Signup"
          className="mt-7 ml-3 text-xl font-semibold border-[1px] px-5 border-[#7a9757] rounded-xl p-2 hover:text-[#7a9757]"
        >
          Signup
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
