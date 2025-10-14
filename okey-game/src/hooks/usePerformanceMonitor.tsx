import React, { useEffect, useState } from 'react';

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
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setMetrics(prev => ({ ...prev, fps }));

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    // Load time ölçümü
    const loadTime = performance.now();
    setMetrics(prev => ({ ...prev, loadTime }));

    // Memory usage (Chrome Performance API)
    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = performance as Performance & { memory: { usedJSHeapSize: number } };
        const memoryUsage = Math.round(memory.memory.usedJSHeapSize / 1024 / 1024); // MB
        setMetrics(prev => ({ ...prev, memoryUsage }));
      }
    };

    measureMemory();
    const memoryInterval = setInterval(measureMemory, 5000); // 5 saniyede bir

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(memoryInterval);
    };
  }, []);

  return metrics;
};

export const PerformanceMonitor: React.FC = () => {
  const metrics = usePerformanceMonitor();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded font-mono">
      <div>FPS: {metrics.fps}</div>
      <div>Memory: {metrics.memoryUsage}MB</div>
      <div>Load: {metrics.loadTime.toFixed(0)}ms</div>
    </div>
  );
};
