'use client';

import { User, Session, AuthResponse } from './types';
import { authAPI } from './api';

const CURRENT_SESSION_KEY = 'finance_tracker_current_session';

// Register a new user
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Auth not available on server' };
  }

  try {
    const response = await authAPI.register(name, email, password);

    const user: User = {
      id: response.user.id.toString(),
      username: response.user.name,
      email: response.user.email,
      createdAt: response.user.createdAt,
    };

    const session: Session = {
      userId: user.id,
      username: user.username,
      token: response.token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));

    return {
      success: true,
      message: 'Registration successful',
      user,
      session,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Registration failed',
    };
  }
};

// Login user
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Auth not available on server' };
  }

  try {
    const response = await authAPI.login(email, password);

    const user: User = {
      id: response.user.id.toString(),
      username: response.user.name,
      email: response.user.email,
      createdAt: response.user.createdAt,
    };

    const session: Session = {
      userId: user.id,
      username: user.username,
      token: response.token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));

    return {
      success: true,
      message: 'Login successful',
      user,
      session,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Login failed',
    };
  }
};

// Get current session
export const getCurrentSession = (): Session | null => {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(CURRENT_SESSION_KEY);
  if (!stored) return null;

  try {
    const session = JSON.parse(stored) as Session;
    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      logout();
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

// Set current session (for testing)
export const setCurrentSession = (session: Session): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
};

// Clear current session (alias for logout)
export const clearCurrentSession = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CURRENT_SESSION_KEY);
};

// Logout
export const logout = (): void => {
  clearCurrentSession();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentSession() !== null;
};
