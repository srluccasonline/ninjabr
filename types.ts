export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'blocked';
  lastLogin: string;
}

export interface Profile {
  id: string;
  name: string;
  platform: 'windows' | 'mac' | 'linux';
  browser: 'chrome' | 'firefox';
  proxy: string;
  status: 'running' | 'stopped';
  tags: string[];
  createdAt: string;
}

export type ViewState = 'dashboard' | 'profiles' | 'users';

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string;
    role: string;
  } | null;
}