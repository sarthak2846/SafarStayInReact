import React, { useContext, useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { listingDataContext } from "../context/ListingContext";
import { userDataContect } from "../context/UserContext";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { FaStar } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { bookingDataContext } from "../context/BookingContext";
import { toast } from "react-toastify";

function ViewCard() {
  let navigate = useNavigate();
  let { cardDetails, updating, setUpdating, deleting, setDeleting } =
    useContext(listingDataContext);
  let { userData } = useContext(userDataContect);
  let [updatePopUp, setUpdatePopUp] = useState(false);
  let [bookingPopUp, setBookingPopUp] = useState(false);
  let [title, setTitle] = useState(cardDetails.title);
  let [description, setDescription] = useState(cardDetails.description);
  let [backEndImage1, setBackEndImage1] = useState(null);
  let [backEndImage2, setBackEndImage2] = useState(null);
  let [backEndImage3, setBackEndImage3] = useState(null);
  let [rent, setRent] = useState(cardDetails.rent);
  let [city, setCity] = useState(cardDetails.city);
  let [landmark, setLandmark] = useState(cardDetails.landmark);
  let { serverUrl } = useContext(authDataContext);
  let [minDate, setMinDate] = useState("");
  let { checkIn, setCheckIn, checkOut, setCheckOut, total, setTotal, night, setNight, bookingData, setBookingData, handleBooking, booking, setBooking, } = useContext(bookingDataContext)
  
  const handleUpdateListing = async () => {
    setUpdating(true);
    try {
      let formData = new FormData();
      formData.append("title", title);
      if (backEndImage1) formData.append("image1", backEndImage1);
      if (backEndImage2) formData.append("image2", backEndImage2);
      if (backEndImage3) formData.append("image3", backEndImage3);
      formData.append("description", description);
      formData.append("rent", rent);
      formData.append("city", city);
      formData.append("landmark", landmark);

      let result = await axios.put(
        serverUrl + `/api/listing/update/${cardDetails._id}`,
        formData,
        { withCredentials: true },
      );
      setUpdating(false);
      navigate("/");
      toast.success("Listing Updated");
      setUpdatePopUp(false);
    } catch (error) {
      setUpdating(false);
      toast.error(error.response?.data.message);
    }
  };

  const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const handleImage1 = (e) => setBackEndImage1(e.target.files[0]);
  const handleImage2 = (e) => setBackEndImage2(e.target.files[0]);
  const handleImage3 = (e) => setBackEndImage3(e.target.files[0]);

  const handleDeleteListing = async () => {
    setDeleting(true);
    try {
      await axios.delete(
        serverUrl + `/api/listing/delete/${cardDetails._id}`,
        { withCredentials: true },
      );
      navigate("/");
      toast.success("List Deleted");
      setDeleting(false);
    } catch (error) {
      setDeleting(false);
      toast.error(error.response?.data.message);
    }
  };

  useEffect(() => {
    let today = new Date().toISOString().split("T")[0];
    setMinDate(today);
  }, []);

  useEffect(() => {
    if (checkIn && checkOut) {
      let inDate = new Date(checkIn);
      let OutDate = new Date(checkOut);
      let n = (OutDate - inDate) / (24 * 60 * 60 * 1000);
      setNight(n);
      let SafarStayCharge = cardDetails.rent * (7 / 100);
      let tax = cardDetails.rent * (7 / 100);

      if (n > 0) {
        setTotal(cardDetails.rent * n + SafarStayCharge + tax);
      } else {
        setTotal(0);
      }
    }
  }, [checkIn, checkOut, cardDetails.rent]);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-start gap-6 px-4 md:px-10 py-8 relative text-gray-800">
      
      {/* Top Header Navigation Line */}
      <div className="w-full max-w-6xl flex items-center gap-4 mt-4">
        <button
          className="p-3 bg-white hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer rounded-full flex items-center justify-center shadow-sm"
          onClick={() => navigate("/")}
        >
          <FaArrowLeftLong className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl md:text-3xl font-bold text-gray-900 truncate tracking-tight">
          {`In ${cardDetails.landmark.toUpperCase()}, ${cardDetails.city.toUpperCase()}`}
        </h1>
      </div>

      {/* Modern Grid Image Gallery */}
      <div className="w-full max-w-6xl h-[300px] md:h-[450px] grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden shadow-md">
        <div className="md:col-span-2 h-full overflow-hidden bg-gray-200">
          <img src={cardDetails.image1} alt="Main view" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
        </div>
        <div className="hidden md:flex flex-col gap-3 h-full">
          <div className="h-1/2 overflow-hidden bg-gray-200">
            <img src={cardDetails.image2} alt="Sub view 1" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
          </div>
          <div className="h-1/2 overflow-hidden bg-gray-200">
            <img src={cardDetails.image3} alt="Sub view 2" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="w-full max-w-6xl flex flex-col gap-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
          {`${cardDetails.title.toUpperCase()} • ${cardDetails.category.toUpperCase()}`}
        </h2>
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          {cardDetails.description}
        </p>
        <div className="text-xl md:text-2xl font-extrabold text-red-500 mt-2">
          {`₹${Number(cardDetails.rent).toLocaleString("en-IN")} / day`}
        </div>

        {/* Dynamic CTAs */}
        <div className="w-full border-t border-gray-100 pt-4 mt-2">
          {cardDetails.host === userData._id ? (
            <button
              className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all shadow-sm"
              onClick={() => setUpdatePopUp(true)}
            >
              Edit Listing Config
            </button>
          ) : (
            <button
              className="px-10 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all shadow-md shadow-red-100"
              onClick={() => setBookingPopUp(true)}
            >
              Reserve This Property
            </button>
          )}
        </div>
      </div>

      {/* Leaflet Map Segment */}
      <div className="w-full max-w-6xl flex flex-col gap-4 mb-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg md:text-xl font-bold text-gray-900">Where you'll be</h3>
        {cardDetails?.geometry?.coordinates && cardDetails.geometry.coordinates.length > 0 ? (
          <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-inner border border-gray-100 z-0">
            <MapContainer
              center={[cardDetails.geometry.coordinates[1], cardDetails.geometry.coordinates[0]]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              <Marker position={[cardDetails.geometry.coordinates[1], cardDetails.geometry.coordinates[0]]} icon={redIcon}>
                <Popup>
                  <span className="font-semibold">{cardDetails.title}</span>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        ) : (
          <div className="w-full h-[200px] rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
            Coordinates unavailable.
          </div>
        )}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {updatePopUp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[150] backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">Update Your Property</h2>
              <button 
                onClick={() => setUpdatePopUp(false)}
                className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
              >
                <RxCross2 className="w-5 h-5" />
              </button>
            </div>

            {/* Form Wrap Scrollable */}
            <form onSubmit={(e) => e.preventDefault()} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-xl h-24 resize-none focus:outline-none focus:border-gray-900 text-sm" />
              </div>

            
              {['image1', 'image2', 'image3'].map((imgKey, idx) => {
                const handlers = [handleImage1, handleImage2, handleImage3];
                return (
                  <div key={imgKey} className="p-3 border border-gray-100 rounded-xl bg-gray-50/50 flex items-center gap-4">
                    <img src={cardDetails[imgKey]} alt="Thumb" className="w-14 h-11 object-cover rounded-lg border border-gray-200 bg-white" />
                    <div className="flex-1">
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-0.5">Replace Image {idx+1}</label>
                      <input type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={handlers[idx]} className="text-xs text-gray-500 w-full file:mr-3 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300" />
                    </div>
                  </div>
                );
              })}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Rent (INR)</label>
                  <input type="number" min="0" required value={rent} onChange={(e) => setRent(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">City</label>
                  <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Landmark</label>
                  <input type="text" required value={landmark} onChange={(e) => setLandmark(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 text-sm" />
                </div>
              </div>
            </form>

            {/* Sticky Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex items-center justify-end gap-3">
              <button disabled={deleting} onClick={handleDeleteListing} className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium text-sm rounded-xl transition-colors disabled:opacity-50">
                {deleting ? "Deleting..." : "Delete"}
              </button>
              <button disabled={updating} onClick={handleUpdateListing} className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm rounded-xl transition-colors shadow-sm disabled:opacity-50">
                {updating ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= RESERVE MODAL ================= */}
      {bookingPopUp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[150] backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 w-full max-w-4xl rounded-2xl shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] overflow-hidden">
            
            <button 
              onClick={() => setBookingPopUp(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors z-10 bg-white shadow-sm"
            >
              <RxCross2 className="w-5 h-5" />
            </button>

           
            <form onSubmit={(e) => e.preventDefault()} className="flex-1 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100 overflow-y-auto">
              <div>
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6">Confirm & Book</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Check-In Date</label>
                    <input type="date" min={minDate} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 text-sm bg-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Check-Out Date</label>
                    <input type="date" min={minDate} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 text-sm bg-transparent" />
                  </div>
                </div>
              </div>

              <button disabled={booking} onClick={() => handleBooking(cardDetails._id)} className="w-full mt-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-md shadow-red-100 disabled:opacity-50">
                {booking ? "Processing..." : "Book Now"}
              </button>
            </form>

            <div className="flex-1 bg-gray-50/60 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex gap-4 border-b border-gray-200/60 pb-4 mb-4">
                  <img className="w-20 h-20 object-cover rounded-xl shadow-sm border border-white" src={cardDetails.image1} alt="Receipt thumbnail" />
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-[11px] font-bold text-red-500 tracking-wider uppercase truncate">{`${cardDetails.landmark}, ${cardDetails.city}`}</span>
                    <h4 className="font-bold text-gray-900 truncate text-sm md:text-base">{cardDetails.title}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
                      <FaStar className="text-red-400 w-3 h-3" />
                      <span>{cardDetails.ratings || "4.8"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <h5 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2">Price Breakdown</h5>
                  <div className="flex justify-between">
                    <span>{`₹${new Intl.NumberFormat("en-IN").format(cardDetails.rent)} × ${night || 0} nights`}</span>
                    <span className="font-medium text-gray-900">₹{new Intl.NumberFormat("en-IN").format(cardDetails.rent * (night || 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Assessment</span>
                    <span className="font-medium text-gray-900">₹{new Intl.NumberFormat("en-IN").format((cardDetails.rent * 7) / 100)}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span>SafarStay Convenience Fee</span>
                    <span className="font-medium text-gray-900">₹{new Intl.NumberFormat("en-IN").format((cardDetails.rent * 7) / 100)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 mt-4">
                <span className="font-bold text-gray-900 text-base">Total Amount</span>
                <span className="text-xl font-black text-gray-950">₹{new Intl.NumberFormat("en-IN").format(total)}</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default ViewCard;