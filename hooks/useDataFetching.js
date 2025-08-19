"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

// Cache for storing fetched data
const cache = new Map();
const cacheTimeout = 5 * 60 * 1000; // 5 minutes

export const useDataFetching = (key, fetcher, options = {}) => {
  const {
    initialData = null,
    refreshInterval = null,
    cacheTime = cacheTimeout,
    immediate = true,
    onSuccess = null,
    onError = null,
    retryCount = 3,
    retryDelay = 1000
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const abortControllerRef = useRef(null);
  const refreshIntervalRef = useRef(null);
  const retryCountRef = useRef(0);

  // Check cache for existing data
  const getCachedData = useCallback((cacheKey) => {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      return cached.data;
    }
    return null;
  }, [cacheTime]);

  // Set cache data
  const setCachedData = useCallback((cacheKey, data) => {
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }, []);

  // Fetch data with retry logic
  const fetchData = useCallback(async (isRefresh = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    try {
      if (!isRefresh) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      
      setError(null);
      
      const result = await fetcher(abortControllerRef.current.signal);
      
      setData(result);
      setCachedData(key, result);
      retryCountRef.current = 0;
      
      if (onSuccess) {
        onSuccess(result);
      }
      
    } catch (err) {
      if (err.name === 'AbortError') {
        return; // Request was cancelled
      }
      
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      // Retry logic
      if (retryCountRef.current < retryCount) {
        retryCountRef.current++;
        setTimeout(() => {
          fetchData(isRefresh);
        }, retryDelay * retryCountRef.current);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [key, fetcher, onSuccess, onError, retryCount, retryDelay, setCachedData]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  // Clear cache for this key
  const clearCache = useCallback(() => {
    cache.delete(key);
  }, [key]);

  // Clear all cache
  const clearAllCache = useCallback(() => {
    cache.clear();
  }, []);

  // Initialize data fetching
  useEffect(() => {
    if (immediate) {
      // Check cache first
      const cachedData = getCachedData(key);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
      } else {
        fetchData();
      }
    }
  }, [immediate, key, getCachedData, fetchData]);

  // Set up refresh interval
  useEffect(() => {
    if (refreshInterval) {
      refreshIntervalRef.current = setInterval(() => {
        fetchData(true);
      }, refreshInterval);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [refreshInterval, fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    isRefreshing,
    refresh,
    clearCache,
    clearAllCache,
    // Utility functions
    hasData: data !== null && data !== undefined,
    isEmpty: Array.isArray(data) ? data.length === 0 : !data,
    isLoading: loading || isRefreshing
  };
};

// Hook for paginated data
export const usePaginatedData = (key, fetcher, options = {}) => {
  const {
    pageSize = 10,
    initialPage = 1,
    ...fetchOptions
  } = options;

  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [allData, setAllData] = useState([]);

  const { data, loading, error, refresh, ...rest } = useDataFetching(
    `${key}_page_${page}`,
    () => fetcher(page, pageSize),
    fetchOptions
  );

  // Update pagination state when data changes
  useEffect(() => {
    if (data) {
      if (Array.isArray(data)) {
        if (data.length < pageSize) {
          setHasMore(false);
        }
        
        if (page === 1) {
          setAllData(data);
        } else {
          setAllData(prev => [...prev, ...data]);
        }
      }
    }
  }, [data, page, pageSize]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  const resetPagination = useCallback(() => {
    setPage(initialPage);
    setHasMore(true);
    setAllData([]);
  }, [initialPage]);

  return {
    ...rest,
    data: allData,
    currentPage: page,
    hasMore,
    loadMore,
    resetPagination,
    setPage,
    pageSize
  };
};

// Hook for search with debouncing
export const useSearch = (key, fetcher, options = {}) => {
  const {
    debounceMs = 300,
    minQueryLength = 2,
    ...fetchOptions
  } = options;

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const { data, loading, error, ...rest } = useDataFetching(
    `${key}_search_${debouncedQuery}`,
    () => {
      if (debouncedQuery.length >= minQueryLength) {
        return fetcher(debouncedQuery);
      }
      return Promise.resolve(null);
    },
    {
      ...fetchOptions,
      immediate: false
    }
  );

  // Update search history
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length >= minQueryLength) {
      setSearchHistory(prev => {
        const filtered = prev.filter(q => q !== debouncedQuery);
        return [debouncedQuery, ...filtered].slice(0, 10);
      });
    }
  }, [debouncedQuery, minQueryLength]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  const searchFromHistory = useCallback((query) => {
    setQuery(query);
  }, []);

  return {
    ...rest,
    query,
    setQuery,
    debouncedQuery,
    searchHistory,
    clearSearch,
    searchFromHistory,
    canSearch: debouncedQuery.length >= minQueryLength,
    data: debouncedQuery.length >= minQueryLength ? data : null
  };
};

// Hook for infinite scroll
export const useInfiniteScroll = (key, fetcher, options = {}) => {
  const {
    threshold = 100,
    rootMargin = '0px',
    ...fetchOptions
  } = options;

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allData, setAllData] = useState([]);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const { data, loading, error, refresh, ...rest } = useDataFetching(
    `${key}_infinite_${page}`,
    () => fetcher(page),
    fetchOptions
  );

  // Update data when new page loads
  useEffect(() => {
    if (data) {
      if (Array.isArray(data)) {
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setAllData(prev => [...prev, ...data]);
        }
      }
    }
  }, [data]);

  // Load more when intersection is detected
  useEffect(() => {
    if (isIntersecting && !loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isIntersecting, loading, hasMore]);

  const resetInfiniteScroll = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setAllData([]);
  }, []);

  return {
    ...rest,
    data: allData,
    currentPage: page,
    hasMore,
    resetInfiniteScroll,
    setPage,
    isIntersecting,
    setIsIntersecting
  };
};

export default useDataFetching;
