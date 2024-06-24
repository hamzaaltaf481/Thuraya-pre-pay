import React, { useState } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { FaBars, FaTimes } from "react-icons/fa"; // Using react-icons for the hamburger icon

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
    document.body.style.overflow = isMenuOpen ? "auto" : "hidden"; // Prevent scrolling when menu is open
  };

  return (
    <nav className="navbar bg-[#2D3E50] text-white h-[100px] w-full top-0 z-20 fixed">
      <div className="flex justify-between items-center h-full px-4 md:px-20">
        <Link to="/" className="logo flex items-center gap-1">
          <img
            src="./images/lgg.png"
            className="w-[75px] h-[50px] mt-2 lg:ml-[600px]"
            alt="Logo"
          />
          <h1 className="text-4xl font-bold pt-2">
            Thuraya <span className="text-[#7a9757]">PrePay</span>
          </h1>
        </Link>
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-[#2D3E50] text-white z-30 ">
            <div className="flex justify-end p-4 translate-x-0 w-[33%]">
              <button onClick={toggleMenu}>
                <FaTimes size={24} />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center h-full">
              <Link className="text-2xl" to="/" onClick={toggleMenu}>
                Home
              </Link>
              {localStorage.getItem("token") ? (
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="text-xl font-semibold border-[1px] px-6 border-[#7a9757] rounded-xl p-2 hover:text-[#7a9757] my-4"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-xl font-semibold border-[1px] px-6 border-[#7a9757] rounded-xl p-2 hover:text-[#7a9757] my-4"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-xl font-semibold border-[1px] px-6 border-[#7a9757] rounded-xl p-2 hover:text-[#7a9757] my-4"
                    onClick={toggleMenu}
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
        <div className="flex items-center ">
          <button onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#2D3E50] text-white z-30">
          <div className="flex justify-end p-4">
            <button onClick={toggleMenu}>
              <FaTimes size={24} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-full">
            <Link className="text-2xl" to="/" onClick={toggleMenu}>
              Home
            </Link>
            {localStorage.getItem("token") ? (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="text-xl font-semibold border-[1px] px-6 border-[#7a9757] rounded-xl p-2 hover:text-[#7a9757] my-4"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xl font-semibold border-[1px] px-6 border-[#7a9757] rounded-xl p-2 hover:text-[#7a9757] my-4"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-xl font-semibold border-[1px] px-6 border-[#7a9757] rounded-xl p-2 hover:text-[#7a9757] my-4"
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
