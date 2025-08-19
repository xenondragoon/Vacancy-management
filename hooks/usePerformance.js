"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

// Performance monitoring hook
export const usePerformance = (componentName = 'Component') => {
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    renderTime: 0,
    memoryUsage: null,
    interactionTime: 0
  });

  const renderStartTime = useRef(performance.now());
  const renderCount = useRef(0);
  const interactionStartTime = useRef(null);

  // Track render performance
  useEffect(() => {
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    
    renderCount.current += 1;
    
    setMetrics(prev => ({
      ...prev,
      renderCount: renderCount.current,
      renderTime
    }));

    // Update start time for next render
    renderStartTime.current = performance.now();
  });

  // Track memory usage (if available)
  useEffect(() => {
    if ('memory' in performance) {
      const memory = performance.memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100,
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024 * 100) / 100,
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024 * 100) / 100
        }
      }));
    }
  }, []);

  // Track user interactions
  const trackInteraction = useCallback((interactionType) => {
    if (interactionStartTime.current) {
      const interactionTime = performance.now() - interactionStartTime.current;
      setMetrics(prev => ({
        ...prev,
        interactionTime
      }));
    }
    interactionStartTime.current = performance.now();
  }, []);

  // Get performance summary
  const getPerformanceSummary = useCallback(() => {
    return {
      component: componentName,
      ...metrics,
      timestamp: new Date().toISOString()
    };
  }, [componentName, metrics]);

  // Log performance warnings
  useEffect(() => {
    if (metrics.renderTime > 16) { // 16ms = 60fps threshold
      console.warn(
        `[${componentName}] Slow render detected: ${metrics.renderTime.toFixed(2)}ms`
      );
    }
  }, [metrics.renderTime, componentName]);

  return {
    metrics,
    trackInteraction,
    getPerformanceSummary,
    componentName
  };
};

// Hook for measuring specific operations
export const useOperationTimer = (operationName = 'Operation') => {
  const [timings, setTimings] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const startTime = useRef(null);

  const startTimer = useCallback(() => {
    startTime.current = performance.now();
    setIsRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    if (startTime.current) {
      const duration = performance.now() - startTime.current;
      const timing = {
        id: Date.now(),
        operation: operationName,
        duration,
        timestamp: new Date().toISOString()
      };

      setTimings(prev => [...prev, timing]);
      setIsRunning(false);
      startTime.current = null;

      return duration;
    }
    return 0;
  }, [operationName]);

  const getAverageTime = useCallback(() => {
    if (timings.length === 0) return 0;
    const total = timings.reduce((sum, t) => sum + t.duration, 0);
    return total / timings.length;
  }, [timings]);

  const clearTimings = useCallback(() => {
    setTimings([]);
  }, []);

  return {
    timings,
    isRunning,
    startTimer,
    stopTimer,
    getAverageTime,
    clearTimings
  };
};

// Hook for monitoring network performance
export const useNetworkMonitor = () => {
  const [networkInfo, setNetworkInfo] = useState({
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
    saveData: false
  });

  const [connectionHistory, setConnectionHistory] = useState([]);

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      const updateNetworkInfo = () => {
        const info = {
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
          saveData: connection.saveData || false
        };

        setNetworkInfo(info);
        setConnectionHistory(prev => [...prev, { ...info, timestamp: Date.now() }]);
      };

      updateNetworkInfo();
      connection.addEventListener('change', updateNetworkInfo);

      return () => {
        connection.removeEventListener('change', updateNetworkInfo);
      };
    }
  }, []);

  const getNetworkQuality = useCallback(() => {
    const { effectiveType, downlink, rtt } = networkInfo;
    
    if (effectiveType === '4g' && downlink > 10 && rtt < 50) return 'excellent';
    if (effectiveType === '4g' && downlink > 5 && rtt < 100) return 'good';
    if (effectiveType === '3g' || (downlink > 1 && rtt < 200)) return 'fair';
    return 'poor';
  }, [networkInfo]);

  return {
    networkInfo,
    connectionHistory,
    getNetworkQuality
  };
};

// Hook for monitoring scroll performance
export const useScrollPerformance = (threshold = 16) => {
  const [scrollMetrics, setScrollMetrics] = useState({
    scrollCount: 0,
    averageScrollTime: 0,
    slowScrolls: 0
  });

  const scrollStartTime = useRef(null);
  const scrollTimes = useRef([]);

  const handleScroll = useCallback(() => {
    const now = performance.now();
    
    if (scrollStartTime.current) {
      const scrollTime = now - scrollStartTime.current;
      scrollTimes.current.push(scrollTime);
      
      // Keep only last 100 scroll times
      if (scrollTimes.current.length > 100) {
        scrollTimes.current.shift();
      }

      const averageTime = scrollTimes.current.reduce((sum, time) => sum + time, 0) / scrollTimes.current.length;
      const slowScrolls = scrollTimes.current.filter(time => time > threshold).length;

      setScrollMetrics({
        scrollCount: scrollTimes.current.length,
        averageScrollTime: averageTime,
        slowScrolls
      });
    }
    
    scrollStartTime.current = now;
  }, [threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return scrollMetrics;
};

// Hook for monitoring user interactions
export const useInteractionMonitor = () => {
  const [interactions, setInteractions] = useState({
    clicks: 0,
    keypresses: 0,
    mouseMoves: 0,
    lastInteraction: null
  });

  const [interactionTimings, setInteractionTimings] = useState([]);

  useEffect(() => {
    const trackInteraction = (type) => {
      const now = Date.now();
      
      setInteractions(prev => ({
        ...prev,
        [type]: prev[type] + 1,
        lastInteraction: now
      }));

      setInteractionTimings(prev => [...prev, { type, timestamp: now }]);
    };

    const handleClick = () => trackInteraction('clicks');
    const handleKeypress = () => trackInteraction('keypresses');
    const handleMouseMove = () => trackInteraction('mouseMoves');

    document.addEventListener('click', handleClick);
    document.addEventListener('keypress', handleKeypress);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keypress', handleKeypress);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const getInteractionRate = useCallback(() => {
    if (interactionTimings.length < 2) return 0;
    
    const timeSpan = interactionTimings[interactionTimings.length - 1].timestamp - interactionTimings[0].timestamp;
    const minutes = timeSpan / (1000 * 60);
    
    return Math.round(interactionTimings.length / minutes);
  }, [interactionTimings]);

  return {
    interactions,
    interactionTimings,
    getInteractionRate
  };
};

// Performance optimization utilities
export const useOptimization = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    // Check device capabilities
    const checkPerformance = () => {
      const connection = navigator.connection;
      const memory = performance.memory;
      
      let performanceScore = 0;
      
      // Network quality
      if (connection) {
        if (connection.effectiveType === '4g') performanceScore += 2;
        else if (connection.effectiveType === '3g') performanceScore += 1;
        if (connection.downlink > 10) performanceScore += 1;
      }
      
      // Memory availability
      if (memory) {
        if (memory.jsHeapSizeLimit > 2 * 1024 * 1024 * 1024) performanceScore += 2; // 2GB+
        else if (memory.jsHeapSizeLimit > 1 * 1024 * 1024 * 1024) performanceScore += 1; // 1GB+
      }
      
      // Device memory API
      if ('deviceMemory' in navigator) {
        if (navigator.deviceMemory > 4) performanceScore += 2;
        else if (navigator.deviceMemory > 2) performanceScore += 1;
      }
      
      setIsLowPerformance(performanceScore < 3);
    };

    checkPerformance();
    
    // Re-check when network changes
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', checkPerformance);
      return () => {
        navigator.connection.removeEventListener('change', checkPerformance);
      };
    }
  }, []);

  const getOptimizationSuggestions = useCallback(() => {
    if (isLowPerformance) {
      return [
        'Reduce animation complexity',
        'Use skeleton screens',
        'Implement virtual scrolling',
        'Optimize images and assets',
        'Enable aggressive caching'
      ];
    }
    return ['Performance is good - no optimizations needed'];
  }, [isLowPerformance]);

  return {
    isLowPerformance,
    getOptimizationSuggestions
  };
};

export default usePerformance;
