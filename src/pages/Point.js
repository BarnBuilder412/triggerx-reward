import React, { useState, useEffect } from "react";
import point from "../assets/point.svg";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

const Point = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const [points, setPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchPoints = async () => {
      if (!address) return;
      console.log("Fetching points for address:", address);

      try {
        setLoading(true);
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

        const response = await fetch(
          `${API_BASE_URL}/api/wallet/points/${address}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch points");
        }

        const data = await response.json();
        const pointsData = data.total_points;
        console.log("Fetched points data:", data);
        setPoints(pointsData);
      } catch (err) {
        console.error("Error fetching points:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, [address]);

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
        .map((_, i) => <span key={i} className="text-md">No Point</span>);
  
    const displayValue = isDoubled ? value * 2 : value;
    const digits = String(displayValue).padStart(5, "0");
  
    return digits.split("").map((digit, index) => {
      const numDigit = parseInt(digit);
      const offset = -numDigit * 50;
      const delay = index * 0.2;
      
      return (
        <div key={index} className="odometer-digit" style={{ height: '50px', overflow: 'hidden' }}>
          <div 
            className={`odometer-digit-inner ${color}`} 
            style={{
              transform: `translateY(0px)`, // Start from 0 position
              transition: `transform 1.5s ease-out ${delay}s`,
              display: 'flex',
              flexDirection: 'column',
              animation: `roll 1.5s ease-out ${delay}s`
            }}
            onAnimationEnd={(e) => {
              // After animation completes, set final position
              e.currentTarget.style.transform = `translateY(${offset}px)`;
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <span key={num} style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {num}
              </span>
            ))}
          </div>
        </div>
      );
    });
  };
  

  return (
    <div className="min-h-screen md:mt-[20rem] mt-[10rem]">
      <div className="p-5">
        <div className="md:flex-space-evenly bg-[#141414] rounded-3xl xl:p-12 p-12 flex items-center justify-evenly gap-20 md:w-[90%] w-full mx-auto flex-col xl:flex-row md:flex-row">
          {/* Left - 3D Gift Image */}
          <div className="w-1/3 md:hidden xl:block hidden lg:block">
            <img src={point} alt="Gift" className="w-full h-auto  " />
          </div>
          <div className="">
            <div className="flex flex-col md:flex-row gap-8 md:gap-20">
              {/* Center - Total Points */}
              <div className="text-center">
                <h1 className="text-white text-start xl:text-xl text-md mb-4 tracking-wide">
                  Total Points
                </h1>
                <div className="bg-[#1A1A1A] rounded-xl px-10 py-6 border border-bg-[#6C6C6C]">
  {points === null || points === undefined || points === 0 ? (
    <div className="text-white text-xl font-bold font-actayRegular">No Points</div>
  ) : (
    <div className="flex gap-4 xl:text-4xl text-xl font-bold text-white">
      {renderDigits(points, "text-white")}
    </div>
  )}
</div>
              </div>

              {/* Right - Boosted Rewards */}
              <div className="text-center">
                <h1 className="text-[#E8FF66] xl:text-xl text-md mb-4 tracking-wide text-start">
                  Boosted Rewards
                </h1>
                <div className="bg-[#1A1A1A] rounded-xl px-10 py-6 border border-bg-[#6C6C6C]">
                  {points === null || points === undefined || points === 0 ? (
                    <div className="text-[#E8FF66] text-xl font-bold font-actayRegular">No Points</div>
                  ) : (
                    <div className="flex gap-4 font-bold text-[#E8FF66] xl:text-4xl text-2xl">
                      {renderDigits(points, "text-[#E8FF66]", true)}
                    </div>
                  )}
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
                <span className="absolute inset-0 bg-[#9747FF]  rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
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