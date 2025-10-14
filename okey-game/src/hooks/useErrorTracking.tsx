import { useEffect } from 'react';
import { ErrorTrackingService } from '../services/errorTrackingService';

// Hook for error tracking
export const useErrorTracking = () => {
  useEffect(() => {
    ErrorTrackingService.setupGlobalErrorHandler();
  }, []);

  const logError = (error: Error) => {
    ErrorTrackingService.reportError(error);
  };

  const logCustomError = (message: string, level?: 'info' | 'warning' | 'error', context?: Record<string, unknown>) => {
    ErrorTrackingService.logCustomError(message, level, context);
  };

  return { logError, logCustomError };
};
