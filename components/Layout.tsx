
import React from 'react';
import { Shield, LayoutDashboard, Layers, Users, LogOut, Menu, X, Network, Code, FileText } from 'lucide-react';
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
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-dark-900 border-b border-gray-800 flex items-center justify-between px-4 z-40 shadow-md">
        <div className="flex items-center gap-2">
           <div className="h-8 w-8 bg-gradient-to-br from-ninja-500 to-ninja-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-ninja-500/20">
              <Shield size={18} fill="currentColor" />
           </div>
           <span className="text-xl font-black tracking-tighter metallic-text select-none">NINJABR</span>
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
        <div className="h-24 flex items-center px-6 border-b border-gray-800">
          <div className="h-10 w-10 bg-gradient-to-br from-ninja-500 to-ninja-600 rounded-xl flex items-center justify-center text-white mr-3 shadow-lg shadow-ninja-500/20 border border-white/10">
            <Shield size={24} fill="currentColor" />
          </div>
          <span className="text-2xl font-black tracking-tighter metallic-text select-none">NINJABR</span>
        </div>

        <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem view="apps" icon={Layers} label="Meus Apps" />
          <NavItem view="proxies" icon={Network} label="Proxies" />
          <NavItem view="users" icon={Users} label="Usuários" />
          
          <div className="pt-6 pb-2">
            <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Sistema & Config</p>
            <NavItem view="api" icon={Code} label="API" />
            <NavItem view="logs" icon={FileText} label="Logs" />
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 bg-dark-900/50">
          <div className="mb-4 px-2">
             <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white border border-gray-600">
                  AD
                </div>
                <div className="overflow-hidden">
                   <p className="text-sm font-medium text-white truncate">Admin Ninja</p>
                   <p className="text-xs text-gray-500 truncate">admin@ninjabr.com</p>
                </div>
             </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium border border-transparent hover:border-red-500/20"
          >
            <LogOut size={18} />
            <span>Sair do Painel</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen bg-dark-950">
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pt-20 lg:pt-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
