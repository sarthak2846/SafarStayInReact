import React, { useContext, useState } from "react";
import { GiConfirmed } from "react-icons/gi";
import { bookingDataContext } from "../context/BookingContext";
import { useNavigate } from "react-router-dom";


function Booked() {
  let { bookingData } = useContext(bookingDataContext);
  let navigate = useNavigate();
  
  return (
    <div className="w-[100vw] min-h-[100vh] flex items-center justify-center gap-[10px] bg-slate-30000 flex-col">
      <div className="w-[95%] max-w-[500px] h-[400px] bg-[white] flex items-center justify-center border-[1px] border-[#b5b5b5] flex-col gap-[20px] p-[20px] md:w-[80%] rounded-lg">
        <div className="w-[100%] h-[50%] text-[20px] flex items-center justify-center flex-col gap-[20px] font-semibold">
          <GiConfirmed className="w-[100px] h-[100px] text-[green]" /> Booking
          Conformed
        </div>
        <div className="w-[100%] flex items-center justify-between text-[16px] md:text-[18px]">
          <span>Bookind Id : </span> <span>{bookingData._id}</span>
        </div>
        <div className="w-[100%] flex items-center justify-between text-[16px] md:text-[18px] ">
          <span>Owner Details :</span> <span>{bookingData.host?.email}</span>
        </div>
        <div className="w-[100%] flex items-center justify-between text-[16px] md:text-[18px] ">
          <span>Total Rent :</span>{" "}
          <span>
            ₹
            {new Intl.NumberFormat("en-IN").format(
              Number(bookingData.totalRent),
            )}
          </span>
        </div>
      </div>


      <button
        className="px-[30px] py-[10px] bg-[red] text-[white] text-[18px] md:px-[100px] rounded-lg text-nowrap absolute top-[10px] right-[20px]"
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </div>
  );
}

export default Booked;
