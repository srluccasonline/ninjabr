
import React, { useState } from 'react';
import { Plus, Trash2, Globe, Server, Lock, Unlock, ShieldCheck, ShieldAlert, Check, RefreshCw, Edit, Activity } from 'lucide-react';
import { Proxy } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { mockService } from '../services/mockService';

interface ProxiesProps {
  proxies: Proxy[];
  setProxies: React.Dispatch<React.SetStateAction<Proxy[]>>;
}

export const Proxies: React.FC<ProxiesProps> = ({ proxies, setProxies }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testingAll, setTestingAll] = useState(false);
  const [error, setError] = useState('');
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('');
  const [type, setType] = useState<'http' | 'https' | 'socks4' | 'socks5'>('http');
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const openModal = (proxy?: Proxy) => {
    setError('');
    if (proxy) {
      setEditingId(proxy.id);
      setName(proxy.name);
      setIp(proxy.ip);
      setPort(proxy.port);
      setType(proxy.type);
      setRequiresAuth(!!proxy.username);
      setUsername(proxy.username || '');
      setPassword(proxy.password || '');
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setIp('');
    setPort('');
    setType('http');
    setRequiresAuth(false);
    setUsername('');
    setPassword('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editingId) {
        // Edit
        const updated = await mockService.updateProxy(editingId, {
            name, ip, port, type, 
            username: requiresAuth ? username : undefined,
            password: requiresAuth ? password : undefined
        });
        setProxies(prev => prev.map(p => p.id === editingId ? updated : p));
      } else {
        // Create
        const newProxy = await mockService.createProxy({
          name,
          ip,
          port,
          type,
          username: requiresAuth ? username : undefined,
          password: requiresAuth ? password : undefined,
        });
        setProxies(prev => [...prev, newProxy]);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar proxy");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Remover este proxy?")) {
        await mockService.deleteProxy(id);
        setProxies(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleTestProxy = async (id: string) => {
    // Set to testing state locally
    setProxies(prev => prev.map(p => p.id === id ? { ...p, status: 'testing' } : p));
    
    try {
        const result = await mockService.testProxy(id);
        setProxies(prev => prev.map(p => p.id === id ? { ...p, status: result, lastCheck: 'Agora' } : p));
    } catch (e) {
        setProxies(prev => prev.map(p => p.id === id ? { ...p, status: 'error', lastCheck: 'Falha' } : p));
    }
  };

  const handleTestAll = async () => {
      setTestingAll(true);
      // Sequentially or Parallel - doing parallel for speed in mock
      const promises = proxies.map(p => handleTestProxy(p.id));
      await Promise.all(promises);
      setTestingAll(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Proxies</h2>
          <p className="text-gray-400 text-sm mt-1">Gerencie sua rede de IPs para rotação.</p>
        </div>
        <div className="flex gap-3">
            <Button variant="secondary" onClick={handleTestAll} disabled={testingAll || proxies.length === 0}>
                <RefreshCw size={18} className={`mr-2 ${testingAll ? 'animate-spin' : ''}`} />
                Testar Todos
            </Button>
            <Button onClick={() => openModal()}>
                <Plus size={18} className="mr-2" />
                Adicionar Proxy
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {proxies.map(proxy => (
          <div key={proxy.id} className="bg-dark-900 border border-gray-800 rounded-xl p-5 hover:border-ninja-500/50 transition-all group relative overflow-hidden flex flex-col">
             
             {/* Header */}
             <div className="flex items-start gap-4 mb-4">
                <div className="bg-ninja-500/10 p-3 rounded-lg text-ninja-500 shrink-0">
                    <Server size={24} />
                </div>
                <div className="min-w-0">
                    <h3 className="font-bold text-white truncate" title={proxy.name}>{proxy.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs uppercase bg-gray-800 px-2 py-0.5 rounded text-gray-400 font-mono border border-gray-700">
                            {proxy.type}
                        </span>
                        {proxy.username ? (
                            <span className="text-xs flex items-center gap-1 text-green-500/80" title="Autenticado"><Lock size={10} /> Auth</span>
                        ) : (
                            <span className="text-xs flex items-center gap-1 text-gray-600" title="Público"><Unlock size={10} /> Public</span>
                        )}
                    </div>
                </div>
             </div>

             {/* Details */}
             <div className="space-y-2 bg-gray-800/50 p-3 rounded-lg font-mono text-sm border border-gray-800 mb-4 flex-1">
                <div className="flex justify-between">
                    <span className="text-gray-500">Host:</span>
                    <span className="text-gray-300 select-all truncate ml-2">{proxy.ip}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Porta:</span>
                    <span className="text-gray-300 select-all">{proxy.port}</span>
                </div>
             </div>

             {/* Footer Status & Actions */}
             <div className="flex items-center justify-between border-t border-gray-800 pt-3">
                 <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-xs">
                        {proxy.status === 'testing' && <span className="flex items-center gap-1 text-yellow-500"><RefreshCw size={12} className="animate-spin" /> Testando...</span>}
                        {proxy.status === 'active' && <span className="flex items-center gap-1 text-green-500"><ShieldCheck size={12} /> Online</span>}
                        {proxy.status === 'error' && <span className="flex items-center gap-1 text-red-500"><ShieldAlert size={12} /> Offline</span>}
                    </div>
                    <span className="text-[10px] text-gray-600 mt-0.5">{proxy.lastCheck ? `Verificado: ${proxy.lastCheck}` : 'Nunca verificado'}</span>
                 </div>

                 <div className="flex gap-1">
                    <button 
                        onClick={() => handleTestProxy(proxy.id)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                        title="Testar Conexão"
                        disabled={proxy.status === 'testing'}
                    >
                        <Activity size={16} />
                    </button>
                    <button 
                        onClick={() => openModal(proxy)}
                        className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded transition-colors"
                        title="Editar"
                    >
                        <Edit size={16} />
                    </button>
                    <button 
                        onClick={() => handleDelete(proxy.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-700 rounded transition-colors"
                        title="Remover"
                    >
                        <Trash2 size={16} />
                    </button>
                 </div>
             </div>
          </div>
        ))}

        {proxies.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-dark-900/50 rounded-xl border border-dashed border-gray-800 flex flex-col items-center justify-center gap-3">
                <Globe size={48} className="opacity-20" />
                <p>Nenhum proxy cadastrado.</p>
                <Button variant="secondary" onClick={() => openModal()}>Adicionar o primeiro</Button>
            </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="bg-dark-900 border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl p-6 relative my-8">
             <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-white">{editingId ? 'Editar Proxy' : 'Adicionar Proxy'}</h3>
             </div>
             
             <form onSubmit={handleSave} className="space-y-5">
               <Input 
                 label="Nome Identificador" 
                 placeholder="Ex: 4G BR Vivo" 
                 value={name}
                 onChange={e => setName(e.target.value)}
                 required
               />
               <p className="text-xs text-gray-500 -mt-4">* Deve ser único</p>

               <div className="grid grid-cols-3 gap-3">
                 <div className="col-span-2">
                    <Input 
                        label="IP / Host" 
                        placeholder="192.168.0.1" 
                        value={ip}
                        onChange={e => setIp(e.target.value)}
                        required
                    />
                 </div>
                 <div>
                    <Input 
                        label="Porta" 
                        placeholder="8080" 
                        value={port}
                        onChange={e => setPort(e.target.value)}
                        required
                    />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">Protocolo</label>
                 <div className="grid grid-cols-4 gap-2">
                    {['http', 'https', 'socks4', 'socks5'].map(t => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setType(t as any)}
                            className={`py-2 text-xs font-medium rounded-lg uppercase border transition-all ${
                                type === t 
                                ? 'bg-ninja-500 border-ninja-500 text-white shadow-lg shadow-ninja-500/20' 
                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                 </div>
               </div>

               <div className="pt-2">
                  <div 
                    onClick={() => setRequiresAuth(!requiresAuth)}
                    className="flex items-center gap-3 cursor-pointer group select-none"
                  >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          requiresAuth 
                          ? 'bg-ninja-500 border-ninja-500' 
                          : 'bg-gray-800 border-gray-600 group-hover:border-gray-500'
                      }`}>
                          {requiresAuth && <Check size={14} className="text-white" strokeWidth={3} />}
                      </div>
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Requer Autenticação?</span>
                  </div>
               </div>

               {requiresAuth && (
                   <div className="grid grid-cols-2 gap-3 bg-gray-800/30 p-4 rounded-lg border border-gray-800 animate-in fade-in slide-in-from-top-2">
                       <Input 
                            label="Usuário" 
                            value={username} 
                            onChange={e => setUsername(e.target.value)}
                            className="bg-gray-900"
                        />
                       <Input 
                            label="Senha" 
                            type="password"
                            value={password} 
                            onChange={e => setPassword(e.target.value)}
                            className="bg-gray-900"
                        />
                   </div>
               )}

               {error && <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-500/20">{error}</p>}

               <div className="flex gap-3 mt-8">
                 <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
                   Cancelar
                 </Button>
                 <Button type="submit" className="flex-1" isLoading={loading}>
                   {editingId ? 'Salvar Alterações' : 'Criar Proxy'}
                 </Button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};
