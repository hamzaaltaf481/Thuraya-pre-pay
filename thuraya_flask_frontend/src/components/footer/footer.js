import React from 'react';

const Footer = () => {
  return (
    <footer className=" py-10 border-t"  style={{ backgroundColor: "var(--blue-color)" }}>
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="w-full md:w-1/4 text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">Thuraya<span className="text-blue-500">Refill</span></h2>
          <div className="mt-4 flex justify-center md:justify-start space-x-4">
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-500">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-500">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-500">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-500">
              <i className="fab fa-facebook"></i>
            </a>
          </div>
        </div>
        <div className="w-full md:w-1/4 text-center md:text-left mb-4 md:mb-0">
          <ul className="space-y-2">
            <li><a href="/home" className="text-black hover:underline">Home</a></li>
            <li><a href="/support" className="text-black hover:underline">Support</a></li>
            <li><a href="/about" className="text-black hover:underline">About</a></li>
          </ul>
        </div>
        <div className="w-full md:w-1/4 text-center md:text-left mb-4 md:mb-0">
          <h3 className="font-bold mb-2">We Accept</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/MasterCard_Logo.png" alt="MasterCard" className="w-12" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Visa_2014_logo_detail.svg" alt="Visa" className="w-12" />
          </div>
        </div>
        <div className="w-full md:w-1/4 text-center md:text-left mb-4 md:mb-0">
          <img src="https://www.thuraya.com/sites/all/themes/thuraya/logo.png" alt="Thuraya" className="w-24 mx-auto md:mx-0" />
        </div>
      </div>
      <div className="border-t mt-10 pt-4 text-center text-sm text-gray-600">
        <p>ThurayaRefill 2021. All rights reserved.<br />ThurayaRefill.com is fully owned and operated by Oodi Electronics L.L.C.</p>
        <div className="mt-2">
          <a href="/terms" className="text-black hover:underline mx-2">Terms & Conditions</a>
          <a href="/privacy" className="text-black hover:underline mx-2">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
