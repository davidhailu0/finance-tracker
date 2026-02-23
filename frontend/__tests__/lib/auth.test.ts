import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCurrentSession, setCurrentSession, clearCurrentSession, isAuthenticated } from '@/lib/auth';

describe('Auth Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('setCurrentSession', () => {
    it('should store session in localStorage', () => {
      const session = {
        userId: '1',
        username: 'John',
        token: 'test-token',
        expiresAt: '2024-12-31T23:59:59Z',
      };

      setCurrentSession(session);

      const stored = localStorage.getItem('finance_tracker_current_session');
      expect(stored).toBeDefined();
      expect(JSON.parse(stored!)).toEqual(session);
    });
  });

  describe('getCurrentSession', () => {
    it('should retrieve session from localStorage', () => {
      const session = {
        userId: '1',
        username: 'John',
        token: 'test-token',
        expiresAt: '2024-12-31T23:59:59Z',
      };

      localStorage.setItem('finance_tracker_current_session', JSON.stringify(session));

      const retrieved = getCurrentSession();
      expect(retrieved).toEqual(session);
    });

    it('should return null if no session exists', () => {
      const retrieved = getCurrentSession();
      expect(retrieved).toBeNull();
    });

    it('should return null if session is invalid JSON', () => {
      localStorage.setItem('finance_tracker_current_session', 'invalid-json');

      const retrieved = getCurrentSession();
      expect(retrieved).toBeNull();
    });
  });

  describe('clearCurrentSession', () => {
    it('should remove session from localStorage', () => {
      const session = {
        userId: '1',
        username: 'John',
        token: 'test-token',
        expiresAt: '2024-12-31T23:59:59Z',
      };

      localStorage.setItem('finance_tracker_current_session', JSON.stringify(session));
      clearCurrentSession();

      const stored = localStorage.getItem('finance_tracker_current_session');
      expect(stored).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if valid session exists', () => {
      const session = {
        userId: '1',
        username: 'John',
        token: 'test-token',
        expiresAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      };

      localStorage.setItem('finance_tracker_current_session', JSON.stringify(session));

      expect(isAuthenticated()).toBe(true);
    });

    it('should return false if no session exists', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('should return false if session is expired', () => {
      const session = {
        userId: '1',
        username: 'John',
        token: 'test-token',
        expiresAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      };

      localStorage.setItem('finance_tracker_current_session', JSON.stringify(session));

      expect(isAuthenticated()).toBe(false);
    });

    it('should return false if session has no token', () => {
      const session = {
        userId: '1',
        username: 'John',
        token: '',
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
      };

      localStorage.setItem('finance_tracker_current_session', JSON.stringify(session));

      expect(isAuthenticated()).toBe(false);
    });
  });
});
