import React, { useState, useEffect } from "react";
import point from "../assets/point.svg";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

const Point = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const [points, setPoints] = useState(null);
  const [displayPoints, setDisplayPoints] = useState(0);
  const [displayBoostedPoints, setDisplayBoostedPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);

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
        
        // Start with 0 and animate to actual value
        setDisplayPoints(0);
        setDisplayBoostedPoints(0);
        setAnimationComplete(false);
      } catch (err) {
        console.error("Error fetching points:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, [address]);

  // Animation effect for regular points
  useEffect(() => {
    if (points === null || loading || error) return;

    const duration = 1500; // Animation duration in ms
    const framesPerSecond = 60;
    const totalFrames = duration / (1000 / framesPerSecond);
    const pointIncrement = points / totalFrames;
    
    let currentFrame = 0;
    let currentPoints = 0;

    const animationInterval = setInterval(() => {
      currentFrame++;
      currentPoints += pointIncrement;
      
      if (currentFrame >= totalFrames) {
        clearInterval(animationInterval);
        setDisplayPoints(points);
        setDisplayBoostedPoints(points * 2);
        setAnimationComplete(true);
      } else {
        setDisplayPoints(Math.floor(currentPoints));
        setDisplayBoostedPoints(Math.floor(currentPoints * 2));
      }
    }, 1000 / framesPerSecond);

    return () => clearInterval(animationInterval);
  }, [points, loading, error]);

  const renderDigits = (value, color, isAnimating) => {
    if (loading) {
      return Array(5)
        .fill(0)
        .map((_, i) => (
          <span key={i} className="animate-pulse">
            0
          </span>
        ));
    }
    
    if (error || value === null || value === undefined) {
      return Array(1)
        .fill(0)
        .map((_, i) => <span key={i}>No Point</span>);
    }

    // Convert to string and pad to exactly 5 digits
    const digits = String(value).padStart(5, "0");

    return digits.split("").map((digit, index) => (
      <span 
        key={index} 
        className={`${color} transition-all duration-300 ${
          isAnimating ? "transform scale-110" : ""
        }`}
        style={{
          display: "inline-block",
          animation: isAnimating ? "numberBounce 0.5s ease" : "none"
        }}
      >
        {digit}
      </span>
    ));
  };

  return (
    <div className="min-h-screen md:mt-[20rem] mt-[10rem]">
      <style jsx>{`
        @keyframes numberBounce {
          0% { transform: translateY(20px); opacity: 0; }
          60% { transform: translateY(-10px); opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
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
                  {renderDigits(displayPoints, "text-white", !animationComplete)}
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
                  {renderDigits(displayBoostedPoints, "text-[#E8FF66]", !animationComplete)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-20">
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
  );
};

export default Point;