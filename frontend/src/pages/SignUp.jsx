import React, { useContext, useState, useRef, useEffect } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { userDataContect } from "../context/UserContext";
import { toast } from "react-toastify";

function SignUp() {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));

  
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const inputRefs = useRef([]);

  const { setUserData } = useContext(userDataContect);
  const navigate = useNavigate();
  const { serverUrl, loading, setLoading } = useContext(authDataContext);

  
  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current); 
  }, [timer]);

  
  useEffect(() => {
    if (showOtpModal) {
      if (inputRefs.current[0]) inputRefs.current[0].focus();
      setTimer(120); 
    }
  }, [showOtpModal]);

  const validateForm = () => {
    const trimmedName = value.name.trim();
    if (trimmedName.length < 3) {
      toast.error("Username must be at least 3 characters long.");
      return false;
    }

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
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

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      let result = await axios.post(serverUrl + "/api/auth/signup", value, {
        withCredentials: true,
      });
      setLoading(false);
      toast.success(result.data.message || "OTP sent to your email!");
      setShowOtpModal(true);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  const handleOtpChange = (element, index) => {
    const val = element.value.replace(/[^0-9]/g, "");
    if (!val) return;

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    if (index < 5 && element.value) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index] !== "") {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputRefs.current[5].focus();
    } else {
      toast.error("Please paste a valid 6-digit number");
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    const finalOtpString = otp.join("");
    if (finalOtpString.length !== 6) {
      toast.error("Please enter a complete 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/verify-otp",
        { otp: finalOtpString },
        { withCredentials: true },
      );
      setLoading(false);

      const verifiedUser = result.data.userData;
      setUserData(verifiedUser);
      toast.success("Account verified completely!");
      setShowOtpModal(false);

      setTimeout(() => {
        navigate("/");
      }, 400);
    } catch (error) {
      setLoading(false);
      const errorMsg = error.response?.data?.message || "Verification failed";
      toast.error(errorMsg);

      if (
        error.response?.status === 400 &&
        errorMsg.includes("Verification session expired")
      ) {
        setShowOtpModal(false);
        navigate("/verify-user");
      }
    }
  };

  // 2. Handle Resend with timer reset the resend otp
  const handleResendInModal = async () => {
    if (timer > 0) return; 

    try {
      const response = await axios.post(
        serverUrl + "/api/auth/resend-otp",
        {},
        { withCredentials: true },
      );
      toast.success(response.data.message);
      setOtp(new Array(6).fill(""));
      inputRefs.current[0].focus();

      setTimer(120); 
    } catch (error) {
      const errorMsg = error.response?.data?.message || "";
      toast.error(errorMsg);
      if (
        error.response?.status === 400 &&
        errorMsg.includes("Verification session expired")
      ) {
        setShowOtpModal(false);
        navigate("/verify-user");
      }
    }
  };

  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center relative bg-white">
     
      <div
        className="w-[50px] h-[50px] bg-[red] cursor-pointer absolute top-[10%] left-[20px] rounded-[50%] flex justify-center items-center z-10"
        onClick={() => navigate("/")}
      >
        <FaArrowLeftLong className="w-[25px] h-[25px] text-white" />
      </div>

      {/* Main Registration Form Block */}
      <form
        onSubmit={handleSignUp}
        className={`max-w-[900px] w-[90%] h-[600px] flex flex-col items-center justify-center md:items-start gap-[10px] transition-all duration-300 ${
          showOtpModal ? "blur-md pointer-events-none scale-[0.98]" : ""
        }`}
      >
        <h1 className="text-[30px] text-black font-semibold">
          Welcome to SafarStay
        </h1>

        <div className="w-[90%] flex items-start flex-col gap-[10px] mt-[30px]">
          <label htmlFor="name" className="text-[20px]">
            UserName
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={value.name}
            className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px]"
            onChange={handleChange}
          />
        </div>

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
            onChange={handleChange}
          />
        </div>

        <div className="w-[90%] flex items-start flex-col gap-[10px] relative">
          <label htmlFor="password" className="text-[20px]">
            Password
          </label>
          <input
            type={show ? "text" : "password"}
            id="password"
            value={value.password}
            name="password"
            required
            className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px]"
            onChange={handleChange}
          />
          {show ? (
            <FaEyeSlash
              className="w-[22px] h-[22px] absolute right-[12%] bottom-[10px] cursor-pointer text-gray-600"
              onClick={() => setShow(false)}
            />
          ) : (
            <IoEyeSharp
              className="w-[22px] h-[22px] absolute right-[12%] bottom-[10px] cursor-pointer text-gray-600"
              onClick={() => setShow(true)}
            />
          )}
        </div>

        <button
          className="px-[50px] py-[10px] bg-[red] text-white text-[18px] md:px-[100px] rounded-lg mt-[20px] font-medium tracking-wide active:scale-95 transition-transform"
          disabled={loading}
        >
          {loading ? "Loading...." : "Signup"}
        </button>

        <p className="text-[18px]">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[19px] text-[red] cursor-pointer font-medium hover:underline"
          >
            Login
          </span>
        </p>
      </form>

      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in transition-all duration-300">
          <div className="bg-white p-10 rounded-2xl shadow-2xl flex flex-col items-center max-w-lg w-[95%] border border-gray-100 transform scale-100 transition-transform duration-300">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight text-center">
              Verify Your Account
            </h2>
            <p className="text-gray-500 text-center text-base mb-8 max-w-sm leading-relaxed">
              We sent a 6-digit confirmation code to{" "}
              <span className="text-gray-900 font-semibold block mt-1 break-all bg-gray-50 px-2 py-1 rounded-md border border-gray-200/60 inline-block">
                {value.email}
              </span>
            </p>

            <form
              onSubmit={handleVerifyOtpSubmit}
              className="flex flex-col items-center w-full"
            >
              <div
                className="flex gap-3 justify-center mb-8"
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    ref={(el) => (inputRefs.current[index] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="w-14 h-16 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold text-gray-800 focus:border-green-500 focus:ring-4 focus:ring-red-100 outline-none transition-all duration-200 shadow-sm"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-lg font-semibold active:scale-[0.99] hover:shadow-lg hover:shadow-red-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify & Activate"}
              </button>
            </form>

            <div className="flex justify-between items-center w-full mt-8 pt-6 border-t border-gray-100 text-sm">
              {/* --- DYNAMIC RESEND BUTTON --- */}
              {timer > 0 ? (
                <span className="text-gray-400 font-medium select-none flex items-center gap-1.5">
                  Resend OTP in{" "}
                  <span className="font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                    {formatTime(timer)}
                  </span>
                </span>
              ) : (
                <button
                  onClick={handleResendInModal}
                  className="text-red-600 font-bold hover:text-red-700 hover:underline active:scale-95 transition-transform"
                >
                  Resend OTP
                </button>
              )}
              {/* ----------------------------- */}

              <button
                onClick={() => setShowOtpModal(false)}
                className="text-gray-500 font-medium hover:text-gray-800 hover:underline transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;
