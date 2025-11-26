import { Profile, User } from '../types';

// Mock Initial Data
const initialProfiles: Profile[] = [
  { id: '1', name: 'Facebook Ads - Conta 01', platform: 'windows', browser: 'chrome', proxy: '192.168.1.10:8080', status: 'stopped', tags: ['Ads', 'FB'], createdAt: '2023-10-25' },
  { id: '2', name: 'Google Ads - Farm', platform: 'mac', browser: 'chrome', proxy: '192.168.1.12:8080', status: 'running', tags: ['Ads', 'Google'], createdAt: '2023-10-26' },
  { id: '3', name: 'TikTok Organic', platform: 'linux', browser: 'firefox', proxy: 'No Proxy', status: 'stopped', tags: ['Social'], createdAt: '2023-10-27' },
  { id: '4', name: 'Affiliate Marketing Main', platform: 'windows', browser: 'chrome', proxy: '201.55.0.1:3000', status: 'stopped', tags: ['Money'], createdAt: '2023-11-01' },
];

const initialUsers: User[] = [
  { id: '1', name: 'Admin Ninja', email: 'admin@ninjabr.com', role: 'admin', status: 'active', lastLogin: 'Agora' },
  { id: '2', name: 'João Silva', email: 'joao@equipe.com', role: 'user', status: 'active', lastLogin: '2 horas atrás' },
  { id: '3', name: 'Maria Souza', email: 'maria@equipe.com', role: 'user', status: 'blocked', lastLogin: '3 dias atrás' },
];

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockService = {
  getProfiles: async (): Promise<Profile[]> => {
    await delay(300);
    return [...initialProfiles];
  },
  
  getUsers: async (): Promise<User[]> => {
    await delay(300);
    return [...initialUsers];
  },

  createProfile: async (profileData: Omit<Profile, 'id' | 'createdAt' | 'status'>): Promise<Profile> => {
    await delay(500);
    const newProfile: Profile = {
      ...profileData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'stopped'
    };
    // In a real app we would push to initialProfiles, but for React state we return it
    return newProfile;
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