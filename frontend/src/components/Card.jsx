import React, { useContext, useState } from "react";
import { userDataContect } from "../context/UserContext";
import { listingDataContext } from "../context/ListingContext";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { GiConfirmed } from "react-icons/gi";
import { FcCancel } from "react-icons/fc";
import { bookingDataContext } from "../context/BookingContext";

function Card({
  title,
  landmark,
  image1,
  image2,
  image3,
  rent,
  city,
  id,
  ratings,
  isBooked,
  host,
  guest,
}) {
  let navigate = useNavigate();
  let { userData } = useContext(userDataContect);
  let { handleViewCard } = useContext(listingDataContext);
  let [popUp, setPopUp] = useState(false);
  let [actionType, setActionType] = useState("");
  let { cancelBooking, cancel } = useContext(bookingDataContext);

  const handleClick = () => {
    if (userData) {
      handleViewCard(id);
    } else {
      navigate("/login");
    }
  };

  const isUserLoggedIn = !!userData;
  const isHost = isUserLoggedIn && String(host) === String(userData._id);
  const isGuest =
    isUserLoggedIn &&
    (String(guest) === String(userData._id) ||
      String(guest) === String(userData.id));

  const handleConfirmAction = async () => {
    await cancelBooking(id,actionType);
    setPopUp(false);
    if (actionType === "checkout") {
      navigate(`/rate/${id}`);
    }
  };

  return (
    <div
      className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer relative group transition-all duration-300 hover:shadow-md hover:scale-[1.01] flex flex-col"
      onClick={() => (!isBooked ? handleClick() : null)}
    >
      {/* Floating Action Badge System */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 items-end">
        {isBooked && (
          <div className="text-emerald-600 bg-white/95 backdrop-blur-sm rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 px-3 py-1.5 shadow-sm border border-emerald-100">
            <GiConfirmed className="w-4 h-4 text-emerald-500" />
            Booked
          </div>
        )}

        {isBooked && (isHost || isGuest) && (
          <button
            className="text-red-600 bg-white hover:bg-red-50 transition-colors rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 px-3 py-1.5 shadow-sm border border-red-100 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setActionType("cancel");
              setPopUp(true);
            }}
          >
            <FcCancel className="w-4 h-4" />
            Cancel Booking
          </button>
        )}

        {isBooked && isGuest && (
          <button
            className="text-white bg-red-500 hover:bg-red-600 transition-colors font-semibold rounded-lg flex items-center justify-center px-3 py-1.5 text-xs shadow-sm cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setActionType("checkout");
              setPopUp(true);
            }}
          >
            Checkout & Rate
          </button>
        )}
      </div>

      {/* Confirmation Modal Context Container */}
      {popUp && (
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-30 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white p-5 rounded-xl shadow-xl w-full max-w-[280px] border border-gray-100 flex flex-col gap-4 text-center">
            <p className="text-gray-800 font-bold text-base">
              {actionType === "checkout"
                ? "Confirm Checkout?"
                : "Cancel Booking?"}
            </p>
            <p className="text-gray-500 text-xs -mt-2">
              Are you absolutely sure?
            </p>

            <div className="flex items-center gap-2 mt-1">
              <button
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-xs transition-colors disabled:opacity-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirmAction();
                }}
                disabled={cancel}
              >
                {cancel ? "..." : "Yes"}
              </button>
              <button
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-xs transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setPopUp(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

     
      <div className="w-full h-56 relative overflow-hidden group/slider">
   
        <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth bg-gray-100 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <img
            src={image1}
            alt=""
            className="w-full h-full object-cover flex-shrink-0 snap-center"
          />
          <img
            src={image2}
            alt=""
            className="w-full h-full object-cover flex-shrink-0 snap-center"
          />
          <img
            src={image3}
            alt=""
            className="w-full h-full object-cover flex-shrink-0 snap-center"
          />
        </div>

    
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-md pointer-events-none shadow-sm">
          Swipe ➔
        </div>
      </div>

      <div className="p-4 flex flex-col gap-1.5 flex-1 justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-gray-900 truncate flex-1">
              {`In ${landmark?.toUpperCase()}, ${city?.toUpperCase()}`}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-gray-800 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 shrink-0">
              <FaStar className="text-red-400 w-3 h-3" />
              {ratings}
            </span>
          </div>

          <h3 className="text-xs text-gray-500 font-medium truncate mt-0.5">
            {title?.toUpperCase()}
          </h3>
        </div>

        <div className="text-sm font-extrabold text-red-500 border-t border-gray-50 pt-3 mt-1">
          ₹{Number(rent).toLocaleString("en-IN")}{" "}
          <span className="text-xs text-gray-400 font-medium">/ day</span>
        </div>
      </div>
    </div>
  );
}

export default Card;
