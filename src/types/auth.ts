/**
 * Authentication-related types
 */

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'VIP' | 'SUPERADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}
