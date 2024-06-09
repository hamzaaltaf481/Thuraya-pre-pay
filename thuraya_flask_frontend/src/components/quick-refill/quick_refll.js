import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
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

export default function QuickRefill() {
  const [thurayaNumber, setThurayaNumber] = useState("");
  const [isInvalid, setIsInvalid] = useState(false); // Set initial state to false

  const handleInputChange = (e) => {
    const value = e.target.value;
    setThurayaNumber(value);
    setIsInvalid(value.length !== 11); // Change validation to check for 12 digits
  };

  return (
    <div className="relative flex flex-col justify-start min-h-screen overflow-hidden">
      <div className="flex justify-between items-start gap-60 w-full px-20 ">
        <div className="w-full p-5">
          <div className="flex  justify-between mt-32">
            <h1 className="text-3xl font-bold text-black flex gap-4 items-center">
              <FaArrowDown className="inline-block" />
              Quick Refills
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
          <input
            type="text"
            className={`mt-3 w-[30%] p-3 text-2xl border rounded-lg ${
              isInvalid ? "border-red-500" : ""
            }`}
            placeholder="03 XXXXXXXXX"
            value={thurayaNumber}
            onChange={handleInputChange}
          />
          {thurayaNumber.length === 11 && ( // Show refill units only when 12 digits are entered
            <>
              <p className="mt-5 text-lg text-gray-600 ">Select refill units</p>
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
                    />
                    <label htmlFor={`unit-${unit.units}`}>
                      <p className="text-xl font-bold">{unit.units} units</p>
                      <p>{unit.price}</p>
                    </label>
                  </div>
                ))}
              </div>
              <button className="mt-10 px-4 py-2 bg-black text-white rounded flex items-center">
                <FaArrowRight className="mr-2" />
                Proceed to payment
              </button>
            </>
          )}
          {isInvalid && ( // Show error message when invalid
            <p className="mt-2 text-red-600">
              You've entered an invalid number. Please try again with the
              correct Thuraya number.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
