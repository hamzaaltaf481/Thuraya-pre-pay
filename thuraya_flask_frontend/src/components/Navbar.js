import React from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";


const Navbar = () => {
  const handleLogout = () => {
    setTimeout(() => {
      localStorage.removeItem("token");
      window.location.reload();
    }, 3000);
    swal("Logout Successful", "You have been logged out successfully", "success");
  };

  return (
    <nav className="navbar bg-[#2D3E50] text-white h-[100px] w-full top-0 z-20 fixed ">
      <div className="flex justify-between items-center mt-3">
        <Link to="/" className="logo flex pl-20 gap-1">
          <img src="./images/lgg.png" className="w-[75px] h-[50px] mt-2 " />
          <h1 className="flex text-4xl font-bold pt-2  ">
            Thuraya<div className="text-[#7a9757]">PrePay</div>
          </h1>
        </Link>
        <div className="nav-links flex gap-12 justify-center items-center   ml-[800px] text-2xl font-bold mr-20">
          <Link
            className="border-b-4 border-transparent focus:border-[#7a9757] hover:border-[#7a9757] hover:text-[#7a9757]"
            to="/"
          >
            Home
          </Link>
          <div className="flex justify-center items-center gap-5">
          {localStorage.getItem("token") ? (
            <button
              onClick={handleLogout}
              className=" text-xl font-semibold border-[1px] px-6 border-[#7a9757] rounded-xl p-2 hover:text-[#7a9757]"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className=" text-xl font-semibold border-[1px] px-6 border-[#7a9757] rounded-xl p-2 hover:text-[#7a9757]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className=" text-xl font-semibold border-[1px] px-6 border-[#7a9757] rounded-xl p-2 hover:text-[#7a9757]"
              >
                Signup
              </Link>
            </>
          )}

          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
