import React, { useState } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setTimeout(() => {
      localStorage.removeItem("token");
      window.location.reload();
    }, 3000);
    swal(
      "Logout Successful",
      "You have been logged out successfully",
      "success"
    );
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? "auto" : "hidden";
  };

  return (
    <nav className="navbar bg-[#183567] text-white h-[100px] w-full top-0 z-20 fixed">
      <div className="flex justify-between items-center h-full px-4 md:px-20">
        <Link to="/" className="logo flex items-center gap-1">
        <div className="relative ml-6">
            <div className="absolute inset-0 bg-white md:w-[260px] h-20 mt-3 opacity-50 rounded-lg"></div>
            <img
              src="./images/navbar_logo.png"
              alt="Thuraya"
              className="relative w-60 md:w-[260px] mx-auto md:mx-0"
            />
          </div>
        </Link>

        {/* Full navigation for larger screens */}
        <div className="hidden md:flex items-center space-x-6 ">
          <Link className="text-2xl hover:text-[#339873]" to="/">
            Home
          </Link>
          {localStorage.getItem("token") ? (
            <button
              onClick={handleLogout}
              className="text-xl font-semibold border-[1px] px-6 border-[#236d52] bg-[#236d52] rounded-xl p-2 hover:bg-[#339873]"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xl font-semibold border-[1px] px-6 border-[#236d52] bg-[#236d52] rounded-xl p-2  hover:bg-[#339873] "
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-xl font-semibold border-[1px] px-6 border-[#236d52] bg-[#236d52]  rounded-xl p-2 hover:bg-[#339873] "
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Hamburger menu for smaller screens */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#183567] text-white z-30">
          <div className="flex justify-end p-4">
            <button onClick={toggleMenu}>
              <FaTimes size={24} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-full">
            <Link className="text-2xl hover:text-[#4CAF50]" to="/" onClick={toggleMenu}>
              Home
            </Link>
            {localStorage.getItem("token") ? (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="text-xl font-semibold border-[1px] px-6 border-[#236d52] bg-[#236d52] rounded-xl p-2 hover:bg-[#339873]  my-4"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xl font-semibold border-[1px] px-6 border-[#236d52] bg-[#236d52] rounded-xl p-2 hover:bg-[#339873]  my-4"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-xl font-semibold border-[1px] px-6 border-[#236d52] bg-[#236d52] rounded-xl p-2 hover:bg-[#339873]  my-4"
                  onClick={toggleMenu}
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
 // unit.units === 39
                              //   ? "bg-[#c640c2] "
                              //   : "text-black" ||
                              // unit.units === 50
                              //   ? "bg-[#8bc441] "
                              //   : "text-black" ||
                              // unit.units === 80
                              //   ? "bg-[#75d0f5] "
                              //   : "text-black" ||
                              // unit.units === 160
                              //   ? "bg-[#a8b6b6] "
                              //   : "text-black" ||
                              // unit.units === 500
                              //   ? "bg-[#3f48cc] "
                              //   : "text-black" ||
                              // unit.units === 1000
                              //   ? "bg-[#880015] "
                              //   : "text-black" ||
                              // unit.units === 2500
                              //   ? "bg-[#22b14c] "
                              //   : "text-black"