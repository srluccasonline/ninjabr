
import { AppProfile, User, Proxy, Log } from '../types';

// Mock Initial Data
const initialApps: AppProfile[] = [
  { id: '1', name: 'Facebook Ads - Conta 01', os: 'windows', browser: 'chrome', proxyId: '1', status: 'stopped', tags: ['Ads', 'FB'], createdAt: '2023-10-25', blockedElements: [] },
  { id: '2', name: 'Google Ads - Farm', os: 'mac', browser: 'chrome', proxyId: '2', status: 'running', tags: ['Ads', 'Google'], createdAt: '2023-10-26', blockedElements: ['#logout-btn'] },
  { id: '3', name: 'TikTok Organic', os: 'android', browser: null, status: 'stopped', tags: ['Social', 'Mobile'], createdAt: '2023-10-27', blockedElements: ['.header-promo'] },
  { id: '4', name: 'Affiliate Marketing Main', os: 'windows', browser: 'chrome', status: 'stopped', tags: ['Money'], createdAt: '2023-11-01', blockedElements: [] },
];

let initialProxies: Proxy[] = [
  { id: '1', name: 'BR Residential 01', ip: '192.168.1.10', port: '8080', type: 'http', status: 'active', username: 'user1', lastCheck: '10 min atrás' },
  { id: '2', name: 'USA Datacenter', ip: '201.55.0.1', port: '3000', type: 'socks5', status: 'active', lastCheck: '1 hora atrás' },
];

const initialUsers: User[] = [
  { id: '1', name: 'Admin Ninja', email: 'admin@ninjabr.com', role: 'admin', status: 'active', lastLogin: 'Agora' },
  { id: '2', name: 'João Silva', email: 'joao@equipe.com', role: 'user', status: 'active', lastLogin: '2 horas atrás' },
  { id: '3', name: 'Maria Souza', email: 'maria@equipe.com', role: 'user', status: 'blocked', lastLogin: '3 dias atrás' },
];

const initialLogs: Log[] = [
  { id: '1', action: 'Login Realizado', user: 'Admin Ninja', details: 'Acesso via IP 192.168.0.1', timestamp: 'Agora', type: 'success' },
  { id: '2', action: 'App Iniciado', user: 'João Silva', details: 'Iniciou "Google Ads - Farm"', timestamp: '10 min atrás', type: 'info' },
  { id: '3', action: 'Erro Proxy', user: 'Sistema', details: 'Falha conexão Proxy USA Datacenter', timestamp: '1 hora atrás', type: 'error' },
  { id: '4', action: 'Novo App Criado', user: 'Admin Ninja', details: 'App "TikTok Organic" criado', timestamp: '2 horas atrás', type: 'success' },
  { id: '5', action: 'Tentativa Login', user: 'Desconhecido', details: 'Senha incorreta para admin', timestamp: '5 horas atrás', type: 'warning' },
];

let currentApiKey = "nk_live_8f9a2b3c4d5e6f7g8h9i0j1k2l3m4n5o";

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockService = {
  getApps: async (): Promise<AppProfile[]> => {
    await delay(300);
    return [...initialApps];
  },
  
  getProxies: async (): Promise<Proxy[]> => {
    await delay(300);
    return [...initialProxies];
  },

  getUsers: async (): Promise<User[]> => {
    await delay(300);
    return [...initialUsers];
  },

  getLogs: async (): Promise<Log[]> => {
    await delay(400);
    return [...initialLogs];
  },

  getApiKey: async (): Promise<string> => {
    await delay(200);
    return currentApiKey;
  },

  regenerateApiKey: async (): Promise<string> => {
    await delay(800);
    currentApiKey = "nk_live_" + Array.from({length: 32}, () => Math.floor(Math.random() * 36).toString(36)).join('');
    return currentApiKey;
  },

  createApp: async (appData: Omit<AppProfile, 'id' | 'createdAt' | 'status'>): Promise<AppProfile> => {
    await delay(500);
    const newApp: AppProfile = {
      ...appData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'stopped'
    };
    return newApp;
  },

  createProxy: async (proxyData: Omit<Proxy, 'id' | 'status'>): Promise<Proxy> => {
    await delay(400);
    // Basic validation mock
    const exists = initialProxies.find(p => p.name.toLowerCase() === proxyData.name.toLowerCase());
    if (exists) throw new Error("Já existe um proxy com este nome.");

    const newProxy: Proxy = {
      ...proxyData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'active',
      lastCheck: 'Agora'
    };
    initialProxies.push(newProxy);
    return newProxy;
  },

  updateProxy: async (id: string, proxyData: Partial<Proxy>): Promise<Proxy> => {
    await delay(400);
    const index = initialProxies.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Proxy não encontrado");
    
    initialProxies[index] = { ...initialProxies[index], ...proxyData };
    return initialProxies[index];
  },

  deleteProxy: async (id: string): Promise<void> => {
    await delay(200);
    initialProxies = initialProxies.filter(p => p.id !== id);
  },

  testProxy: async (id: string): Promise<'active' | 'error'> => {
    await delay(1500); // Simulate network check
    // Random success/fail
    return Math.random() > 0.2 ? 'active' : 'error';
  },

  createUser: async (userData: Omit<User, 'id' | 'lastLogin'>): Promise<User> => {
    await delay(500);
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      lastLogin: 'Nunca'
    };
    return newUser;
  }
};
