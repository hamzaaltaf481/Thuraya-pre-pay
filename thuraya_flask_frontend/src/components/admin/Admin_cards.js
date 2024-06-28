import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useParams } from "react-router-dom";

const Admin_cards = ({ data }) => {
  const { index } = useParams();
  const row = data[index];

  if (!row) {
    return <div className="text-center mt-20">No data found for this entry.</div>;
  }

  return (
    <div className="overflow-hidden mt-40 mb-20">
      <div className="border-[2px] mt-10 text-xl w-full md:w-[1200px] mx-auto p-2 shadow-lg">
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
            <div className="mb-3 hover:bg-slate-200 p-3 md:flex md:justify-between md:pl-4 border-b">
              <div className="md:w-1/12">
                <h2 className="md:hidden font-bold">Card_id</h2>
                <h2>{row.card_id}</h2>
              </div>
              <div className="md:w-2/12">
                <h2 className="md:hidden font-bold">Serial_No</h2>
                <h2>{row.serial_no}</h2>
              </div>
              <div className="md:w-2/12">
                <h2 className="md:hidden font-bold">Scratch_Code</h2>
                <h2>{row.scratch_code}</h2>
              </div>
              <div className="md:w-1/12">
                <h2 className="md:hidden font-bold">Units</h2>
                <h2>{row.units}</h2>
              </div>
              <div className="md:w-2/12">
                <h2 className="md:hidden font-bold">Purchase-Price</h2>
                <h2>{row.purchase_price}</h2>
              </div>
              <div className="md:w-2/12">
                <h2 className="md:hidden font-bold">Selling-Price</h2>
                <h2>{row.selling_price}</h2>
              </div>
              <div className="md:w-2/12">
                <h2 className="md:hidden font-bold">Expiry-Date</h2>
                <h2>{row.expiry_date}</h2>
              </div>
              <div className="md:w-2/12">
                <h2 className="md:hidden font-bold">Remarks</h2>
                <h2>{row.remarks}</h2>
              </div>
            </div>
          </Scrollbars>
        </div>
      </div>
    </div>
  );
};

export default Admin_cards;
