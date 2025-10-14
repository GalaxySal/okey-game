import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    loadTime: 0,
    renderTime: 0
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = Date.now();
    let animationId: number;

    // Safe access to performance APIs with fallbacks
    const getCurrentTime = () => {
      if (typeof globalThis !== 'undefined' && (globalThis as any).performance?.now) {
        try {
          return (globalThis as any).performance.now();
        } catch {
          return Date.now();
        }
      }
      return Date.now();
    };

    const requestAnimationFrameSafe = (callback: () => void) => {
      if (typeof globalThis !== 'undefined' && (globalThis as any).requestAnimationFrame) {
        try {
          return (globalThis as any).requestAnimationFrame(callback);
        } catch {
          return 0;
        }
      }
      // Fallback to setTimeout for React Native
      return setTimeout(callback, 16) as any;
    };

    const cancelAnimationFrameSafe = (id: number) => {
      if (typeof globalThis !== 'undefined' && (globalThis as any).cancelAnimationFrame) {
        try {
          (globalThis as any).cancelAnimationFrame(id);
        } catch {
          // Ignore errors
        }
      } else {
        // For setTimeout fallback
        clearTimeout(id);
      }
    };

    lastTime = getCurrentTime();

    const measureFPS = () => {
      frameCount++;
      const currentTime = getCurrentTime();

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setMetrics(prev => ({ ...prev, fps }));

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrameSafe(measureFPS);
    };

    animationId = requestAnimationFrameSafe(measureFPS);

    // Load time ölçümü
    const loadTime = getCurrentTime();
    setMetrics(prev => ({ ...prev, loadTime }));

    return () => {
      cancelAnimationFrameSafe(animationId);
    };
  }, []);

  return metrics;
};

export const PerformanceMonitor: React.FC = () => {
  const metrics = usePerformanceMonitor();

  // Sadece development modunda göster
  if (__DEV__ !== true) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>FPS: {metrics.fps}</Text>
      <Text style={styles.text}>Load: {metrics.loadTime.toFixed(0)}ms</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 8,
    borderRadius: 8,
    zIndex: 9999,
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
