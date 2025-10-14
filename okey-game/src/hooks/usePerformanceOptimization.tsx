import { useCallback, useMemo, useRef, useEffect } from 'react';

// Tile cache for performance
const tileCache = new Map<string, any>();

export const useTileCache = (tileId: string, tileData: any) => {
  return useMemo(() => {
    if (tileCache.has(tileId)) {
      return tileCache.get(tileId);
    }

    tileCache.set(tileId, tileData);

    // Cache'i belirli boyutta tutmak için cleanup
    if (tileCache.size > 1000) {
      const firstKey = tileCache.keys().next().value;
      tileCache.delete(firstKey);
    }

    return tileData;
  }, [tileId, tileData]);
};

// Memory management hook
export const useMemoryManagement = () => {
  const cleanupRef = useRef<(() => void)[]>([]);

  const addCleanup = useCallback((cleanupFn: () => void) => {
    cleanupRef.current.push(cleanupFn);
  }, []);

  useEffect(() => {
    return () => {
      // Component unmount olduğunda tüm cleanup fonksiyonlarını çalıştır
      cleanupRef.current.forEach(cleanup => cleanup());
      cleanupRef.current = [];
    };
  }, []);

  return { addCleanup };
};

// Debounced value hook for performance
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

// Performance monitoring hook with memory tracking
export const useAdvancedPerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memoryUsage: 0,
    loadTime: 0,
    renderTime: 0,
    cacheHitRate: 0,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const cacheHitsRef = useRef(0);
  const cacheMissesRef = useRef(0);

  useEffect(() => {
    let animationId: number;

    const measurePerformance = () => {
      frameCountRef.current++;
      const currentTime = performance.now();

      if (currentTime - lastTimeRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current));
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;

        // Memory usage
        const memoryUsage = (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0;

        // Cache hit rate
        const totalRequests = cacheHitsRef.current + cacheMissesRef.current;
        const cacheHitRate = totalRequests > 0 ? (cacheHitsRef.current / totalRequests) * 100 : 0;

        setMetrics(prev => ({
          ...prev,
          fps,
          memoryUsage: Math.round(memoryUsage),
          cacheHitRate: Math.round(cacheHitRate),
        }));
      }

      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    // Load time
    setMetrics(prev => ({ ...prev, loadTime: performance.now() }));

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const recordCacheHit = useCallback(() => {
    cacheHitsRef.current++;
  }, []);

  const recordCacheMiss = useCallback(() => {
    cacheMissesRef.current++;
  }, []);

  return { metrics, recordCacheHit, recordCacheMiss };
};
