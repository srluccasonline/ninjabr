
import React, { useState, useEffect } from 'react';
import { AuthState, ViewState, AppProfile, User, Proxy } from './types';
import { mockService } from './services/mockService';
import { Login } from './views/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { Profiles } from './views/Profiles'; // Actually the "Apps" view now
import { Users } from './views/Users';
import { Proxies } from './views/Proxies';
import { API } from './views/API';
import { Logs } from './views/Logs';

const App = () => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [apps, setApps] = useState<AppProfile[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Load mock data on auth
  useEffect(() => {
    if (auth.isAuthenticated) {
      setIsLoadingData(true);
      Promise.all([
        mockService.getApps(), 
        mockService.getUsers(),
        mockService.getProxies()
      ])
        .then(([p, u, px]) => {
          setApps(p);
          setUsers(u);
          setProxies(px);
        })
        .finally(() => setIsLoadingData(false));
    }
  }, [auth.isAuthenticated]);

  const handleLogin = (success: boolean) => {
    if (success) {
      setAuth({
        isAuthenticated: true,
        user: { username: 'admin', role: 'admin' }
      });
    }
  };

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, user: null });
    setCurrentView('dashboard');
    setApps([]);
    setUsers([]);
    setProxies([]);
  };

  if (!auth.isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    if (isLoadingData) {
      return (
        <div className="flex h-[50vh] items-center justify-center text-ninja-500">
           <svg className="animate-spin h-10 w-10" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard apps={apps} users={users} proxies={proxies} />;
      case 'apps': // Replaces 'profiles'
        return <Profiles apps={apps} proxies={proxies} setApps={setApps} />;
      case 'proxies':
        return <Proxies proxies={proxies} setProxies={setProxies} />;
      case 'users':
        return <Users users={users} setUsers={setUsers} />;
      case 'api':
        return <API />;
      case 'logs':
        return <Logs />;
      default:
        return <Dashboard apps={apps} users={users} proxies={proxies} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={setCurrentView} 
      onLogout={handleLogout}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
