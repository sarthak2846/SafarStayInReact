import React, { useContext } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Home from "./pages/Home.jsx";
import ListingPage1 from "./pages/ListingPage1.jsx";
import ListingPage2 from "./pages/ListingPage2.jsx";
import ListingPage3 from "./pages/ListingPage3.jsx";
import { userDataContect } from "./context/UserContext.jsx";
import MyListing from "./pages/MyListing.jsx";
import ViewCard from './pages/ViewCard.jsx';
import MyBooking from "./pages/MyBooking.jsx";
import Booked from "./pages/Booked.jsx";
import Rating from './pages/Rating.jsx'
import { ToastContainer, toast } from 'react-toastify';
import Verify from "./pages/Verify.jsx";



function App() {
  let { userData, loading } = useContext(userDataContect);

  const protectRoute = (element) => {
    if (loading) {
      return (
        <div className="flex h-screen w-screen items-center justify-center bg-black">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border-4 border-gray-700 border-t-white animate-spin"></div>
            <p className="mt-4 text-white text-lg font-medium">
              Please wait...
            </p>
          </div>
        </div>
      );
    }

    return userData != null ? element : <Navigate to={"/login"} />;
  };

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-user" element={<Verify />} />
        <Route path="/listingpage1" element={protectRoute(<ListingPage1 />)} />
        <Route path="/listingpage2" element={protectRoute(<ListingPage2 />)} />
        <Route path="/listingpage3" element={protectRoute(<ListingPage3 />)} />
        <Route path="/mylisting" element={protectRoute(<MyListing />)} />
        <Route path="/viewcard" element={protectRoute(<ViewCard />)} />
        <Route path="/mybooking" element={protectRoute(<MyBooking />)} />
        <Route path="/booked" element={protectRoute(<Booked />)} />
        <Route path="/rate/:id" element={protectRoute(<Rating />)} />

       

      </Routes>
    </>
  );
}

export default App;
