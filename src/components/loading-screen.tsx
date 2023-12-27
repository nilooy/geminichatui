import React from "react";
import Logo from "@/components/logo";
import LoadingDots from "@/components/ui/loading-dots";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Logo />
      <div className="flex items-end mb-4">
        <p className="text-3xl font-black ">Loading</p>
        <LoadingDots rootClass="mb-2" />
      </div>
    </div>
  );
};

export default LoadingScreen;
