import React from 'react';
import { Shield, LayoutDashboard, Layers, Users, LogOut, Menu, X } from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => {
        onNavigate(view);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        currentView === view 
          ? 'bg-ninja-500 text-white shadow-lg shadow-ninja-500/20' 
          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-dark-950 flex text-gray-100 font-sans">
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-dark-900 border-b border-gray-800 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2 text-white font-bold">
           <Shield className="text-ninja-500" /> NinjaBR
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-300">
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Backdrop (Mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 w-64 bg-dark-900 border-r border-gray-800 z-40 transform transition-transform duration-300 lg:transform-none flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-20 flex items-center px-6 border-b border-gray-800">
          <div className="h-8 w-8 bg-ninja-500 rounded-lg flex items-center justify-center text-white mr-3">
            <Shield size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">NinjaBR</span>
        </div>

        <div className="flex-1 py-6 px-3 space-y-2">
          <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem view="profiles" icon={Layers} label="Perfis (Apps)" />
          <NavItem view="users" icon={Users} label="Usuários" />
        </div>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pt-20 lg:pt-8 scroll-smooth">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};