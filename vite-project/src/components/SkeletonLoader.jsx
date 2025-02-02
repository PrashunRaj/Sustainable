// SkeletonLoader.jsx
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
        <Skeleton height={192} />
        <div className="p-6">
          <Skeleton width="70%" />
          <Skeleton width="40%" />
          <Skeleton width="90%" />
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonLoader;
