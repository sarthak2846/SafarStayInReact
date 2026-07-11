import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Star from "../components/Star"; 
import { authDataContext } from "../context/AuthContext";
import { listingDataContext } from "../context/ListingContext";


function Rating() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);
  let {getListing} = useContext(listingDataContext);

  const [star, setStar] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleStar = (value) => {
    setStar(value);
    setErrorMessage(""); 
    console.log("you rated", value);
  };

  const handleSubmitRating = async () => {
    if (!star) {
      setErrorMessage("Please select a star rating value before submitting.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const response = await axios.patch(
        `${serverUrl}/api/listing/rate/${id}`, 
        { ratings: star },
        { withCredentials: true } 
      );
    await getListing();
      if (response.status === 200) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred while sending your rating review data."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-[#fdfdfd] flex items-center justify-center flex-col p-[20px]">
      <div className="w-[95%] max-w-[600px] bg-[white] flex items-center justify-center border-[1px] border-[#b5b5b5] flex-col gap-[20px] p-[30px] md:w-[80%] rounded-lg shadow-md transition-all duration-300">
        
        {isSuccess ? (
          <div className="text-center flex flex-col gap-[10px]">
            <h1 className="text-[24px] font-bold text-[green]">Review Submitted!</h1>
            <p className="text-gray-500 text-[16px]">Thank you for your feedback. Redirecting home...</p>
          </div>
        ) : (
          <>
            <h1 className="text-[20px] font-semibold text-[#4a3434]">
              {star ? `${star} out of 5 Rating` : "Rate Your Stay"}
            </h1>
            
            {/* Embedded Your Pre-built Custom Star Component */}
            <div className="py-[10px] transform scale-110">
              <Star onRate={handleStar} />
            </div>

            {/* Error Message Layout Anchor */}
            {errorMessage && (
              <span className="text-[red] text-[14px] font-medium bg-red-50 px-[15px] py-[6px] rounded-md border border-red-200 text-center">
                {errorMessage}
              </span>
            )}

            <button 
              className={`px-[30px] py-[10px] text-[white] text-[18px] md:px-[100px] rounded-lg text-nowrap font-medium transition-all duration-200 ${
                submitting 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-[red] hover:bg-red-600 active:scale-95 shadow-sm"
              }`}
              onClick={handleSubmitRating}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default Rating;