import React from 'react';
import { Users, LayoutGrid, Monitor, ShieldCheck, Activity, Chrome, Database } from 'lucide-react';
import { AppProfile, User, Proxy } from '../types';

interface DashboardProps {
  apps: AppProfile[];
  users: User[];
  proxies: Proxy[];
}

export const Dashboard: React.FC<DashboardProps> = ({ apps, users, proxies }) => {
  const activeApps = apps.filter(p => p.status === 'running').length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const activeProxies = proxies.filter(p => p.status === 'active').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">Visão geral do sistema de camuflagem NinjaBR.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-ninja-400 bg-ninja-500/10 px-3 py-1 rounded-full border border-ninja-500/20">
          <Activity size={14} />
          SYSTEM ONLINE
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Apps Criados" 
          value={apps.length.toString()} 
          icon={<LayoutGrid className="text-blue-400" />} 
          trend="+12% essa semana"
          trendUp={true}
        />
        <StatCard 
          title="Apps Rodando" 
          value={activeApps.toString()} 
          icon={<Monitor className="text-green-400" />} 
          trend="Executando agora"
          color="text-green-400"
        />
        <StatCard 
          title="Membros da Equipe" 
          value={users.length.toString()} 
          icon={<Users className="text-purple-400" />} 
          trend={`${activeUsers} online`}
        />
        <StatCard 
          title="Proxies Ativos" 
          value={activeProxies.toString()} 
          icon={<ShieldCheck className="text-ninja-400" />} 
          trend={`${proxies.length} total`}
          color="text-ninja-400"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-dark-900 border border-gray-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold text-white">Apps Usados Recentemente</h3>
            <button className="text-sm text-ninja-500 hover:text-ninja-400">Ver relatório</button>
          </div>
          <div className="space-y-4">
            {apps.slice(0, 3).map(app => (
              <div key={app.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${app.browser === 'chrome' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
                    <Chrome size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-white">{app.name}</p>
                    <p className="text-xs text-gray-500">
                      {proxies.find(p => p.id === app.proxyId)?.name || 'Sem Proxy'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    app.status === 'running' 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {app.status === 'running' ? 'Executando' : 'Parado'}
                  </span>
                  <span className="text-[10px] text-gray-600">ID: {app.id}</span>
                </div>
              </div>
            ))}
            {apps.length === 0 && <p className="text-gray-500 text-sm">Nenhum app criado.</p>}
          </div>
        </div>

        <div className="bg-dark-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Database size={18} className="text-ninja-500" />
            <h3 className="text-lg font-semibold text-white">Uso de Recursos</h3>
          </div>
          <div className="space-y-6">
            <ResourceBar label="Armazenamento de Perfis" value={45} total="50 GB" color="bg-blue-500" />
            <ResourceBar label="Tráfego de Proxy" value={72} total="1.2 TB" color="bg-ninja-500" />
            <ResourceBar label="Fingerprints Gerados" value={28} total="500/mês" color="bg-purple-500" />
          </div>
          
          <div className="mt-8 p-4 bg-ninja-500/5 border border-ninja-500/10 rounded-lg">
            <p className="text-sm text-ninja-200">
              <span className="font-bold block mb-1">Dica Ninja:</span>
              Use user-agents móveis (Android/iOS) para campanhas de redes sociais como TikTok e Instagram.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{title: string; value: string; icon: React.ReactNode; trend: string; trendUp?: boolean; color?: string}> = ({
  title, value, icon, trend, trendUp, color
}) => (
  <div className="bg-dark-900 border border-gray-800 p-5 rounded-xl hover:border-gray-700 transition-all shadow-lg shadow-black/20">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
      </div>
      <div className="p-2 bg-gray-800 rounded-lg border border-gray-700">
        {icon}
      </div>
    </div>
    <p className={`text-xs flex items-center gap-1 ${color || (trendUp ? 'text-green-400' : 'text-gray-500')}`}>
      {trend}
    </p>
  </div>
);

const ResourceBar: React.FC<{label: string; value: number; total: string; color: string}> = ({ label, value, total, color }) => (
  <div>
    <div className="flex justify-between text-xs mb-2">
      <span className="text-gray-300">{label}</span>
      <span className="text-gray-500">{value}% de {total}</span>
    </div>
    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} rounded-full transition-all duration-1000`} 
        style={{ width: `${value}%` }} 
      />
    </div>
  </div>
);
