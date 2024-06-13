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

  const token = localStorage.getItem("token");

  const handleLoginRefill = async (price) => {
 
    try {
      console.log("handled login refill call");
       const response = await axios.post(
        "http://localhost:5000/api/login_refill", 
        {
          phone: `${thurayaNumber}`,
          price: `${price}`,
        },
        {
          headers: {
            Authorization: `${token}`, 
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response",response);

    } catch (error) {
      console.log("error message",error.response.statusText);
    }
  };


  const handleGuestRefill = async (price) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login_refill",
        {
          phone: "21297776",
          price: `${price}`,
          email: "rafayzia3690@gmail.com",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative flex flex-col justify-start min-h-screen overflow-hidden">
      <div className="flex justify-between items-start gap-60 w-full px-20 ">
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
                setThurayaNumber(e.target.value.replace(/\D/g, "").slice(0, 8))
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
                      onClick={()=>{handleGuestRefill(unit.price)}}
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
                <button
                  className="mt-10 px-7 py-4 text-white text-xl rounded flex items-center"
                  style={{
                    backgroundColor: "var(--blue-color)",
                  }}
                  onClick={handleGuestRefill}
                >
                  <FaArrowRight className="mr-2" />
                  Proceed to payment as guest
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

