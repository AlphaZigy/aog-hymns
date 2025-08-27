// Performance optimization utilities for the hymns app
import { useMemo, useCallback, useRef, useState, useEffect } from 'react';

// Debounce hook for search optimization
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook for limiting function calls
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
};

// Memoized search results
export const useMemoizedSearch = <T,>(
  items: T[],
  searchFunction: (items: T[], query: string) => T[],
  query: string
): T[] => {
  return useMemo(() => {
    if (!query.trim()) {
      return items;
    }
    return searchFunction(items, query);
  }, [items, searchFunction, query]);
};

// Cache for search results
class SearchCache {
  private cache = new Map<string, any>();
  private maxSize = 100;

  get(key: string): any {
    return this.cache.get(key);
  }

  set(key: string, value: any): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }
}

export const searchCache = new SearchCache();

// Performance monitoring
export const measurePerformance = <T extends (...args: any[]) => any>(
  fn: T,
  label: string
): T => {
  return ((...args: any[]) => {
    const start = Date.now();
    const result = fn(...args);
    const end = Date.now();
    console.log(`${label} took ${end - start} milliseconds`);
    return result;
  }) as T;
};
