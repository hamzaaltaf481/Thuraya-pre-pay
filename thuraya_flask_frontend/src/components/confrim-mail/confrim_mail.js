import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate instead of useHistory
import axios from "axios";
import swal from "sweetalert";

const ConfirmMail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleConfirmEmail = async () => {
    try {
      swal("Loading", "Please wait...", "info");
      const response = await axios.post(
        `https://localhost:3000/confirm_email/${token}`,
      );
      console.log(response.data)
      setMessage(response.data);
      swal("Success!", "Email confrim in successfully", "success");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      swal("Error!", "Failed to confirm email. Please try again.", "error");
    }
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen ">
      <div className="bg-[#b6db948c] p-8 rounded shadow-md text-center ">
        <h1 className="text-2xl font-bold mb-4">Confirm Email</h1>
        <p className="mb-4">
          Please confirm your email by clicking the button below.
        </p>
        <button
          onClick={handleConfirmEmail}
          className="px-4 py-2  text-white rounded  hover:bg-green-800"
          style={{ backgroundColor: "var(--blue-color)" }}
        >
          Confirm Email
        </button>
      </div>
    </div>
  );
};

export default ConfirmMail;
