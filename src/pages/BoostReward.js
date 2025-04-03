import React, { useState, useEffect } from "react";
import reward from "../assets/reward.svg";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Point from "./Point";

const BoostReward = () => {
  const { isConnected } = useAccount();
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const targetDate = new Date("2025-04-07T23:59:59").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: days.toString().padStart(2, "0"),
          hours: hours.toString().padStart(2, "0"),
          minutes: minutes.toString().padStart(2, "0"),
          seconds: seconds.toString().padStart(2, "0"),
        });
      }
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen lg:mt-[20rem] mt-[10rem]">
      {isConnected ? (
        <Point />
      ) : (
        <div className="flex xl:p-8 p-5 gap-8 text-white max-w-[1600px] mx-auto justify-center xs:flex-col-reverse xl:flex-row flex-col-reverse">
          {/* Left Content Section */}
          <div className="bg-[#141414] rounded-2xl xl:p-12 px-5 py-8  xl:w-[60%] xs:w-full">
            <div className="mb-8 ">
              <h1 className="xl:text-4xl text-md mb-6 tracking-wide">
                Grow the Ecosystem,
                <br />
                Grow Your Rewards!
              </h1>
              <p className="text-white leading-relaxed">
                TriggerX testnet is live on Holeski, and we're boosting rewards!
              </p>
              <p className="text-[#F8FF7C]">
                2x your rewards by registering before April 7th :{" "}
              </p>
              <p>become a core part of our ecosystem and earn more!</p>
            </div>

            <div className="mt-8">
              <h2 className="text-[#C07AF6] text-2xl mb-8">
                Parameters to earn
              </h2>
              <div className="flex flex-col gap-8 text-gray-400">
                <h4 className="xl:text-lg md:text-sm text-white">
                  <span className="border border-[#C07AF6] bg-[#C07AF638] px-3 py-2 rounded-lg mr-3">
                    1
                  </span>{" "}
                  Total Active Time
                </h4>
                <h4 className="xl:text-lg text-sm text-white">
                  <span className="border border-[#C07AF6] bg-[#C07AF638] px-3 py-2 rounded-lg mr-3">
                    2
                  </span>{" "}
                  Execution Time
                </h4>
                <h4 className="xl:text-lg text-sm text-white">
                  <span className="border border-[#C07AF6] bg-[#C07AF638] px-3 py-2 rounded-lg mr-3">
                    3
                  </span>{" "}
                  Memory Usage
                </h4>
                <h4 className="xl:text-lg text-sm text-white">
                  <span className="border border-[#C07AF6] bg-[#C07AF638] px-3 py-2 rounded-lg mr-3">
                    4
                  </span>{" "}
                  Static Complexity Size
                </h4>
                <h4 className="xl:text-lg text-sm text-white">
                  <span className="border border-[#C07AF6] bg-[#C07AF638] px-3 py-2 rounded-lg mr-3">
                    5
                  </span>{" "}
                  Number of Validator Nodes
                </h4>
              </div>
            </div>
          </div>

          {/* Right Rewards Section */}
          <div className="space-y-8 ">
            <div className="bg-[#141414] rounded-2xl  text-center">
              <div className="mb-4 flex justify-center">
                {/* <div className="w-16 h-16 mx-auto bg-purple-600 rounded-full"></div> */}
                <img src={reward} alt="" className="" />
              </div>
              <div className="px-8 pb-8">
                <h1 className="xl:text-4xl xs:text-2xl font-bold mb-8 tracking-wider">
                  Check your Rewards
                </h1>

                <div className="flex justify-center items-center text-white xl:px-8 px-5 py-3 rounded-full">
                  <ConnectButton chainStatus="none" accountStatus="none" />
                </div>
              </div>
            </div>{" "}
            <div className="bg-[#141414] rounded-2xl text-center p-8">
              <div className=" mx-auto">
                <p className="text-[#EFEFEF] xl:text-start ml-0 py-2 xs:text-center">
                  Time Left For Boosted Rewards
                </p>
                <div className="flex justify-center gap-2 font-bold  mb-2">
                  <div>
                    <div className="flex gap-2 items-center justify-center">
                      <span className="bg-[#1a1a1a] xl:px-4 xs:px-3 py-2 px-2 md:px-6 rounded border-[#6C6C6C] border xl:text-6xl xs:text-2xl ">
                        {timeLeft.days.charAt(0)}
                      </span>
                      <span className="bg-[#1a1a1a] xl:px-4 xs:px-3 py-2 px-2 md:px-6 rounded border-[#6C6C6C] border xl:text-6xl xs:text-2xl">
                        {timeLeft.days.charAt(1)}
                      </span>
                      <span>:</span>
                    </div>
                    <div className="mt-5">
                      <p>DAYS</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex gap-2 items-center justify-center">
                      <span className="bg-[#1a1a1a] xl:px-4 xs:px-3 py-2 px-2 md:px-6 rounded border-[#6C6C6C] border xl:text-6xl xs:text-2xl">
                        {timeLeft.hours.charAt(0)}
                      </span>
                      <span className="bg-[#1a1a1a] xl:px-4 xs:px-3 py-2 px-2 md:px-6 rounded border-[#6C6C6C] border xl:text-6xl xs:text-2xl">
                        {timeLeft.hours.charAt(1)}
                      </span>
                      <span>:</span>
                    </div>
                    <div className="mt-5">
                      <p>HOURS</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex gap-2 items-center justify-center">
                      <span className="bg-[#1a1a1a] xl:px-4 xs:px-3 py-2 px-2 md:px-6 rounded border-[#6C6C6C] border xl:text-6xl xs:text-2xl">
                        {timeLeft.minutes.charAt(0)}
                      </span>
                      <span className="bg-[#1a1a1a] xl:px-4 xs:px-3 py-2 px-2 md:px-6 rounded border-[#6C6C6C] border xl:text-6xl xs:text-2xl">
                        {timeLeft.minutes.charAt(1)}
                      </span>
                    </div>
                    <div className="mt-5">
                      <p>MINS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoostReward;
