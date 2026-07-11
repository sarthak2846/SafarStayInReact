import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { userDataContect } from "../context/UserContext";
import { toast } from "react-toastify";

function Verify() {
  const location = useLocation();
  const navigate = useNavigate();

  
  const passedEmail = location.state?.email || "";

  const [email, setEmail] = useState(passedEmail);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const inputRefs = useRef([]);

  const { setUserData } = useContext(userDataContect);
  const { serverUrl, loading, setLoading } = useContext(authDataContext);

  // Timer Countdown Effect
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

  // Focus first input and set timer when OTP Modal mounts
  useEffect(() => {
    if (showOtpModal) {
      if (inputRefs.current[0]) inputRefs.current[0].focus();
      setTimer(120); // 2 minutes
    }
  }, [showOtpModal]);

  const validateEmailForm = () => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  // Step 1: Request OTP from backend
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!validateEmailForm()) return;
    setLoading(true);
    try {
      let result = await axios.post(
        serverUrl + "/api/auth/request-verification",
        { email },
        { withCredentials: true }
      );
      setLoading(false);
      toast.success(result.data.message || "Verification OTP sent!");
      setShowOtpModal(true);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Verification request failed");
    }
  };

  // OTP Keyboard / Focus Handlers
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
        { withCredentials: true }
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
    }
  };


  const handelResetOtp = async () => {
    if (timer > 0) return;

    try {
      const response = await axios.post(
        serverUrl + "/api/auth/resend-otp",
        {},
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setOtp(new Array(6).fill(""));
      inputRefs.current[0].focus();
      setTimer(120);
    } catch (error) {
      toast.error(error.response?.data?.message || "Resend failed");
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
        onClick={() => navigate("/login")}
      >
        <FaArrowLeftLong className="w-[25px] h-[25px] text-white" />
      </div>

     
      <form
        onSubmit={handleRequestOtp}
        className={`max-w-[900px] w-[90%] h-[600px] flex flex-col items-center justify-center md:items-start gap-[10px] transition-all duration-300 ${
          showOtpModal ? "blur-md pointer-events-none scale-[0.98]" : ""
        }`}
      >
        <h1 className="text-[30px] text-black font-semibold">
          Verify Your Email
        </h1>
        <p className="text-gray-500 text-[16px] md:max-w-md mb-4">
          If you didn't activate your account during signup or your session expired, enter your email below to receive an activation link.
        </p>

        <div className="w-[90%] flex items-start flex-col gap-[10px]">
          <label htmlFor="email" className="text-[20px]">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px] outline-none focus:border-[red]"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="px-[50px] py-[10px] bg-[red] text-white text-[18px] md:px-[100px] rounded-lg mt-[20px] font-medium tracking-wide active:scale-95 transition-transform disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Verification Code"}
        </button>
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
                {email}
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
              {timer > 0 ? (
                <span className="text-gray-400 font-medium select-none flex items-center gap-1.5">
                  Resend OTP in{" "}
                  <span className="font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                    {formatTime(timer)}
                  </span>
                </span>
              ) : (
                <button
                  onClick={handelResetOtp}
                  className="text-red-600 font-bold hover:text-red-700 hover:underline active:scale-95 transition-transform"
                >
                  Resend OTP
                </button>
              )}

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

export default Verify;