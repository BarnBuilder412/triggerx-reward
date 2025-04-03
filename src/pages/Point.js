import React, { useState, useEffect, useRef } from "react";
import point from "../assets/point.svg";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

// Individual digit component for the odometer effect
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
  const animationTimeout = useRef(null);

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

        // Random starting numbers for animation effect
        setDisplayPoints(
          Array(5)
            .fill()
            .map(() => Math.floor(Math.random() * 10))
        );

        // Start the animation after a short delay
        setTimeout(() => {
          startAnimation(pointsData);
          setLoading(false);
        }, 300);
      } catch (err) {
        console.error("Error fetching points:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPoints();

    return () => {
      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current);
      }
    };
  }, [address]);

  const startAnimation = (targetPoints) => {
    // Convert targetPoints to array of digits, padded to 5 digits
    const targetDigits = String(targetPoints)
      .padStart(5, "0")
      .split("")
      .map(Number);

    // Animate each digit one by one with slight delays
    targetDigits.forEach((digit, index) => {
      setTimeout(() => {
        setDisplayPoints((prev) => {
          const newDigits = [...prev];
          newDigits[index] = digit;
          return newDigits;
        });
      }, index * 200); // Stagger the animation of each digit
    });
  };

  const renderOdometerDigits = (digits, color, isDoubled = false) => {
    if (loading) {
      return Array(5)
        .fill(0)
        .map((_, i) => (
          <span key={i} className="animate-pulse">
            0
          </span>
        ));
    }

    if (error || !digits) {
      return <span>No Point</span>;
    }

    // If we need to double the value for boosted rewards
    if (isDoubled && points !== null) {
      const doubledPoints = points * 2;
      const doubledDigits = String(doubledPoints)
        .padStart(5, "0")
        .split("")
        .map(Number);

      return doubledDigits.map((digit, index) => (
        <OdometerDigit key={index} value={digit} color={color} />
      ));
    }

    return digits.map((digit, index) => (
      <OdometerDigit key={index} value={digit} color={color} />
    ));
  };

  return (
    <div className="min-h-screen md:mt-[20rem] mt-[10rem]">
      <div className="p-5">
        <div className="md:flex-space-evenly bg-[#141414] rounded-3xl xl:p-12 p-12 flex items-center justify-evenly gap-20 md:w-[90%] w-full mx-auto flex-col xl:flex-row md:flex-row">
          {/* Left - 3D Gift Image */}
          <div className="w-1/3 md:hidden xl:block hidden lg:block">
            <img src={point} alt="Gift" className="w-full h-auto" />
          </div>
          <div className="">
            <div className="flex flex-col md:flex-row gap-8 md:gap-20">
              {/* Center - Total Points */}
              <div className="text-center">
                <h1 className="text-white text-start xl:text-xl text-md mb-4 tracking-wide">
                  Total Points
                </h1>
                <div className="bg-[#1A1A1A] rounded-xl px-10 py-6 border border-bg-[#6C6C6C]">
                  <div className="flex gap-4 xl:text-4xl text-xl font-bold text-white">
                    {renderOdometerDigits(displayPoints, "text-white")}
                  </div>
                </div>
              </div>

              {/* Right - Boosted Rewards */}
              <div className="text-center">
                <h1 className="text-[#E8FF66] xl:text-xl text-md mb-4 tracking-wide text-start">
                  Boosted Rewards
                </h1>
                <div className="bg-[#1A1A1A] rounded-xl px-10 py-6 border border-bg-[#6C6C6C] ">
                  <div className="flex gap-4 font-bold text-[#E8FF66] xl:text-4xl text-2xl">
                    {renderOdometerDigits(displayPoints, "text-[#E8FF66]")}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center xl:mt-20 mt-10">
              <button
                onClick={() => {
                  window.open(
                    "https://app.triggerx.network/leaderboard",
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                className="relative bg-[#222222] text-[#FFFFFF] border border-[#222222] px-6 py-2 sm:px-8 sm:py-3 rounded-full group transition-transform"
              >
                <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
                <span className="absolute inset-0 bg-[#9747FF] rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
                <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-2 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs sm:text-base">
                  Guess Who's Leading?
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Point;
