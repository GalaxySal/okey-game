import React from 'react';

interface ErrorBoundaryErrorInfo {
  componentStack?: string | null;
}

interface GlobalErrorEvent extends ErrorEvent {
  filename: string;
  lineno: number;
  colno: number;
}

interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string | null;
  errorBoundary?: string;
  timestamp: number;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId: string;
  platform: string;
  version: string;
}

export class ErrorTrackingService {
  private static readonly API_BASE = process.env.REACT_APP_API_URL || 'https://api.okey-game.com';
  private static sessionId = this.generateSessionId();
  private static userId?: string;

  // Session ID oluşturma
  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Kullanıcı ID set etme
  static setUserId(userId: string) {
    this.userId = userId;
  }

  // Error bilgilerini API'ye gönder
  static async reportError(error: Error, errorInfo?: ErrorBoundaryErrorInfo): Promise<void> {
    try {
      const errorData: ErrorInfo = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo?.componentStack,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: this.userId,
        sessionId: this.sessionId,
        platform: this.detectPlatform(),
        version: process.env.REACT_APP_VERSION || '1.0.0',
      };

      await fetch(`${this.API_BASE}/api/errors/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      });
    } catch (reportError) {
      console.error('Error reporting failed:', reportError);
    }
  }

  // Platform tespiti
  private static detectPlatform(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('electron')) return 'desktop';
    if (userAgent.includes('mobile') || userAgent.includes('android') || userAgent.includes('iphone')) return 'mobile';
    return 'web';
  }

  // Global error handler
  static setupGlobalErrorHandler(): void {
    // JavaScript hataları için
    window.addEventListener('error', (event: GlobalErrorEvent) => {
      this.reportError(new Error(event.message), {
        componentStack: `Error in ${event.filename}:${event.lineno}:${event.colno}`,
      });
    });

    // Promise rejection'ları için
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      this.reportError(new Error(`Unhandled promise rejection: ${event.reason}`));
    });
  }

  // React Error Boundary için
  static logReactError(error: Error, errorInfo: React.ErrorInfo): void {
    this.reportError(error, { componentStack: errorInfo.componentStack });
  }

  // Manuel error reporting
  static async logCustomError(message: string, level: 'info' | 'warning' | 'error' = 'error', context?: Record<string, unknown>): Promise<void> {
    try {
      await fetch(`${this.API_BASE}/api/errors/custom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          level,
          context,
          timestamp: Date.now(),
          userId: this.userId,
          sessionId: this.sessionId,
          platform: this.detectPlatform(),
          url: window.location.href,
        }),
      });
    } catch (reportError) {
      console.error('Custom error logging failed:', reportError);
    }
  }

  // Performance monitoring
  static async reportPerformanceMetrics(metrics: {
    loadTime: number;
    domContentLoaded: number;
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
  }): Promise<void> {
    try {
      await fetch(`${this.API_BASE}/api/performance/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...metrics,
          sessionId: this.sessionId,
          userId: this.userId,
          timestamp: Date.now(),
        }),
      });
    } catch (error) {
      console.error('Performance reporting failed:', error);
    }
  }
}

// React Error Boundary Component
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean; error: Error } {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    ErrorTrackingService.logReactError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">Bir Hata Oluştu</h2>
            <p className="text-gray-300 mb-6">
              Uygulamada beklenmedik bir hata oluştu. Lütfen sayfayı yenileyin.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
            >
              Sayfayı Yenile
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorTrackingService;
