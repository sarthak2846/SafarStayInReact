import React, { createContext, useContext, useState } from "react";
import { authDataContext } from "./AuthContext";
import axios from "axios";
import { userDataContect } from "./UserContext";
import { listingDataContext } from "./ListingContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export const bookingDataContext = createContext();

function BookingContext({ children }) {
  let [checkIn, setCheckIn] = useState("");
  let [checkOut, setCheckOut] = useState("");
  let [total, setTotal] = useState(0);
  let [night, setNight] = useState(0);
  let { serverUrl } = useContext(authDataContext);
  let { getCurrentUser } = useContext(userDataContect);
  let { getListing } = useContext(listingDataContext);
  let [bookingData, setBookingData] = useState([]);
  let [booking, setBooking] = useState(false);
  let [cancel, setCancel] = useState(false);
  let navigate = useNavigate();

  const handleBooking = async (id) => {
    setBooking(true);
    try {
      let result = await axios.post(
        serverUrl + `/api/booking/create/${id}`,
        {
          checkIn,
          checkOut,
          totalRent: total,
        },
        { withCredentials: true },
      );
      await getCurrentUser();
      await getListing();
      setBookingData(result.data);
      setBooking(false);
      navigate("/booked");
      toast.success("Booking Successful");
    } catch (error) {
      setBooking(false);
      toast.error(error.response?.data.message);
      setBookingData(null);
    }
  };

  const cancelBooking = async (id, type = "cancel") => {
    setCancel(true);
    try {
      let result = await axios.delete(serverUrl + `/api/booking/cancel/${id}`, {
        withCredentials: true,
      });
      await getCurrentUser();
      await getListing();
      setCancel(false);
      if (type === "checkout") {
        toast.success("Checked out successfully!");
      } else {
        toast.success("Booking canceled successfully.");
      }
    } catch (error) {
      setCancel(false);
      toast.error(error.response?.data.message);
    }
  };

  let value = {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    total,
    setTotal,
    night,
    setNight,
    bookingData,
    booking,
    setBooking,
    cancel,
    setCancel,
    setBookingData,
    handleBooking,
    cancelBooking,
  };
  return (
    <div>
      <bookingDataContext.Provider value={value}>
        {children}
      </bookingDataContext.Provider>
    </div>
  );
}

export default BookingContext;
