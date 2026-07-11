import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { authDataContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const listingDataContext = createContext();

function ListingContext({ children }) {
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [frontEndImage1, setFrontEndImage1] = useState(null);
  let [frontEndImage2, setFrontEndImage2] = useState(null);
  let [frontEndImage3, setFrontEndImage3] = useState(null);
  let [backendImage1, setBackendImage1] = useState(null);
  let [backendImage2, setBackendImage2] = useState(null);
  let [backendImage3, setBackendImage3] = useState(null);
  let [rent, setRent] = useState("");
  let [city, setCity] = useState("");
  let [landmark, setLandmark] = useState("");
  let [category, setCategory] = useState("");
  let [adding, setAdding] = useState(false);
  let [updating,setUpdating]=useState(false);
  let[deleting,setDeleting]=useState(false)
  let [listingData, setListingData] = useState([]);
  let [newListData, setNewListData] = useState([]);
  let { serverUrl } = useContext(authDataContext);
  let[cardDetails,setCardDetails]=useState(null);
  let[searchData,setSearchData]=useState([]);
  let navigate = useNavigate();

  const handleAddListing = async () => {
    setAdding(true);
    try {
      let formData = new FormData();
      formData.append("title", title);
      formData.append("image1", backendImage1);
      formData.append("image2", backendImage2);
      formData.append("image3", backendImage3);
      formData.append("description", description);
      formData.append("rent", rent);
      formData.append("city", city);
      formData.append("landmark", landmark);
      formData.append("category", category);

      let result = await axios.post(serverUrl + "/api/listing/add", formData, {
        withCredentials: true,
      });
      setAdding(false);
      navigate("/");
      toast.success("AddListing Successful");
      setTitle("");
      setDescription("");
      setFrontEndImage1(null);
      setFrontEndImage2(null);
      setFrontEndImage3(null);
      setBackendImage1(null);
      setBackendImage2(null);
      setBackendImage3(null);
      setRent("");
      setCity("");
      setLandmark("");
      setCategory("");
    } catch (error) {
      setAdding(false);
      toast.error(error.response?.data.message);
      }
  };

  const handleViewCard = async (id) => {
    try {
      localStorage.setItem("viewingCardId", id);
      let result = await axios.get(
        serverUrl + `/api/listing/findlistingbyid/${id}`,
        { withCredentials: true },
      );
      setCardDetails(result.data);
      navigate('/viewcard')
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
  const restoreCardDetails = async () => {
    const savedId = localStorage.getItem("viewingCardId");
    
  if (savedId && !cardDetails && serverUrl) {
      try {
        let result = await axios.get(
          serverUrl + `/api/listing/findlistingbyid/${savedId}`,
          { withCredentials: true }
        );
        
        setCardDetails(result.data);
      } catch (error) {
        console.error("Error restoring card on refresh:", error);
      }
    }
  };
 
  restoreCardDetails();
}, [serverUrl]);


  const getListing = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/listing/get", {
        withCredentials: true,
      });
      setListingData(result.data);
      setNewListData(result.data);
    } catch (error) {
      console.log(error);
    }
  };

 // handle serarch
  const handleSearch = async (data) => {
        try {
            let result = await axios.get(serverUrl + `/api/listing/search?query=${data}`)
            setSearchData(result.data)
        } catch (error) {
            setSearchData(null)    
        }
        
     }


  useEffect(() => {
    getListing();
  }, [adding,updating,deleting]);

  let value = {
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
    searchData,
    setSearchData,
    category,
    setCategory,
    adding,
    setAdding,
    listingData,
    setListingData,
    newListData,
    setNewListData,
    getListing,
    handleAddListing,
    cardDetails,setCardDetails,
    updating,setUpdating,
    deleting,setDeleting,
    handleViewCard,
    handleSearch
  };

  return (
    <div>
      <listingDataContext.Provider value={value}>
        {children}
      </listingDataContext.Provider>
    </div>
  );
}

export default ListingContext;
