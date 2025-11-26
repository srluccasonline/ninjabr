
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'blocked';
  lastLogin: string;
}

export interface Proxy {
  id: string;
  name: string; // Unique
  ip: string;
  port: string;
  type: 'http' | 'https' | 'socks4' | 'socks5';
  username?: string;
  password?: string;
  https?: boolean; // Support HTTPS protocol check
  status: 'active' | 'error' | 'testing';
  lastCheck?: string;
}

export interface AppProfile {
  id: string;
  name: string;
  os: 'windows' | 'mac' | 'linux' | 'android' | 'ios';
  browser: 'chrome' | 'firefox' | 'safari' | null;
  proxyId?: string; // Link to a proxy
  blockedElements: string[]; // List of CSS selectors or IDs
  status: 'running' | 'stopped';
  tags: string[];
  createdAt: string;
}

export interface Log {
  id: string;
  action: string;
  user: string;
  details: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export type ViewState = 'dashboard' | 'apps' | 'proxies' | 'users' | 'api' | 'logs';

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string;
    role: string;
  } | null;
}
