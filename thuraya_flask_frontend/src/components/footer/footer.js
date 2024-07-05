import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="py-10 border-t bg-[#183567]"
    >
      <div className="container mx-auto flex flex-wrap justify-between items-start px-5 ">
        <div className="w-full md:w-1/4 text-start md:text-left">
          <img
            src="./images/fl_logo.png"
            alt="Thuraya"
            className=" w-60 md:w-[500px] mx-auto md:mx-0"
          />
        </div>
        <div className="w-full md:w-1/4 text-center md:text-center">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="text-white text-lg md:text-xl font-bold border-b-4 border-transparent focus:border-[#7a9757] hover:border-[#7a9757] hover:text-[#7a9757]"
              >
                Home
              </Link>
            </li>
            <li>
              <a
                href="/support"
                className="text-white text-lg md:text-xl font-bold border-b-4 border-transparent focus:border-[#7a9757] hover:border-[#7a9757] hover:text-[#7a9757]"
              >
                Support
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="text-white text-lg md:text-xl font-bold border-b-4 border-transparent focus:border-[#7a9757] hover:border-[#7a9757] hover:text-[#7a9757]"
              >
                About
              </a>
            </li>
          </ul>
        </div>
        <div className="w-full md:w-1/4 text-center md:text-left">
          <h3 className="font-bold mb-2 text-white text-lg md:text-xl">
            We Accept
          </h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <img
              src="./images/Visa_logo.png"
              alt="Visa"
              className="w-20 md:w-40"
            />
          </div>
        </div>
        <div className="w-full md:w-1/4 text-center text-white text-xl  md:text-left font-bold">
        Developed by ePatronus
          <img
            src="./images/ePatronus-logo.png"
            alt="Thuraya"
            className="w-40 md:w-[250px] mx-auto md:mx-0 bg-white lg:mt-2"
          />
        </div>
      </div>
      <div className="border-t mt-10 pt-4 text-center text-white text-sm">
        <p>
          ThurayaPrePay 2024. All rights reserved.
        </p>
        <div className="mt-2">
          <a href="/terms" className="hover:underline mx-2 text-white">
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
