import React, { useState, useContext } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { userDataContect } from "../context/UserContext.jsx";
import { toast } from "react-toastify";

function Login() {
  let [show, setShow] = useState(false);
  let navigate = useNavigate();
  let { serverUrl, loading, setLoading } = useContext(authDataContext);
  const [value, setValue] = useState({
    email: "",
    password: "",
  });
  let { userData, setUserData } = useContext(userDataContect);

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(value.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (value.password.length <= 3) {
      toast.error("Password must be at least 4 characters long.");
      return false;
    }

    return true;
  };

  const handlelogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      let result = await axios.post(serverUrl + "/api/auth/login", value, {
        withCredentials: true,
      });
      setLoading(false);
      setUserData(result.data);
      navigate('/');
      toast.success("Login Successfully");
    } catch (error) {
      setLoading(false);
      
      const status = error.response?.status;
      const errorMsg = error.response?.data?.message || "Login failed";

      // If user is registered but email verification is pending
      if (status === 403 || errorMsg.includes("verify your email")) {
        toast.warning(errorMsg);
        // Forward to verification page, attaching the email within the location state
        navigate("/verify-user", { state: { email: value.email } });
      } else {
        toast.error(errorMsg);
      }
    }
  };

  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center relative">
        <div
          className="w-[50px] h-[50px] bg-[red] cursor-pointer absolute top-[10%] left-[20px] rounded-[50%] flex justify-center items-center"
          onClick={() => navigate("/")}
        >
          <FaArrowLeftLong className="w-[25px] h-[25px] text-white" />
        </div>
        
        <form
          onSubmit={(e) => handlelogin(e)}
          className="max-w-[900px] w-[90%] h-[600px] flex flex-col items-center justify-center md:items-start gap-[10px]"
        >
          <h1 className="text-[30px] text-black">Login to SafarStay</h1>

          <div className="w-[90%] flex items-start flex-col gap-[10px]">
            <label htmlFor="email" className="text-[20px]">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              name="email"
              value={value.email}
              className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px]"
              onChange={(e) => handleChange(e)}
            />
          </div>
          
          <div className="w-[90%] flex items-start flex-col gap-[10px] relative">
            <label htmlFor="password" className="text-[20px]">
              Password
            </label>
            <input
              type={show ? "text" : "password"}
              id="password"
              required
              value={value.password}
              name="password"
              className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px]"
              onChange={(e) => handleChange(e)}
            />
            {!show && (
              <IoEyeSharp
                className="w-[22px] h-[22px] absolute right-[12%] bottom-[10px] cursor-pointer"
                onClick={() => setShow((prev) => !prev)}
              />
            )}

            {show && (
              <FaEyeSlash
                className="w-[22px] h-[22px] absolute right-[12%] bottom-[10px] cursor-pointer"
                onClick={() => setShow((prev) => !prev)}
              />
            )}
          </div>
          
          <button 
            className="px-[50px] py-[10px] bg-[red] text-white text-[18px] md:px-[100px] rounded-lg mt-[20px]" 
            disabled={loading}
          >
            {loading ? "Loging...." : "Login"}
          </button>

          <p className="text-[18px]">
            Don't have an account ?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-[19px] text-[red] cursor-pointer"
            >
              SignUp
            </span>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;