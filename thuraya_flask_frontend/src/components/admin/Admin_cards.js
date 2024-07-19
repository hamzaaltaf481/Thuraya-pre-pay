import { Scrollbars } from "react-custom-scrollbars-2";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

const AdminCard = () => {
  const { index } = useParams();
 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    try {
      const formdata = new FormData();
      formdata.append("card_id", `${index}`);
      const host = process.env.REACT_APP_ENV === 'production' ? process.env.REACT_APP_PROD_HOSTNAME : 'localhost';

      const requestOptions = {
        method: "POST",
        data: formdata,
        url: `http://${host}:5000/api/admin/view-scratch-codes`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token}`
        },
      };

      const response = await axios(requestOptions);
      console.log("response data: ", response.data);
      swal("Success!", "Data Fetch successfully", "success");
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      swal("Error!", `Failed to Fetch data: ${error.message}`, "error");
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl">
          Error while loading data: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden mt-40 mb-20">
      <div className="border-[2px] mt-10 text-xl w-full md:w-[1200px] mx-auto p-2 shadow-lg">
        <div className="mb-3 font-bold pl-4">
          <h2>Attachment Path: {data.attachment_path}</h2>
          <h2>Date Purchased: {data.date_purchased}</h2>
          <h2>ID: {data.id}</h2>
          <h2>Payment Status: {data.payment_status ? "True" : "False"}</h2>
          <h2>PL Number: {data.pl_number}</h2>
          <h2>PO Number: {data.po_number}</h2>
          <h2>Total Amount: {data.total_amount}</h2>
        </div>
        <div className="hidden md:flex justify-between mb-3 font-bold pl-4">
          <h2 className="w-1/12">Card_id</h2>
          <h2 className="w-2/12">Serial_No</h2>
          <h2 className="w-2/12">Scratch_Code</h2>
          <h2 className="w-1/12">Units</h2>
          <h2 className="w-2/12">Purchase-Price</h2>
          <h2 className="w-2/12">Selling-Price</h2>
          <h2 className="w-2/12">Expiry-Date</h2>
          <h2 className="w-2/12">Remarks</h2>
        </div>
        <hr className="hidden md:block" />
        <div className="text-xl h-[300px]">
          <Scrollbars>
            {data.card_details.map((card) => (
              <div
                key={card.id}
                className="mb-3 hover:bg-slate-200 p-3 md:flex md:justify-between md:pl-4 border-b"
              >
                <div className="md:w-1/12">
                  <h2 className="md:hidden font-bold">Card_id</h2>
                  <h2>{card.card_id}</h2>
                </div>
                <div className="md:w-2/12">
                  <h2 className="md:hidden font-bold">Serial_No</h2>
                  <h2>{card.serial_number}</h2>
                </div>
                <div className="md:w-2/12">
                  <h2 className="md:hidden font-bold">Scratch_Code</h2>
                  <h2>{card.scratch_code}</h2>
                </div>
                <div className="md:w-1/12">
                  <h2 className="md:hidden font-bold">Units</h2>
                  <h2>{card.units}</h2>
                </div>
                <div className="md:w-2/12">
                  <h2 className="md:hidden font-bold">Purchase-Price</h2>
                  <h2>{card.purchase_price}</h2>
                </div>
                <div className="md:w-2/12">
                  <h2 className="md:hidden font-bold">Selling-Price</h2>
                  <h2>{card.selling_price}</h2>
                </div>
                <div className="md:w-2/12">
                  <h2 className="md:hidden font-bold">Expiry-Date</h2>
                  <h2>{card.expiry_date}</h2>
                </div>
                <div className="md:w-2/12">
                  <h2 className="md-hidden font-bold">Remarks</h2>
                  <h2>{card.remarks}</h2>
                </div>
              </div>
            ))}
          </Scrollbars>
        </div>
      </div>
    </div>
  );
};

export default AdminCard;
