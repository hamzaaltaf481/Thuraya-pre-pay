import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className=" py-10 border-t"
      style={{ backgroundColor: "var(--blue-color)" }}
      
    >
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="w-full md:w-1/4 text-center md:text-left mb-4 md:mb-0">
          <h2
            className="text-4xl font-bold"
            style={{ color: "var(--green-color)" }}
          >
            Thuraya<span className="text-white">PrePay</span>
          </h2>
          <div className="mt-4 flex justify-center md:justify-start space-x-4">
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7a9757] hover:text-blue-500"
              style={{color: "#7a9757",}}
            >
              <i className="fab fa-linkedin text-[#7a9757]" style={{color: "#7a9757",}} ></i>
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-blue-500"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-blue-500"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-blue-500"
            >
              <i className="fab fa-facebook"></i>
            </a>
          </div>
        </div>
        <div className="w-full md:w-1/4 text-center md:text-left mb-4 md:mb-0">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="text-white text-3xl font-bold border-b-4 border-transparent focus:border-[#7a9757] hover:border-[#7a9757] hover:text-[#7a9757]"
              >
                Home
              </Link>
            </li>
            <li>
              <a
                href="/support"
                className="text-white border-b-4 border-transparent focus:border-[#7a9757] hover:border-[#7a9757] hover:text-[#7a9757] text-3xl font-bold"
              >
                Support
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="text-white hborder-b-4 border-transparent focus:border-[#7a9757] hover:border-[#7a9757] hover:text-[#7a9757] text-3xl font-bold"
              >
                About
              </a>
            </li>
          </ul>
        </div>
        <div className="w-full md:w-1/4 text-center md:text-left mb-4 md:mb-0">
          <h3 className="font-bold mb-2 text-white text-3xl">We Accept</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <img
              src="./images/Visa_logo.png"
              alt="MasterCard"
              className="w-40"
            />
          </div>
        </div>
        <div className="w-full md:w-1/4 text-center md:text-left mb-4 md:mb-0">
          <img
            src="./images/lg.jpg"
            alt="Thuraya"
            className="w-[250px] mx-auto md:mx-0"
          />
        </div>
      </div>
      <div className="border-t mt-10 pt-4 text-center text-white text-sm">
        <p>
          ThurayaRefill 2021. All rights reserved.
          <br />
          ThurayaRefill.com is fully owned and operated by Oodi Electronics
          L.L.C.
        </p>
        <div className="mt-2">
          <a href="/terms" className=" hover:underline mx-2 text-white">
            Terms & Conditions
          </a>
          <a href="/privacy" className="text-white hover:underline mx-2">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
