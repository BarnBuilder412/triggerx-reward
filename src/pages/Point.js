import React, { useState, useEffect, useRef } from "react";
import point from "../assets/point.svg";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

// New OdometerDigit component for the animation effect
const OdometerDigit = ({ value, color }) => {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const offset = value * 100;

  return (
    <div className={`relative overflow-hidden w-6 h-10 ${color}`}>
      <div
        className="absolute transition-transform duration-700 ease-out"
        style={{ transform: `translateY(-${offset}%)` }}
      >
        {digits.map((digit) => (
          <div
            key={digit}
            className="flex items-center justify-center h-10 font-bold"
          >
            {digit}
          </div>
        ))}
      </div>
    </div>
  );
};

const Point = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const [points, setPoints] = useState(null);
  const [displayPoints, setDisplayPoints] = useState([0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const animationTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchPoints = async () => {
      if (!address) return;
      console.log("Fetching points for address:", address);

      try {
        setLoading(true);
        const response = await fetch(
          `https://data.triggerx.network/api/wallet/points/${address}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch points");
        }

        const data = await response.json();
        const pointsData = data.total_points;
        console.log("Fetched points data:", data);
        setPoints(pointsData);

        // Set initial random digits for animation effect
        const randomDigits = Array(5)
          .fill(0)
          .map(() => Math.floor(Math.random() * 10));
        setDisplayPoints(randomDigits);

        // Start animation after a short delay
        animationTimeoutRef.current = setTimeout(() => {
          animateToFinalValue(pointsData);
        }, 500);
      } catch (err) {
        console.error("Error fetching points:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();

    // Cleanup function
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [address]);

  // Function to animate to the final value
  const animateToFinalValue = (value) => {
    if (value === null || value === undefined) return;

    // Convert value to 5 digit string and then to array of numbers
    const targetDigits = String(value).padStart(5, "0").split("").map(Number);
    setDisplayPoints(targetDigits);
  };

  // Existing renderDigits function (unchanged for integration)
  const renderDigits = (value, color, isDoubled = false) => {
    if (loading)
      return Array(5)
        .fill(0)
        .map((_, i) => (
          <span key={i} className="animate-pulse">
            0
          </span>
        ));
    if (error || value === null || value === undefined)
      return Array(1)
        .fill(0)
        .map((_, i) => <span key={i}>No Point</span>);

    // Double the value if isDoubled is true
    const displayValue = isDoubled ? value * 2 : value;

    // Convert to string and pad to exactly 5 digits
    const digits = String(displayValue).padStart(5, "0");

    return digits.split("").map((digit, index) => (
      <span key={index} className={`${color}`}>
        {digit}
      </span>
    ));
  };

  // New function to render odometer digits
  const renderOdometerDigits = (value, color, isDoubled = false) => {
    if (loading)
      return Array(5)
        .fill(0)
        .map((_, i) => (
          <span key={i} className="animate-pulse">
            0
          </span>
        ));

    if (error || value === null || value === undefined)
      return Array(1)
        .fill(0)
        .map((_, i) => <span key={i}>No Point</span>);

    // Use the current display points for animation
    const digits = isDoubled
      ? displayPoints.map((digit) => Math.min(digit * 2, 9))
      : displayPoints;

    return digits.map((digit, index) => (
      <OdometerDigit key={index} value={digit} color={color} />
    ));
  };

  return (
    <div className="min-h-screen md:mt-[20rem] mt-[10rem]">
      <div className="md:flex-space-evenly bg-[#141414] rounded-3xl p-8 flex items-center justify-evenly gap-20 md:w-[80%] w-full mx-auto">
        {/* Left - 3D Gift Image */}
        <div className="w-1/3 ">
          <img src={point} alt="Gift" className="w-full h-auto" />
        </div>
        <div className="">
          <div className="flex flex-col md:flex-row gap-8 md:gap-20">
            {/* Center - Total Points */}
            <div className="text-center">
              <h1 className="text-white text-start text-xl mb-4 tracking-wide">
                Total Points
              </h1>
              <div className="bg-[#1A1A1A] rounded-xl px-10 py-6 border border-bg-[#6C6C6C]">
                <div className="flex gap-4 text-4xl font-bold text-white">
                  {renderOdometerDigits(points, "text-white")}
                </div>
              </div>
            </div>

            {/* Right - Boosted Rewards */}
            <div className="text-center">
              <h1 className="text-[#E8FF66] text-xl mb-4 tracking-wide text-start">
                Boosted Rewards
              </h1>
              <div className="bg-[#1A1A1A] rounded-xl px-10 py-6 border border-bg-[#6C6C6C] ">
                <div className="flex gap-4 text-4xl font-bold text-[#E8FF66]">
                  {renderOdometerDigits(points, "text-[#E8FF66]", true)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-20">
            <button
              onClick={() => navigate("/leaderboard")}
              className="relative bg-[#222222] text-[#FFFFFF] border border-[#222222] px-6 py-2 sm:px-8 sm:py-3 rounded-full group transition-transform"
            >
              <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
              <span className="absolute inset-0 bg-[#9747FF]  rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
              <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-2 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs sm:text-base">
                Guess Who's Leading?
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Point;
