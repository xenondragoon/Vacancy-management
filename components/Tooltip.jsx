"use client";

import React, { useState, useRef, useEffect } from "react";

const Tooltip = ({ 
  children, 
  content, 
  position = "top",
  delay = 200,
  className = "",
  maxWidth = "max-w-xs",
  showArrow = true,
  interactive = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const positions = {
    top: {
      tooltip: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
      arrow: "top-full left-1/2 transform -translate-x-1/2 border-t-gray-900 dark:border-t-gray-100"
    },
    bottom: {
      tooltip: "top-full left-1/2 transform -translate-x-1/2 mt-2",
      arrow: "bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900 dark:border-b-gray-100"
    },
    left: {
      tooltip: "right-full top-1/2 transform -translate-y-1/2 mr-2",
      arrow: "left-full top-1/2 transform -translate-y-1/2 border-l-gray-900 dark:border-l-gray-100"
    },
    right: {
      tooltip: "left-full top-1/2 transform -translate-y-1/2 ml-2",
      arrow: "right-full top-1/2 transform -translate-y-1/2 border-r-gray-900 dark:border-r-gray-100"
    }
  };

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleFocus = () => {
    setIsVisible(true);
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className={`relative inline-block ${className}`}
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-lg shadow-lg
            ${maxWidth} ${positions[position].tooltip}
            transition-all duration-200 ease-out
            ${interactive ? 'pointer-events-auto' : 'pointer-events-none'}
          `}
          role="tooltip"
        >
          <div className="text-center">
            {content}
          </div>
          
          {showArrow && (
            <div 
              className={`
                absolute w-0 h-0 border-4 border-transparent
                ${positions[position].arrow}
              `}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Pre-built tooltips for common use cases
export const InfoTooltip = ({ children, content, ...props }) => (
  <Tooltip 
    content={content} 
    position="top" 
    delay={300}
    {...props}
  >
    <div className="inline-flex items-center">
      {children}
      <span className="ml-1 text-blue-500 cursor-help">ℹ️</span>
    </div>
  </Tooltip>
);

export const HelpTooltip = ({ children, content, ...props }) => (
  <Tooltip 
    content={content} 
    position="top" 
    delay={200}
    {...props}
  >
    <div className="inline-flex items-center">
      {children}
      <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help transition-colors">❓</span>
    </div>
  </Tooltip>
);

export const ActionTooltip = ({ children, content, action, ...props }) => (
  <Tooltip 
    content={
      <div className="text-center">
        <div className="mb-2">{content}</div>
        {action && (
          <button
            onClick={action.onClick}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
    }
    position="top"
    interactive={true}
    {...props}
  >
    {children}
  </Tooltip>
);

// Form field tooltips
export const FieldTooltip = ({ label, helpText, error, ...props }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {helpText && (
        <HelpTooltip content={helpText} />
      )}
    </div>
    {props.children}
    {error && (
      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
    )}
  </div>
);

// Status tooltips
export const StatusTooltip = ({ status, details, ...props }) => {
  const statusConfig = {
    success: { icon: "✅", color: "text-green-600" },
    error: { icon: "❌", color: "text-red-600" },
    warning: { icon: "⚠️", color: "text-yellow-600" },
    info: { icon: "ℹ️", color: "text-blue-600" },
    pending: { icon: "⏳", color: "text-gray-600" }
  };

  const config = statusConfig[status] || statusConfig.info;

  return (
    <Tooltip 
      content={
        <div className="text-center">
          <div className="font-medium mb-1">{status}</div>
          {details && <div className="text-xs opacity-90">{details}</div>}
        </div>
      }
      position="top"
      {...props}
    >
      <span className={`inline-flex items-center ${config.color} cursor-help`}>
        {config.icon}
      </span>
    </Tooltip>
  );
};

export default Tooltip;
