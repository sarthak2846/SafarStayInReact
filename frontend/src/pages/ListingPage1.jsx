import React, { useContext } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { listingDataContext } from "../context/ListingContext";

function ListingPage1() {
  let navigate = useNavigate();

  let {
    title,
    setTitle,
    description,
    setDescription,
    frontEndImage1,
    setFrontEndImage1,
    frontEndImage2,
    setFrontEndImage2,
    frontEndImage3,
    setFrontEndImage3,
    backendImage1,
    setBackendImage1,
    backendImage2,
    setBackendImage2,
    backendImage3,
    setBackendImage3,
    rent,
    setRent,
    city,
    setCity,
    landmark,
    setLandmark,
    category,
    setCategory,
    handleAddListing,
  } = useContext(listingDataContext);

  const handleImage1 = (e) => {
    let file = e.target.files[0];
    setBackendImage1(file);
    setFrontEndImage1(URL.createObjectURL(file));
  };

  const handleImage2 = (e) => {
    let file = e.target.files[0];
    setBackendImage2(file);
    setFrontEndImage2(URL.createObjectURL(file));
  };

  const handleImage3 = (e) => {
    let file = e.target.files[0];
    setBackendImage3(file);
    setFrontEndImage3(URL.createObjectURL(file));
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-start px-4 sm:px-6 py-10 text-gray-800">
      <div className="w-full max-w-2xl flex items-center justify-between gap-4 mb-8">
        <button
          type="button"
          className="p-3 bg-white hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer rounded-full flex items-center justify-center shadow-sm shrink-0"
          onClick={() => navigate("/")}
        >
          <FaArrowLeftLong className="w-5 h-5 text-gray-700" />
        </button>

        <div className="px-5 py-2.5 text-sm md:text-base font-bold bg-red-500 text-white rounded-full shadow-sm tracking-tight">
          SetUp Your Home
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/listingpage2");
        }}
        className="w-full max-w-2xl bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-5"
      >
        <div className="w-full flex flex-col gap-1.5">
          <label
            htmlFor="title"
            className="text-xs font-bold text-gray-500 uppercase tracking-wider"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            required
            placeholder="E.g., Cozy Beachfront Villa"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm bg-gray-50/30"
          />
        </div>

        <div className="w-full flex flex-col gap-1.5">
          <label
            htmlFor="description"
            className="text-xs font-bold text-gray-500 uppercase tracking-wider"
          >
            Description
          </label>
          <textarea
            id="description"
            required
            placeholder="Tell us about your home, amenities, and nearby spaces..."
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full p-3 border border-gray-200 rounded-xl h-28 resize-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm bg-gray-50/30"
          />
        </div>

        <div className="w-full flex flex-col gap-3 border-y border-gray-100 py-4 my-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Upload Property Images
          </span>

          <div className="w-full flex flex-col gap-1">
            <label
              htmlFor="image1"
              className="text-xs font-semibold text-gray-600"
            >
              Primary Image
            </label>
            <p className="text-xs text-gray-500">
              Only JPG, JPEG, and PNG files are allowed.
            </p>
            <div className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-2 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
              <input
                type="file"
                id="image1"
                required
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={(e) => handleImage1(e)}
                className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="w-full flex flex-col gap-1">
              <label
                htmlFor="image2"
                className="text-xs font-semibold text-gray-600"
              >
                Image 2
              </label>
              <p className="text-xs text-gray-500">
                Only JPG, JPEG, and PNG files are allowed.
              </p>
              <div className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-2 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
                <input
                  type="file"
                  id="image2"
                  required
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  onChange={(e) => handleImage2(e)}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer"
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-1">
              <label
                htmlFor="image3"
                className="text-xs font-semibold text-gray-600"
              >
                Image 3
              </label>
              <p className="text-xs text-gray-500">
                Only JPG, JPEG, and PNG files are allowed.
              </p>
              <div className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-2 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
                <input
                  type="file"
                  id="image3"
                  required
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  onChange={(e) => handleImage3(e)}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="w-full flex flex-col gap-1.5">
            <label
              htmlFor="rent"
              className="text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              Rent / Day
            </label>
            <input
              type="number"
              id="rent"
              required
              placeholder="INR"
              min="0"
              onChange={(e) => setRent(e.target.value)}
              value={rent}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm bg-gray-50/30"
            />
          </div>

          <div className="w-full flex flex-col gap-1.5">
            <label
              htmlFor="city"
              className="text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              required
              placeholder="Enter City"
              onChange={(e) => setCity(e.target.value)}
              value={city}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm bg-gray-50/30"
            />
          </div>

          <div className="w-full flex flex-col gap-1.5">
            <label
              htmlFor="landmark"
              className="text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              Landmark
            </label>
            <input
              type="text"
              id="landmark"
              required
              placeholder="Enter Landmark"
              onChange={(e) => setLandmark(e.target.value)}
              value={landmark}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm bg-gray-50/30"
            />
          </div>
        </div>

        {/* Form Action Footer Button */}
        <div className="w-full border-t border-gray-100 pt-5 mt-3 flex justify-end">
          <button className="w-full sm:w-auto px-12 py-3 bg-red-500 hover:bg-red-600 active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-red-100 cursor-pointer">
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
}

export default ListingPage1;
