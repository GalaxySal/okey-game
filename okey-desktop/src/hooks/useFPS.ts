import { useState, useEffect, useRef } from 'react';

/**
 * FPS (Frames Per Second) hesaplayan custom hook
 * requestAnimationFrame kullanarak gerçek zamanlı FPS ölçümü yapar
 */
export const useFPS = () => {
  const [fps, setFps] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const rafIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const measureFPS = () => {
      frameCountRef.current++;

      const currentTime = Date.now();
      const elapsed = currentTime - lastTimeRef.current;

      // Her saniye FPS'i güncelle
      if (elapsed >= 1000) {
        const currentFPS = Math.round((frameCountRef.current * 1000) / elapsed);
        setFps(currentFPS);
        
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
      }

      rafIdRef.current = requestAnimationFrame(measureFPS);
    };

    rafIdRef.current = requestAnimationFrame(measureFPS);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return fps;
};
