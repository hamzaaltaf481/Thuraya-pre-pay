import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

const refillUnits = [
  { units: 10, price: "$10.00" },
  { units: 20, price: "Out of Stock" },
  { units: 39, price: "$39.00" },
  { units: 50, price: "$50.00" },
  { units: 80, price: "$80.00" },
  { units: 160, price: "$160.00" },
  { units: 500, price: "$500.00" },
  { units: 1000, price: "$1,000.00" },
  { units: 2500, price: "$2,500.00" },
];
const maxNoLength = 8;

export default function QuickRefill() {
  const [thurayaNumber, setThurayaNumber] = useState("");
  const [email, setEmail] = useState("");
  const [unitPrice, setUnitPrice] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handlePopup = () => {
    return setIsOpen(true);
  };
  const token = localStorage.getItem("token");

  const handleLoginRefill = async () => {
    try {
      console.log("handled login refill call");
      const response = await axios.post(
        "http://localhost:5000/api/login_refill",
        {
          phone: `${thurayaNumber}`,
          price: `${unitPrice}`,
        },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response", response);
    } catch (error) {
      console.log("error message", error.response.statusText);
    }
  };

  const handleGuestRefill = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login_refill",
        {
          phone: `${thurayaNumber}`,
          price: `${unitPrice}`,
          email: `${email}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
    setTimeout(() => {
      console.log("30 seconds have passed");
    }, 30000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
   
        {isOpen == true && (
           <div id="slider" className="flex content-center items-center justify-center absolute w-full h-screen backdrop-blur z-20 overflow-y-hidden">
          <div className="z-30 relative flex flex-col justify-center min-h-screen overflow-hidden ">
            <div className="w-[450px] p-10 m-auto bg-white rounded-xl shadow-lg border-[1px] lg:max-w-xl ">
              <h1 className="text-3xl font-bold text-left text-[#2D3E50] ">
                Enter Your Email
              </h1>
              <form className="mt-6">
                <div className="mb-2 mt-6">
                  <input
                    type="eamil"
                    placeholder=" Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full h-[70px] px-4 py-2 mt-2 text-[#2D3E50] bg-white border-[2px] rounded-xl focus:border-[#2D3E50] focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 shadow-md text-xl font-medium"
                  />
                </div>

                <div className="flex mt-6">
                  <button
                    onClick={handleGuestRefill}
                    className="flex w-[150px] h-[50px] px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-[#2D3E50] rounded-md hover:bg-[#7a9757] focus:outline-none focus:bg-[#7a9757] pt-2 gap-1 shadow-md font-medium"
                  >
                    <h1 className=" text-xl ml-3 ">Enter</h1>
                    <img
                      src="/images/arrow.png"
                      alt="i"
                      className="w-[20.25px] h-[24px] mt-1"
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
          </div>
        )}
     
      <div className="static">
      <div className="  relative flex flex-col justify-start min-h-screen overflow-hidden">
        <div className=" backdrop-blur-3xl flex justify-between items-start gap-60 w-full px-20 ">
          <div className="w-full p-5">
            <div className="flex  justify-between mt-32">
              <h1
                className="text-3xl font-bold  flex gap-4 items-center"
                style={{ color: "var(--green-color)" }}
              >
                <FaArrowDown className="inline-block" />
                <p className="text-[#2f2f2f]">Quick</p>
                Refills
              </h1>
              <Link
                to="/refill_units"
                className="text-3xl font-bold text-black flex gap-4 items-center opacity-40"
              >
                <FaArrowRight className=" inline-block" />
                Refill Units
              </Link>
            </div>
            <p className="mt-2 text-lg text-gray-600">
              Enter your Thuraya number
            </p>
            <div className="flex gap-5">
              <input
                type="text"
                className={`mt-3 w-[7%] p-3 text-2xl border rounded-lg`}
                value={"+88216"}
              />
              <input
                type="text"
                className={`mt-3 w-[10%] p-3 text-2xl border rounded-lg`}
                placeholder="XXXXXXXX"
                value={thurayaNumber}
                onChange={(e) =>
                  setThurayaNumber(
                    e.target.value.replace(/\D/g, "").slice(0, 8)
                  )
                }
                maxLength={8}
              />
            </div>

            {thurayaNumber.length === maxNoLength && ( // Show refill units only when 12 digits are entered
              <div className=" transition-transform duration-300 delay-500">
                <p className="mt-5 text-lg text-gray-600  ">
                  Select refill units
                </p>
                <div className="grid grid-cols-6  gap-10 mt-3">
                  {refillUnits.map((unit, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg text-center ${
                        unit.price === "Out of Stock"
                          ? "text-gray-400"
                          : "text-black"
                      }`}
                    >
                      <input
                        type="radio"
                        name="refillUnit"
                        id={`unit-${unit.units}`}
                        className="mr-2"
                        disabled={unit.price === "Out of Stock"}
                        onClick={() => {
                          setUnitPrice(unit.price);
                        }}
                      />
                      <label htmlFor={`unit-${unit.units}`}>
                        <p className="text-xl font-bold">{unit.units} units</p>
                        <p>{unit.price}</p>
                      </label>
                    </div>
                  ))}
                </div>
                <hr
                  className="my-8 bottom-4 border-1 "
                  style={{ borderColor: "var(--green-color)" }}
                />
                {token ? (
                  <button
                    className="mt-10 px-7 py-4 text-white text-xl rounded flex items-center"
                    style={{
                      backgroundColor: "var(--blue-color)",
                    }}
                    onClick={handleLoginRefill}
                  >
                    <FaArrowRight className="mr-2" />
                    Proceed to payment
                  </button>
                ) : (
                  <>
                    <button
                      className="mt-10 px-7 py-4 text-white text-xl rounded flex items-center"
                      style={{
                        backgroundColor: "var(--blue-color)",
                      }}
                      onClick={handlePopup}
                    >
                      <FaArrowRight className="mr-2" />
                      Proceed to payment as guest
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      
      </div>
    </div>
    </>
    
  );
}
