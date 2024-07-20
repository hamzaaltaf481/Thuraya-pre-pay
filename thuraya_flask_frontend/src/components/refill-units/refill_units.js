import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

let refillUnitsAvailability = {};

export default function RefillUnits() {
  const [selectedUnits, setSelectedUnits] = useState({}); // Track selected units for each card
  const [refillUnits, setRefillUnits] = useState([]);
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const host =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_PROD_HOSTNAME
      : "localhost";

  const fetchRefillUnits = () => {
    axios
      .get(`http://${host}:5000/api/check-availability`)
      .then((response) => {
        console.log("response", response.data);
        refillUnitsAvailability = response.data;
        const units = Object.keys(refillUnitsAvailability).map((unit) => ({
          units: parseInt(unit),
          price:
            refillUnitsAvailability[unit] > 0 ? `$${unit}` : "Out of Stock",
          maxQuantity: refillUnitsAvailability[unit],
        }));
        setRefillUnits(units);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchRefillUnits();
  }, []);

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
          unit.maxQuantity
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
  const handleLoginPurchase = async () => {
    try {
      swal("Loading", "Please wait...", "info");
      const selectedUnitsArray = Object.values(selectedUnits);
      const units = selectedUnitsArray.map((unit) => ({
        quantity: unit.quantity,
        price: unit.price.replace("$", ""),
      }));
      console.log("units", units);
      const response = await axios.post(
        `http://${host}:5000/api/purchase`,
        { units },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      swal("Success!", `${response.data.message}`, "success");
      fetchRefillUnits(); // Reload the latest data from the API
    } catch (error) {
      console.error(error);
      swal("Error!", `${error}`, "error");
    }
  };
  const handleGuestPayment = async () => {
    setIsOpen(false)
    try {
      swal("Loading", "Please wait...", "info");
      const selectedUnitsArray = Object.values(selectedUnits);
      const units = selectedUnitsArray.map((unit) => ({
        quantity: `${unit.quantity}`,
        price: unit.price.replace("$", ""),
      }));

      const response = await axios.post(
        `http://${host}:5000/api/purchase`,
        {
          units,
          email: `${email}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTimeout(() => {
        swal("Success!", `${response.data.message}`, "success").then(() => {
          window.location.reload(); // This will reload the window after the "OK" button is pressed
        });
      }, 3000);

      // setTimeout(fetchRefillUnits, 3000); // Reload the latest data from the API after 3 seconds
    } catch (error) {
      console.error(error);
      swal("Error!", `${error}`, "error");
    }
  };

  // Calculate total dynamically
  const calculateTotal = () => {
    return Object.values(selectedUnits).reduce((total, unit) => {
      return total + unit.units * unit.quantity;
    }, 0);
  };

  return (
    <>
      {isOpen === true && (
        <div className="flex content-center items-center justify-center absolute w-full h-screen backdrop-blur z-20 overflow-y-hidden">
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
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full h-[70px] px-4 py-2 mt-2 text-[#2D3E50] bg-white border-[2px] rounded-xl focus:border-[#2D3E50] focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 shadow-md text-xl font-medium"
                  />
                </div>

                <div className="flex mt-6">
                  <button
                    onClick={handleGuestPayment}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-3 lg:mr-[600px] ">
              {refillUnits.map((unit, index) => (
                <div
                  key={index}
                  className={`py-[4px] border-y-[3px] rounded text-center w-full h-full sm:w-[200px]  ${
                    unit.price === "Out of Stock"
                      ? "text-gray-400 hover:border-gray-400 "
                      : unit.units === 10
                      ? "hover:border-[#f78d40]"
                      : unit.units === 20
                      ? "hover:border-[#f04d55]"
                      : unit.units === 39
                      ? "hover:border-[#c640c2]"
                      : unit.units === 50
                      ? "hover:border-[#8bc441]"
                      : unit.units === 80
                      ? "hover:border-[#75d0f5]"
                      : unit.units === 160
                      ? "hover:border-[#a8b6b6]"
                      : unit.units === 500
                      ? "hover:border-[#3f48cc]"
                      : unit.units === 1000
                      ? "hover:border-[#880015]"
                      : unit.units === 2500
                      ? "hover:border-[#22b14c]"
                      : "border-black"
                  }`}
                >
                  <div
                    className={`flex border-x-[3px] w-full px-2 h-full sm:w-[200px] flex-row gap-x1 ${
                      unit.price === "Out of Stock"
                        ? "text-gray-400 hover:border-gray-400 "
                        : unit.units === 10
                        ? "hover:border-[#f78d40]"
                        : unit.units === 20
                        ? "hover:border-[#f04d55]"
                        : unit.units === 39
                        ? "hover:border-[#c640c2]"
                        : unit.units === 50
                        ? "hover:border-[#8bc441]"
                        : unit.units === 80
                        ? "hover:border-[#75d0f5]"
                        : unit.units === 160
                        ? "hover:border-[#a8b6b6]"
                        : unit.units === 500
                        ? "hover:border-[#3f48cc]"
                        : unit.units === 1000
                        ? "hover:border-[#880015]"
                        : unit.units === 2500
                        ? "hover:border-[#22b14c]"
                        : "border-black"
                    }`}
                  >
                    <div
                      className={`rounded-full text-white text-lg ${
                        unit.price === "Out of Stock"
                          ? "text-white bg-gray-400 w-12 h-12 pt-2 "
                          : unit.units === 10
                          ? "bg-[#f78d40] w-12 h-12 pt-2 "
                          : unit.units === 20
                          ? "bg-[#f04d55] w-12 h-12 pt-2 "
                          : unit.units === 39
                          ? "bg-[#c640c2] w-12 h-12 pt-2 "
                          : unit.units === 50
                          ? "bg-[#8bc441] w-12 h-12 pt-2 "
                          : unit.units === 80
                          ? "bg-[#75d0f5] w-12 h-12 pt-2 "
                          : unit.units === 160
                          ? "bg-[#a8b6b6] w-12 h-12 pt-2 "
                          : unit.units === 500
                          ? "bg-[#3f48cc] w-12 h-12 pt-2 "
                          : unit.units === 1000
                          ? "bg-[#880015] w-12 h-12 pt-2 "
                          : unit.units === 2500
                          ? "bg-[#22b14c] w-12 h-12 pt-2 "
                          : "text-black"
                      }`}
                    >
                      {unit.units}
                    </div>
                    <div className=" flex flex-col px-2">
                      <input
                        type="checkbox"
                        name="refillUnit"
                        id={`unit-${unit.units}`}
                        className="mr-2 h-4 "
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
                  </div>
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
              <span>${calculateTotal()}</span>
            </div>
            <div className="mt-10 flex">
              {token ? (
                <button
                  className="px-7 py-4 text-white text-xl rounded flex items-center"
                  style={{
                    backgroundColor: "var(--blue-color)",
                  }}
                  onClick={handleLoginPurchase}
                >
                  <FaArrowRight className="mr-2" />
                  Proceed to payment
                </button>
              ) : (
                <button
                  className="px-7 py-4 text-white text-xl rounded flex items-center"
                  style={{
                    backgroundColor: "var(--blue-color)",
                  }}
                  onClick={() => setIsOpen(true)}
                >
                  <FaArrowRight className="mr-2" />
                  Proceed to payment as guest
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
