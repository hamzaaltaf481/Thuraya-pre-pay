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

export default function RefillUnits() {
  const [selectedUnits, setSelectedUnits] = useState({}); // Track selected units for each card

  const handleUnitSelect = (unit) => {
    if (selectedUnits[unit.units]) {
      const newSelectedUnits = { ...selectedUnits };
      delete newSelectedUnits[unit.units];
      setSelectedUnits(newSelectedUnits);
    } else {
      setSelectedUnits((prevSelectedUnits) => ({
        ...prevSelectedUnits,
        [unit.units]: {
          ...unit,
          quantity: 1, // Initialize quantity to 1 when a unit is selected
        },
      }));
    }
  };

  const handleIncrement = (unit) => {
    setSelectedUnits((prevSelectedUnits) => ({
      ...prevSelectedUnits,
      [unit.units]: {
        ...prevSelectedUnits[unit.units],
        quantity: Math.min(
          prevSelectedUnits[unit.units]?.quantity + 1 || 1,
          10
        ),
      },
    }));
  };

  const handleDecrement = (unit) => {
    setSelectedUnits((prevSelectedUnits) => ({
      ...prevSelectedUnits,
      [unit.units]: {
        ...prevSelectedUnits[unit.units],
        quantity: Math.max(prevSelectedUnits[unit.units]?.quantity - 1 || 1, 1),
      },
    }));
  };

  const token = localStorage.getItem("token");

  return (
    <div className="relative flex flex-col justify-start min-h-screen overflow-hidden">
      <div className="flex justify-between items-start gap-60 w-full px-20">
        <div className="w-full p-5">
          <div className="flex justify-between mt-32">
            <Link
              to="/quick_refill"
              className="text-3xl font-bold text-black flex gap-4 items-center opacity-40"
            >
              <FaArrowRight className="inline-block" />
              Quick Refill
            </Link>
            <h1
              className="text-3xl font-bold text-black flex gap-4 items-center"
              style={{ color: "var(--green-color)" }}
            >
              <FaArrowDown className="inline-block" />
              <p className="text-[#2f2f2f]">Refill</p>
              Units
            </h1>
          </div>

          <p className="mt-5 text-lg text-gray-600">Select refill units</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10 mt-3">
            {refillUnits.map((unit, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg text-center ${
                  unit.price === "Out of Stock" ? "text-gray-400" : "text-black"
                }`}
              >
                <input
                  type="checkbox"
                  name="refillUnit"
                  id={`unit-${unit.units}`}
                  className="mr-2"
                  disabled={unit.price === "Out of Stock"}
                  onChange={() => handleUnitSelect(unit)}
                  checked={!!selectedUnits[unit.units]}
                />
                <label htmlFor={`unit-${unit.units}`}>
                  <p className="text-xl font-bold">{unit.units} units</p>
                  <p>{unit.price}</p>
                </label>
                {selectedUnits[unit.units] && (
                  <div className="flex items-center justify-center mt-2">
                    <button
                      className="px-2 py-1 border rounded-l"
                      onClick={() => handleDecrement(unit)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="mx-2 border rounded text-center w-12"
                      value={selectedUnits[unit.units].quantity}
                      readOnly
                    />
                    <button
                      className="px-2 py-1 border rounded-r"
                      onClick={() => handleIncrement(unit)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <hr
            className="my-8 bottom-4 border-1"
            style={{ borderColor: "var(--green-color)" }}
          />
          <h2 className="font-bold text-3xl mb-5">Summary</h2>
          
            <div className="flex mb-1 gap-6">
              <span className="p-1 text-xl ">Units</span>
              <span className="p-1 text-xl">Quantity</span>
              <span className="p-1 text-xl">Amount</span>
            </div>

            {Object.values(selectedUnits).map((unit) => (
              <>
                <div className="flex mb-2 gap-16" key={unit.units}>
                  <span className="p-1 justify-start">{unit.units}</span>
                  <span className="p-1 justify-center">{unit.quantity}</span>
                  <span className="p-1 justify-end">
                    ${(unit.units * unit.quantity).toFixed(2)}
                  </span>
                </div>
              
                <hr></hr>
              </>
            ))}
                <div className="flex gap-40">
                  <span className=" font-bold">Total</span>
                  <span>399</span>
                </div>
          <div className="mt-10 flex">
            <button
              className="px-7 py-4 text-white text-xl rounded flex items-center"
              style={{
                backgroundColor: "var(--blue-color)",
              }}
            >
              <FaArrowRight className="mr-2" />
              {token ? "Proceed to payment" : "Proceed to payment as guest"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
