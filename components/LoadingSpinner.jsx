"use client";

import React from "react";

// Enhanced Loading Spinner with multiple variants
export const LoadingSpinner = ({ 
  size = "md", 
  type = "spinner", 
  color = "primary",
  text = "",
  className = "" 
}) => {
  const sizeClasses = {
    xs: "w-4 h-4",
    sm: "w-6 h-6", 
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const colorClasses = {
    primary: "border-blue-600",
    secondary: "border-gray-600",
    success: "border-green-600",
    warning: "border-yellow-600",
    danger: "border-red-600"
  };

  if (type === "dots") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full bg-current animate-pulse`}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.4s'
              }}
            />
          ))}
        </div>
        {text && <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>}
      </div>
    );
  }

  if (type === "bars") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-1 h-4 bg-current rounded-full animate-pulse`}
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1.2s'
              }}
            />
          ))}
        </div>
        {text && <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-2 border-gray-300 border-t-current rounded-full animate-spin ${colorClasses[color]}`}
      />
      {text && <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>}
    </div>
  );
};

// Skeleton Components for better perceived performance
export const Skeleton = ({ 
  className = "", 
  width = "w-full", 
  height = "h-4",
  rounded = "rounded"
}) => (
  <div 
    className={`${width} ${height} ${rounded} bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}
  />
);

export const SkeletonCard = ({ className = "" }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm ${className}`}>
    <div className="flex items-center space-x-4">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-3/4 h-4" />
        <Skeleton className="w-1/2 h-3" />
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <Skeleton className="w-full h-3" />
      <Skeleton className="w-5/6 h-3" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
    {/* Header */}
    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
      <div className="flex space-x-6">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="w-24 h-4" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    <div className="divide-y divide-gray-200 dark:divide-gray-600">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4">
          <div className="flex space-x-6">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton 
                key={colIndex} 
                className="w-20 h-4" 
                width={colIndex === 0 ? "w-32" : "w-20"}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonStats = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
        <Skeleton className="w-20 h-8 mt-2" />
        <Skeleton className="w-24 h-3 mt-2" />
      </div>
    ))}
  </div>
);

export const SkeletonForm = ({ fields = 4 }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
    <Skeleton className="w-48 h-6 mb-6" />
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <Skeleton className="w-24 h-4 mb-2" />
          <Skeleton className="w-full h-10 rounded-lg" />
        </div>
      ))}
    </div>
    <div className="flex gap-3 mt-6">
      <Skeleton className="w-24 h-10 rounded-lg" />
      <Skeleton className="w-24 h-10 rounded-lg" />
    </div>
  </div>
);

// Loading Overlay for full-page loading
export const LoadingOverlay = ({ 
  isLoading, 
  children, 
  text = "Loading...",
  backdrop = true 
}) => {
  if (!isLoading) return children;

  return (
    <div className="relative">
      {children}
      <div className={`absolute inset-0 flex items-center justify-center ${backdrop ? 'bg-white/80 dark:bg-gray-900/80' : ''}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-600">
          <LoadingSpinner size="lg" text={text} />
        </div>
      </div>
    </div>
  );
};

// Inline Loading for buttons and small elements
export const InlineLoading = ({ isLoading, children, loadingText = "Loading..." }) => {
  if (!isLoading) return children;
  
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size="sm" />
      <span className="text-sm text-gray-600 dark:text-gray-400">{loadingText}</span>
    </div>
  );
};

export default LoadingSpinner; 