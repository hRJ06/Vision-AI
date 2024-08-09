import React from "react";

const SkeletonLoader = ({ width = "100%", height = "1.5rem" }) => (
  <div
    style={{
      width,
      height,
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite ease-in-out",
    }}
  ></div>
);

export default SkeletonLoader;
