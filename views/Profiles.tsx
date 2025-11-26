import React, { useState } from 'react';
import { Plus, Play, Square, Settings, Monitor, Globe, Laptop, Cpu, Search, Trash2, Edit2 } from 'lucide-react';
import { Profile } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { mockService } from '../services/mockService';

interface ProfilesProps {
  profiles: Profile[];
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
}

export const Profiles: React.FC<ProfilesProps> = ({ profiles, setProfiles }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Profile Form State
  const [newName, setNewName] = useState('');
  const [newPlatform, setNewPlatform] = useState<'windows'|'mac'|'linux'>('windows');
  const [newProxy, setNewProxy] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const created = await mockService.createProfile({
        name: newName,
        platform: newPlatform,
        browser: 'chrome',
        proxy: newProxy || 'Sem Proxy',
        tags: ['Novo']
      });
      setProfiles(prev => [created, ...prev]);
      setIsModalOpen(false);
      setNewName('');
      setNewProxy('');
    } finally {
      setIsCreating(false);
    }
  };

  const toggleStatus = (id: string) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: p.status === 'running' ? 'stopped' : 'running' };
      }
      return p;
    }));
  };

  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Perfis de Browser</h2>
          <p className="text-gray-400 text-sm mt-1">Gerencie seus ambientes isolados (fingerprints).</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Novo Perfil
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-dark-900 border border-gray-800 p-4 rounded-xl flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou tag..." 
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
        {filteredProfiles.map((profile) => (
          <div key={profile.id} className="bg-dark-900 border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 hover:border-gray-700 transition-all group">
            {/* Status Indicator */}
            <div className={`w-2 h-2 rounded-full ${profile.status === 'running' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-600'}`} />
            
            {/* Platform Icon */}
            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400">
              {profile.platform === 'windows' ? <Monitor size={20} /> : profile.platform === 'mac' ? <Laptop size={20} /> : <Cpu size={20} />}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 text-center md:text-left">
              <h3 className="text-white font-medium truncate">{profile.name}</h3>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Globe size={12} /> {profile.browser}</span>
                <span className="flex items-center gap-1 text-ninja-400"><Settings size={12} /> {profile.proxy}</span>
                {profile.tags.map(tag => (
                  <span key={tag} className="bg-gray-800 px-2 py-0.5 rounded text-gray-400">{tag}</span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-center">
              <Button 
                variant={profile.status === 'running' ? 'danger' : 'primary'}
                className="w-full md:w-auto h-9 text-xs"
                onClick={() => toggleStatus(profile.id)}
              >
                {profile.status === 'running' ? (
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

        {filteredProfiles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhum perfil encontrado para sua busca.
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-dark-900 border border-gray-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
             <h3 className="text-xl font-bold text-white mb-4">Novo Perfil Anti-Detect</h3>
             
             <form onSubmit={handleCreateProfile} className="space-y-4">
               <Input 
                 label="Nome do Perfil" 
                 placeholder="Ex: Google Ads Farming 01" 
                 value={newName}
                 onChange={e => setNewName(e.target.value)}
                 required
               />
               
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-1.5">Sistema Operacional</label>
                 <div className="grid grid-cols-3 gap-2">
                   {['windows', 'mac', 'linux'].map((os) => (
                     <button
                       key={os}
                       type="button"
                       onClick={() => setNewPlatform(os as any)}
                       className={`py-2 px-4 rounded-lg border text-sm capitalize ${
                         newPlatform === os 
                         ? 'bg-ninja-500 border-ninja-500 text-white' 
                         : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                       }`}
                     >
                       {os}
                     </button>
                   ))}
                 </div>
               </div>

               <Input 
                 label="Proxy (IP:Port:User:Pass)" 
                 placeholder="Deixe em branco para conexão direta" 
                 value={newProxy}
                 onChange={e => setNewProxy(e.target.value)}
               />

               <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg text-xs text-blue-300">
                 Um User-Agent e WebRTC fingerprint únicos serão gerados automaticamente baseados no OS escolhido.
               </div>

               <div className="flex gap-3 mt-6">
                 <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
                   Cancelar
                 </Button>
                 <Button type="submit" className="flex-1" isLoading={isCreating}>
                   Criar Perfil
                 </Button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};