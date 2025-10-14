import React, { Suspense, lazy } from 'react';

// Lazy load edilen component'ler
export const LazyThreeDGameBoard = lazy(() => import('./ThreeDGameBoard'));
export const LazyPremiumSettings = lazy(() => import('./PremiumSettings'));

// Loading fallback component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
  </div>
);

// Lazy loaded component wrapper
export const LazyComponent: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = <LoadingSpinner /> }) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);
