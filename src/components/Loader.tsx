import React from "react";

interface LoaderProps {
  className: string;
  fill: string;
}

const Loader: React.FC<LoaderProps> = ({ className, fill }) => {
  return (
    <div
      className={`aspect-square rounded-full grid items-center justify-items-center animate-spin ${className}`}
    >
      <div className={`w-[80%] aspect-square rounded-full ${fill}`}></div>
    </div>
  );
};

export default Loader;
