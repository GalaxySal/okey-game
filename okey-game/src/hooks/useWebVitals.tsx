import React, { useEffect, useState } from 'react';

// Web Vitals monitoring for performance tracking
export const useWebVitals = () => {
  const [metrics, setMetrics] = useState({
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    cls: 0, // Cumulative Layout Shift
    fid: 0, // First Input Delay
    ttfb: 0, // Time to First Byte
  });

  useEffect(() => {
    // Web Vitals polyfill için basit implementasyon
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
        }
        if (entry.entryType === 'first-input') {
          setMetrics(prev => ({ ...prev, fid: (entry as any).processingStart - entry.startTime }));
        }
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          setMetrics(prev => ({ ...prev, cls: prev.cls + (entry as any).value }));
        }
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

    // Navigation timing
    if (window.performance.timing) {
      const timing = window.performance.timing;
      const ttfb = timing.responseStart - timing.requestStart;
      setMetrics(prev => ({ ...prev, ttfb }));
    }

    return () => observer.disconnect();
  }, []);

  return metrics;
};

// Bundle analyzer hook
export const useBundleAnalyzer = () => {
  const [bundleInfo, setBundleInfo] = useState({
    totalSize: 0,
    chunkCount: 0,
    largestChunk: '',
    loadTime: 0,
  });

  useEffect(() => {
    if (window.performance.getEntriesByType) {
      const resources = window.performance.getEntriesByType('resource');
      let totalSize = 0;
      let largestChunk = '';
      let maxSize = 0;

      resources.forEach((resource: any) => {
        if (resource.name.includes('.js') || resource.name.includes('.css')) {
          totalSize += resource.transferSize || 0;
          if ((resource.transferSize || 0) > maxSize) {
            maxSize = resource.transferSize || 0;
            largestChunk = resource.name;
          }
        }
      });

      setBundleInfo({
        totalSize,
        chunkCount: resources.filter((r: any) => r.name.includes('.js')).length,
        largestChunk,
        loadTime: window.performance.timing?.loadEventEnd - window.performance.timing?.navigationStart || 0,
      });
    }
  }, []);

  return bundleInfo;
};
