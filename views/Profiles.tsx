
import React, { useState } from 'react';
import { Plus, Play, Square, Settings, Monitor, Smartphone, Laptop, Search, Trash2, Edit2, ShieldAlert, Chrome, Globe, Ban, LayoutGrid, Network, Ghost, X } from 'lucide-react';
import { AppProfile, Proxy } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { mockService } from '../services/mockService';

interface AppsProps {
  apps: AppProfile[];
  proxies: Proxy[];
  setApps: React.Dispatch<React.SetStateAction<AppProfile[]>>;
}

type OS = 'windows' | 'mac' | 'linux' | 'android' | 'ios';

interface UAPreset {
    id: string;
    label: string;
    os: OS;
    browser: 'chrome' | 'firefox' | 'safari' | null;
}

const UA_PRESETS: UAPreset[] = [
    { id: 'win-chrome-140', label: 'Windows 11 + Chrome 140 (Recomendado)', os: 'windows', browser: 'chrome' },
    { id: 'win-chrome-120', label: 'Windows 10 + Chrome 122', os: 'windows', browser: 'chrome' },
    { id: 'mac-chrome', label: 'macOS Sonoma + Chrome 120', os: 'mac', browser: 'chrome' },
    { id: 'mac-safari', label: 'macOS + Safari 17', os: 'mac', browser: 'safari' },
    { id: 'android-chrome', label: 'Android 14 + Chrome Mobile', os: 'android', browser: 'chrome' },
    { id: 'ios-safari', label: 'iPhone 15 Pro + Safari Mobile', os: 'ios', browser: 'safari' },
];

export const Profiles: React.FC<AppsProps> = ({ apps, proxies, setApps }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New App Form State
  const [newName, setNewName] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('win-chrome-140');
  const [selectedProxyId, setSelectedProxyId] = useState<string>('');
  
  // Advanced Blocked Elements
  const [blockedElementsInput, setBlockedElementsInput] = useState('');
  const [showBlocked, setShowBlocked] = useState(false);
  
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const preset = UA_PRESETS.find(p => p.id === selectedPresetId) || UA_PRESETS[0];

      const blocked = blockedElementsInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const created = await mockService.createApp({
        name: newName,
        os: preset.os,
        browser: preset.browser,
        proxyId: selectedProxyId || undefined,
        tags: ['Novo'],
        blockedElements: blocked
      });
      setApps(prev => [created, ...prev]);
      setIsModalOpen(false);
      resetForm();
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setNewName('');
    setSelectedPresetId('win-chrome-140');
    setSelectedProxyId('');
    setBlockedElementsInput('');
    setShowBlocked(false);
  };

  const toggleStatus = (id: string) => {
    setApps(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: p.status === 'running' ? 'stopped' : 'running' };
      }
      return p;
    }));
  };

  const filteredApps = apps.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getOSIcon = (os: OS) => {
    switch (os) {
      case 'windows': return <Monitor size={20} />;
      case 'mac': return <Laptop size={20} />;
      case 'linux': return <Monitor size={20} />;
      case 'android': 
      case 'ios': return <Smartphone size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Meus Apps</h2>
          <p className="text-gray-400 text-sm mt-1">Gerencie seus ambientes isolados e user-agents.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Novo App
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-dark-900 border border-gray-800 p-4 rounded-xl flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome do app..." 
            className="w-full bg-gray-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-ninja-500 focus:outline-none placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
           <select className="bg-gray-800 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ninja-500">
             <option>Todos os Status</option>
             <option>Executando</option>
             <option>Parado</option>
           </select>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredApps.map((app) => (
          <div key={app.id} className="bg-dark-900 border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 hover:border-gray-700 transition-all group">
            {/* Status Indicator */}
            <div className={`w-2 h-2 rounded-full ${app.status === 'running' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-600'}`} />
            
            {/* Platform Icon */}
            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 relative">
              {getOSIcon(app.os)}
              <span className="absolute -bottom-1 -right-1 text-[10px] bg-gray-700 px-1 rounded uppercase">{app.os.slice(0,3)}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 text-center md:text-left">
              <h3 className="text-white font-medium truncate flex items-center justify-center md:justify-start gap-2">
                {app.name}
                {app.blockedElements.length > 0 && (
                   <span title="Elementos Bloqueados" className="text-red-400 bg-red-400/10 p-1 rounded-full"><Ban size={12} /></span>
                )}
              </h3>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                   {app.browser ? <Chrome size={12} /> : <Globe size={12} />} 
                   {app.browser || 'Webview'}
                </span>
                <span className={`flex items-center gap-1 ${app.proxyId ? 'text-ninja-400' : 'text-gray-600'}`}>
                  <Settings size={12} /> 
                  {app.proxyId ? (proxies.find(p => p.id === app.proxyId)?.name || 'Proxy Desconhecido') : 'Sem Proxy'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-center">
              <Button 
                variant={app.status === 'running' ? 'danger' : 'primary'}
                className="w-full md:w-auto h-9 text-xs"
                onClick={() => toggleStatus(app.id)}
              >
                {app.status === 'running' ? (
                  <><Square size={14} className="mr-2" /> Parar</>
                ) : (
                  <><Play size={14} className="mr-2" /> Iniciar</>
                )}
              </Button>
              <button className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Edit2 size={16} />
              </button>
              <button className="p-2 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {filteredApps.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhum App encontrado.
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="bg-dark-900 border border-gray-700 w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative my-8">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <div className="bg-ninja-500/20 p-2 rounded-lg text-ninja-500">
                    <Plus size={20} />
                  </div>
                  Criar Novo App
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><Settings size={20}/></button>
             </div>
             
             <form onSubmit={handleCreateApp} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                 {/* Name Input with Icon */}
                 <div>
                   <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1.5">
                      <LayoutGrid size={16} className="text-ninja-500" />
                      Nome do App
                   </label>
                   <Input 
                     placeholder="Ex: Instagram Influencer Main" 
                     value={newName}
                     onChange={e => setNewName(e.target.value)}
                     required
                   />
                 </div>
                 
                 {/* Proxy Input with Icon */}
                 <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1.5">
                      <Network size={16} className="text-ninja-500" />
                      Proxy
                    </label>
                    <select 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-ninja-500"
                      value={selectedProxyId}
                      onChange={(e) => setSelectedProxyId(e.target.value)}
                    >
                      <option value="">Sem Proxy (Conexão Direta)</option>
                      {proxies.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.ip})</option>
                      ))}
                    </select>
                 </div>
               </div>
               
               {/* User Agent / OS Selection Dropdown */}
               <div>
                 <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1.5">
                    <Ghost size={16} className="text-ninja-500" />
                    User Agent & Ambiente
                 </label>
                 <div className="relative">
                   <select
                      className="w-full pl-3 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-ninja-500 appearance-none cursor-pointer"
                      value={selectedPresetId}
                      onChange={(e) => setSelectedPresetId(e.target.value)}
                   >
                     {UA_PRESETS.map((preset) => (
                       <option key={preset.id} value={preset.id}>
                         {preset.label}
                       </option>
                     ))}
                   </select>
                   <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                      <Monitor size={18} />
                   </div>
                 </div>
               </div>

               {/* Advanced Options (Blocked Elements) */}
               <div className="border-t border-gray-800 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-red-400">
                        <Ban size={16} />
                        Opção de bloqueio de elementos
                    </label>
                    
                    {!showBlocked && (
                      <button 
                        type="button"
                        onClick={() => setShowBlocked(true)}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 transition-colors"
                      >
                        <Plus size={12} /> Adicionar Bloqueios
                      </button>
                    )}
                  </div>

                  {showBlocked && (
                     <div className="mt-3 animate-in fade-in slide-in-from-top-2 relative">
                        <button 
                          type="button" 
                          onClick={() => setShowBlocked(false)}
                          className="absolute right-2 top-2 text-gray-500 hover:text-white"
                        >
                          <X size={14} />
                        </button>
                        <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-4">
                            <p className="text-xs text-gray-400 mb-3">
                                Insira os seletores CSS dos elementos que deseja remover da página (Anti-Detecção Visual). Separe por vírgula.
                            </p>
                            <textarea
                            rows={3}
                            className="w-full px-3 py-2 bg-dark-950 border border-red-900/50 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-red-500 text-sm font-mono"
                            placeholder="#botao-logout, .anuncios-popup, div[data-tracking='true']"
                            value={blockedElementsInput}
                            onChange={e => setBlockedElementsInput(e.target.value)}
                            />
                        </div>
                     </div>
                  )}
               </div>

               <div className="flex gap-3 pt-2">
                 <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
                   Cancelar
                 </Button>
                 <Button type="submit" className="flex-1" isLoading={isCreating}>
                   Criar App
                 </Button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};
