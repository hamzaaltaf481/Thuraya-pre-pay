import React, { useState, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

const Admin = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [formData, setFormData] = useState({
    poNo: "",
    plNo: "",
    date: "",
    totalAmount: "",
    payStatus: "",
    file: null,
  });

  const navigate = useNavigate();
  const fetchData = async () => {
      const token = localStorage.getItem("token");

    try {
      const myHeaders = {
        Authorization: `${token}`
      };
      const host = process.env.REACT_APP_ENV === 'production' ? process.env.REACT_APP_PROD_HOSTNAME : 'localhost';

      const response = await axios.post(
        `http://${host}:5000/api/admin/view-cards`,
        {},
        {
          headers: myHeaders,
        }
      );
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("po_number", formData.poNo);
    formdata.append("pl_number", formData.plNo);

    // Format the date to "DD-MM-YYYY"
    const formattedDate = new Date(formData.date)
      .toLocaleDateString("en-GB")
      .split("/")
      .join("-");
    formdata.append("date_purchased", formattedDate);

    formdata.append("total_amount", formData.totalAmount);
    formdata.append("payment_status", formData.payStatus);
    formdata.append("attachment_path", "/path/file");
    formdata.append("file", formData.file);

    console.log("request", formData);
    console.log("date", formattedDate);

    try {
      const token = localStorage.getItem("token");
      const host = process.env.REACT_APP_ENV === 'production' ? process.env.REACT_APP_PROD_HOSTNAME : 'localhost';
      const response = await axios.post(
        `http://${host}:5000/api/admin/import`,
        formdata,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      fetchData();
      swal("Success!", "Data imported successfully", "success");
    } catch (error) {
      console.error(error);
      swal("Error!", `Failed to import data: ${error.message}`, "error");
    }
    setFormData({
      poNo: "",
      plNo: "",
      date: "",
      totalAmount: "",
      payStatus: "",
      file: null,
    });
    setOpen(false);
  };

  const handleRowClick = (id) => {
    navigate(`/admin_card/${id}`, { state: { csvData } });
  };

  return (
    <div className="overflow-hidden mb-20">
      <button
        onClick={() => setOpen(true)}
        className="mt-40 mx-[150px] lg:mx-[1330px] w-[110px] text-xl font-semibold border px-6 border-[#7a9757] rounded-xl p-2 hover:text-[#7a9757]"
      >
        Import
      </button>

      <div className="border-[2px] mt-10 text-xl w-full md:w-[1200px] mx-auto p-2 shadow-lg">
        <div className="hidden md:flex justify-between mb-3 font-bold md:pl-7">
          <h2 className="w-1/5">Po.No</h2>
          <h2 className="w-1/5">Pl.No</h2>
          <h2 className="w-1/5">Date</h2>
          <h2 className="w-1/5">Total Amount</h2>
          <h2 className="w-1/5 mr-2">Pay Status</h2>
        </div>
        <hr className="hidden md:block" />
        <div className="text-xl h-[300px]">
          <Scrollbars>
            {data.map((row, index) => (
              <div
                key={index}
                className="mb-3 hover:bg-slate-200 p-3 md:flex md:justify-between md:pl-7 border-b cursor-pointer"
                onClick={() => handleRowClick(row.id)}
              >
                <div className="md:w-1/5">
                  <h2 className="md:hidden font-bold">Po.No</h2>
                  <h2>{row.po_number}</h2>
                </div>
                <div className="md:w-1/5">
                  <h2 className="md:hidden font-bold">Pl.No</h2>
                  <h2>{row.pl_number}</h2>
                </div>
                <div className="md:w-1/5">
                  <h2 className="md:hidden font-bold">Date</h2>
                  <h2>{new Date(row.date_purchased).toLocaleDateString()}</h2>
                </div>
                <div className="md:w-1/5">
                  <h2 className="md:hidden font-bold">Total Amount</h2>
                  <h2>{row.total_amount}</h2>
                </div>
                <div className="md:w-1/5">
                  <h2 className="md:hidden font-bold">Pay Status</h2>
                  <h2>{row.payment_status ? "Paid" : "Unpaid"}</h2>
                </div>
              </div>
            ))}
          </Scrollbars>
        </div>
      </div>

      <Modal
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        contentLabel="Enter Data"
        ariaHideApp={false}
        className="bg-white p-8 rounded shadow-md mx-auto mt-40 w-11/12 md:w-1/2"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-2xl mb-4">Enter Data</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Po.No:</label>
            <input
              type="text"
              name="poNo"
              value={formData.poNo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Pl.No:</label>
            <input
              type="text"
              name="plNo"
              value={formData.plNo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Total Amount:</label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Pay Status:</label>
            <select
              name="payStatus"
              value={formData.payStatus}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Status</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">CSV File:</label>
            <input
              type="file"
              name="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mr-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Admin;
