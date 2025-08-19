"use client";

import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from "react";

// Toast Context
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => 
      prev.map(t => t.id === id ? { ...t, visible: false } : t)
    );
    // Remove from DOM after exit animation
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = { ...toast, id, visible: false };
    
    setToasts(prev => [...prev, newToast]);
    
    // Trigger entrance animation
    setTimeout(() => {
      setToasts(prev => 
        prev.map(t => t.id === id ? { ...t, visible: true } : t)
      );
    }, 100);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  }, [removeToast]);

  const success = useCallback((message, options = {}) => {
    addToast({ type: 'success', message, ...options });
  }, [addToast]);

  const error = useCallback((message, options = {}) => {
    addToast({ type: 'error', message, ...options });
  }, [addToast]);

  const warning = useCallback((message, options = {}) => {
    addToast({ type: 'warning', message, ...options });
  }, [addToast]);

  const info = useCallback((message, options = {}) => {
    addToast({ type: 'info', message, ...options });
  }, [addToast]);

  const contextValue = useMemo(() => ({ addToast, success, error, warning, info, removeToast }), [addToast, success, error, warning, info, removeToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

// Individual Toast
const Toast = ({ toast, onRemove }) => {
  const { type, message, title, duration, action, id } = toast;

  const typeStyles = {
    success: {
      icon: "✅",
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-800 dark:text-green-200",
      title: "text-green-900 dark:text-green-100"
    },
    error: {
      icon: "❌",
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-200",
      title: "text-red-900 dark:text-red-100"
    },
    warning: {
      icon: "⚠️",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      text: "text-yellow-800 dark:text-yellow-200",
      title: "text-yellow-900 dark:text-yellow-100"
    },
    info: {
      icon: "ℹ️",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-800 dark:text-blue-200",
      title: "text-blue-900 dark:text-blue-100"
    }
  };

  const styles = typeStyles[type] || typeStyles.info;

  return (
    <div
      className={`
        pointer-events-auto max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border ${styles.border} ${styles.bg}
        transform transition-all duration-300 ease-out
        ${toast.visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-lg">{styles.icon}</span>
          </div>
          
          <div className="ml-3 flex-1">
            {title && (
              <p className={`text-sm font-medium ${styles.title}`}>
                {title}
              </p>
            )}
            <p className={`text-sm ${styles.text}`}>
              {message}
            </p>
            
            {action && (
              <div className="mt-3">
                <button
                  onClick={() => {
                    action.onClick();
                    onRemove(id);
                  }}
                  className={`text-sm font-medium ${styles.text} hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-50 dark:focus:ring-offset-gray-800`}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
          
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => onRemove(id)}
              className={`${styles.text} hover:${styles.text} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-50 dark:focus:ring-offset-gray-800`}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      {duration && (
        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
          <div 
            className={`h-full ${styles.bg.replace('bg-', 'bg-').replace('/20', '')} transition-all duration-${duration} ease-linear`}
            style={{ width: toast.visible ? '0%' : '100%' }}
          />
        </div>
      )}
    </div>
  );
};

// Hook for easy toast usage
export const useToastNotifications = () => {
  const toast = useToast();
  
  return useMemo(() => ({
    showSuccess: (message, options = {}) => toast.addToast({
      type: 'success',
      message,
      title: options.title,
      duration: options.duration || 5000,
      action: options.action
    }),
    showError: (message, options = {}) => toast.addToast({
      type: 'error',
      message,
      title: options.title,
      duration: options.duration || 7000,
      action: options.action
    }),
    showWarning: (message, options = {}) => toast.addToast({
      type: 'warning',
      message,
      title: options.title,
      duration: options.duration || 6000,
      action: options.action
    }),
    showInfo: (message, options = {}) => toast.addToast({
      type: 'info',
      message,
      title: options.title,
      duration: options.duration || 4000,
      action: options.action
    }),
    showToast: (toastData) => toast.addToast(toastData)
  }), [toast]);
};

export default Toast;
