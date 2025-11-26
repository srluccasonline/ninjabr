import React, { useState, useEffect } from 'react';
import { AuthState, ViewState, Profile, User } from './types';
import { mockService } from './services/mockService';
import { Login } from './views/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { Profiles } from './views/Profiles';
import { Users } from './views/Users';

const App = () => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Load mock data on auth
  useEffect(() => {
    if (auth.isAuthenticated) {
      setIsLoadingData(true);
      Promise.all([mockService.getProfiles(), mockService.getUsers()])
        .then(([p, u]) => {
          setProfiles(p);
          setUsers(u);
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
    setProfiles([]);
    setUsers([]);
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
        return <Dashboard profiles={profiles} users={users} />;
      case 'profiles':
        return <Profiles profiles={profiles} setProfiles={setProfiles} />;
      case 'users':
        return <Users users={users} setUsers={setUsers} />;
      default:
        return <Dashboard profiles={profiles} users={users} />;
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