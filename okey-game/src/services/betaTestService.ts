import React, { useState, useEffect } from 'react';

interface BetaTester {
  id: string;
  email: string;
  joinDate: Date;
  status: 'active' | 'inactive';
  feedbackCount: number;
  lastActivity: Date;
}

interface BetaFeedback {
  id: string;
  testerId: string;
  type: 'bug' | 'feature' | 'improvement' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  platform: 'web' | 'desktop' | 'mobile';
  version: string;
}

export class BetaTestService {
  private static readonly API_BASE = process.env.REACT_APP_API_URL || 'https://api.okey-game.com';

  // Beta tester kayıt
  static async registerBetaTester(email: string, platform: string): Promise<BetaTester> {
    try {
      const response = await fetch(`${this.API_BASE}/api/beta/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, platform }),
      });

      if (!response.ok) throw new Error('Registration failed');
      return await response.json();
    } catch (error) {
      console.error('Beta registration error:', error);
      throw error;
    }
  }

  // Beta feedback gönder
  static async submitFeedback(feedback: Omit<BetaFeedback, 'id' | 'createdAt' | 'updatedAt'>): Promise<BetaFeedback> {
    try {
      const response = await fetch(`${this.API_BASE}/api/beta/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) throw new Error('Feedback submission failed');
      return await response.json();
    } catch (error) {
      console.error('Feedback submission error:', error);
      throw error;
    }
  }

  // Beta feedback'leri al
  static async getFeedback(filters?: {
    status?: string;
    platform?: string;
    type?: string;
  }): Promise<BetaFeedback[]> {
    try {
      const queryParams = new URLSearchParams(filters as any).toString();
      const response = await fetch(`${this.API_BASE}/api/beta/feedback?${queryParams}`);

      if (!response.ok) throw new Error('Failed to fetch feedback');
      return await response.json();
    } catch (error) {
      console.error('Feedback fetch error:', error);
      return [];
    }
  }

  // Beta sürüm bilgilerini al
  static async getBetaVersion(): Promise<{
    version: string;
    releaseDate: Date;
    changelog: string[];
    knownIssues: string[];
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/api/beta/version`);
      if (!response.ok) throw new Error('Failed to fetch beta version');
      return await response.json();
    } catch (error) {
      console.error('Beta version fetch error:', error);
      return {
        version: '1.0.0-beta.1',
        releaseDate: new Date(),
        changelog: ['Initial beta release'],
        knownIssues: ['Some features may be unstable'],
      };
    }
  }
}

export default BetaTestService;
