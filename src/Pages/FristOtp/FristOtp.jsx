import { useState } from "react";
import TextField from "@mui/material/TextField";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useNavigate } from "react-router-dom";
import useOrderData from "../../Hooks/useOrderData";
import Swal from "sweetalert2";

const FristOtp = () => {
  // State for OTP input and error message
  const [otp, setOtp] = useState("");
  const [isOtpCorrect, setIsOtpCorrect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { lastOrder } = useOrderData();
  const otp1 = lastOrder?.otp1; 
  const navigate = useNavigate();

  // Handle OTP input change
  const handleOtpChange = (e) => {
    const value = e.target.value;

    // Allow only digits and limit to 8 characters
    if (/^\d{0,8}$/.test(value)) {
      setOtp(value);

      // Check if the OTP has 8 digits
      if (value.length === 8) {
        setIsOtpCorrect(true); // Show Verify OTP button
      } else {
        setIsOtpCorrect(false); // Hide Verify OTP button
      }
    }
  };

  const handleVerifyOtp = () => {
    
    if (parseInt(otp) === otp1) {
      Swal.fire({
        position: "top",
        icon: "success",
        title: "Successfully verified your number",
        showConfirmButton: false,
        timer: 1500,
      });

      // Navigate to user details after the alert
      setTimeout(() => {
        navigate("/userDetails");
      }, 1500); // Delay navigation to allow alert to display
    } else {
      setErrorMessage("Incorrect OTP. Please try again.");
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-center text-4xl font-bold text-gray-700 my-5">
        Number Verification
      </h2>

      {/* Countdown Timer */}
      <div className="flex justify-center my-5">
        <CountdownCircleTimer
          isPlaying
          duration={180}
          colors={["#14B8A9"]}
          colorsTime={[180]}
          size={150}
          strokeWidth={6}
        >
          {({ remainingTime }) => {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

            return (
              <div className="text-2xl sm:text-3xl md:text-4xl">
                {`${minutes}:${formattedSeconds}`}
              </div>
            );
          }}
        </CountdownCircleTimer>
      </div>

      {/* OTP Input Field */}
      <div className="lg:flex justify-center my-5 mx-3">
        <div className="lg:w-1/2">
          <TextField
            className="text-2xl"
            id="otp-input"
            label="Enter Your OTP"
            type="text"
            variant="standard"
            fullWidth
            required
            value={otp}
            onChange={handleOtpChange}
            inputProps={{ maxLength: 8 }}
          />
        </div>
      </div>

      {/* Verify OTP Button (only visible when 8 digits are entered) */}
      {isOtpCorrect && (
        <div className="flex justify-center my-3">
          <button
            onClick={handleVerifyOtp}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Verify OTP
          </button>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="text-red-500 text-center my-3">{errorMessage}</div>
      )}
    </div>
  );
};

export default FristOtp;
