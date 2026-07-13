import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import Card from "../components/Card";
import { userDataContect } from "../context/UserContext";

function MyBooking() {
  let navigate = useNavigate();
  let { userData } = useContext(userDataContect);

  return (
    <div className="w-full min-h-screen flex items-center justify-start flex-col gap-8 px-4 sm:px-8 bg-gray-50">

      <div className="sticky top-0 z-50 w-full max-w-[1280px] flex items-center justify-between gap-6 py-4 bg-gray-50/90 backdrop-blur-sm border-b border-gray-100">
        
      
        <button
          className="w-12 h-12 bg-red-500 text-white cursor-pointer rounded-full flex items-center justify-center shadow-md hover:bg-red-600 active:scale-95 transition-all flex-shrink-0 ml-2"
          onClick={() => navigate("/")}
          aria-label="Go back"
        >
          <FaArrowLeftLong className="w-5 h-5" />
        </button>

      
        <div className="flex-1 border border-gray-200/80 py-3 px-6 flex items-center justify-center text-xl md:text-2xl rounded-xl text-gray-800 font-bold tracking-wide shadow-sm bg-white mx-2">
          MY BOOKINGS
        </div>
        
       
        <div className="w-12 mr-2 hidden sm:block"></div>
      </div>

      <div className="w-full max-w-[1280px] flex items-center justify-center md:justify-start gap-6 flex-wrap pb-10">
        {userData?.booking && userData.booking.length > 0 ? (
          userData.booking.map((list) => (
            <Card
              key={list._id}
              title={list.title}
              landmark={list.landmark}
              city={list.city}
              image1={list.image1}
              image2={list.image2}
              image3={list.image3}
              rent={list.rent}
              id={list._id}
              isBooked={list.isBooked}
              ratings={list.ratings}
              host={list.host}
            />
          ))
        ) : (
          <div className="w-full text-center py-10 text-gray-500 font-medium">
            No bookings found.
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBooking;
