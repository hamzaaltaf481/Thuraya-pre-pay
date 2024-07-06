import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import swal from "sweetalert";

let refillUnitsAvailability = {};
const maxNoLength = 8;

export default function QuickRefill() {
  const [thurayaNumber, setThurayaNumber] = useState("");
  const [email, setEmail] = useState("");
  const [unitPrice, setUnitPrice] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [refillUnits, setRefillUnits] = useState([]);

  const handlePopup = () => {
    return setIsOpen(true);
  };
  const token = localStorage.getItem("token");
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
        }));
        setRefillUnits(units);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchRefillUnits();
  }, []);

  const handleLoginRefill = async () => {
    try {
      swal("Loading", "Please wait...", "info");
      const response = await axios.post(
        `http://${host}:5000/api/quick_refill`,
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
      setTimeout(() => {
        swal({
          title: "Success!",
          text: `${
            response.data.message ? `Message: ${response.data.message}` : ""
          }\n${
            response.data.new_balance
              ? `New Balance: ${response.data.new_balance}`
              : ""
          }\n${
            response.data.previoud_balance
              ? `Previous Balance: ${response.data.previoud_balance}`
              : ""
          }\n${
            response.data.refill_status
              ? `Refill Status: ${response.data.refill_status}`
              : ""
          }`,
          icon: "success",
          timer: 5000,
          buttons: false,
        });
      }, 5000);
    } catch (error) {
      console.log("error message", error);
      swal("Error!", `${error.response.data.message}`, "error");
    }
  };

  const handleGuestRefill = async () => {
    try {
      swal("Loading", "Please wait...", "info");
      const response = await axios.post(
        `http://${host}:5000/api/quick_refill`,
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

      console.log("response", response);
      swal({
        title: "Success!",
        text: `${
          response.data.message ? `Message: ${response.data.message}` : ""
        }\n${
          response.data.new_balance
            ? `New Balance: ${response.data.new_balance}`
            : ""
        }\n${
          response.data.previoud_balance
            ? `Previous Balance: ${response.data.previoud_balance}`
            : ""
        }\n${
          response.data.refill_status
            ? `Refill Status: ${response.data.refill_status}`
            : ""
        }`,
        icon: "success",
        timer: 5000,
        buttons: false,
      });
    } catch (error) {
      console.error(error);
      swal("Error!", `${error.response.data.message}`, "error");
    }
  };

  return (
    <>
      {isOpen === true && (
        <div
          id="slider"
          className="flex content-center items-center justify-center absolute w-full h-screen backdrop-blur z-20 overflow-y-hidden"
        >
          <div className="z-30 relative flex flex-col justify-center min-h-screen overflow-hidden ">
            <div className="w-[90%] sm:w-[450px] p-10 m-auto bg-white rounded-xl shadow-lg border-[1px] lg:max-w-xl">
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
                    className="flex w-full sm:w-[150px] h-[50px] px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-[#2D3E50] rounded-md hover:bg-[#7a9757] focus:outline-none focus:bg-[#7a9757] pt-2 gap-1 shadow-md font-medium"
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
          <div className=" backdrop-blur-3xl flex justify-between items-start gap-60 w-full px-4 sm:px-20">
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
                  className={`mt-3 w-[20%] sm:w-[7%] p-3 text-2xl border rounded-lg`}
                  value={"+88216"}
                />
                <input
                  type="text"
                  className={`mt-3 w-[60%] sm:w-[10%] p-3 text-2xl border rounded-lg`}
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

              {thurayaNumber.length === maxNoLength && (
                <div className="transition-transform duration-300 delay-500">
                  <p className="mt-5 text-lg text-gray-600">
                    Select refill units
                  </p>
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
                        } `}
                      >
                        <div
                          className={`flex border-x-[3px] w-full px-2 h-full sm:w-[200px] flex-row ${
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
                              :unit.units === 10
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
                          <div className="">
                            <input
                              type="radio"
                              name="refillUnit"
                              id={`unit-${unit.units}`}
                              className="ml-4 mb-5 mr-2"
                              disabled={unit.price === "Out of Stock"}
                              onClick={() => {
                                setUnitPrice(unit.price);
                              }}
                            />
                            <label htmlFor={`unit-${unit.units}`}>
                              <p className="text-xl font-bold">
                                {unit.units} units
                              </p>
                              <p>{unit.price}</p>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>{" "}
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
