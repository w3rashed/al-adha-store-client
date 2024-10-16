import { useEffect, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useNavigate } from "react-router-dom";
import useOrderData from "../../Hooks/useOrderData";
import Swal from "sweetalert2";

const OrderStatus = () => {
  const { lastOrder } = useOrderData();
  const navigate = useNavigate();
  const [isStatusFetched, setIsStatusFetched] = useState(false);
  const totalDuration = 180; // Total countdown time (180 seconds)

  // Get the remaining time from localStorage or initialize to the total duration
  const [remainingTime, setRemainingTime] = useState(() => {
    const savedTime = localStorage.getItem("remainingTime");
    return savedTime ? parseInt(savedTime) : totalDuration;
  });

  useEffect(() => {
    // Update localStorage every second with the remaining time
    const interval = setInterval(() => {
      const currentTime = remainingTime - 1;
      setRemainingTime(currentTime);
      localStorage.setItem("remainingTime", currentTime);
    }, 1000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [remainingTime]);

  useEffect(() => {
    if (!lastOrder?.status && !isStatusFetched) {
      const interval = setInterval(() => {
        window.location.reload();
      }, 5000);

      return () => clearInterval(interval);
    } else {
      setIsStatusFetched(true);
    }
  }, [lastOrder?.status, isStatusFetched]);

  useEffect(() => {
    if (lastOrder?.status && !isStatusFetched) {
      Swal.fire({
        position: "top",
        title: `Your order has been ${lastOrder.status}`,
        confirmButtonText: "OK",
      }).then(() => {
        setIsStatusFetched(true);
        navigate("/");
      });
    }
  }, [lastOrder?.status, isStatusFetched, navigate]);

  return (
    <div>
      <div className="flex justify-center my-5">
        <CountdownCircleTimer
          isPlaying
          duration={totalDuration} // Total countdown time (180 seconds)
          initialRemainingTime={remainingTime} // Start from the saved remaining time
          colors={["#14B8A9"]}
          size={150}
          strokeWidth={6}
          onComplete={() => {
            localStorage.removeItem("remainingTime"); // Clear localStorage on completion
          }}
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
    </div>
  );
};

export default OrderStatus;
