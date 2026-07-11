import React from "react";
import { useContext } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { userDataContect } from "../context/UserContext";
import Card from "../components/Card";

function MyListing() {
  let navigate = useNavigate();
  let { userData } = useContext(userDataContect);
  return (
    <div className="w-[100vw] min-h-[100vh] flex items-center justify-start flex-col gap-[50px] relative  px-[20px]">
      <div
        className="w-[50px] h-[50px] bg-[red] cursor-pointer absolute top-[10%] left-[20px] rounded-[50%] flex items-center justify-center "
        onClick={() => navigate("/")}
      >
        <FaArrowLeftLong className="w-[25px] h-[25px] text-[white]" />
      </div>
      <div className="w-[90%] max-w-[600px] border border-gray-200 py-4 px-6 flex items-center justify-center text-xl md:text-2xl rounded-xl text-gray-800 font-bold tracking-wide shadow-lg mt-12 bg-white">
        MY LISTINGS
      </div>
      <div className="w-[100%] h-[90%] flex items-center justify-center gap-[25px] flex-wrap mt-[30px] ">
        {userData.listing.map((list) => (
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
        ))}
      </div>
    </div>
  );
}

export default MyListing;
