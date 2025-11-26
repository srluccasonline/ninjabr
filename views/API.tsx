
import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Copy, RefreshCw, AlertTriangle, Key } from 'lucide-react';
import { Button } from '../components/Button';
import { mockService } from '../services/mockService';

export const API: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    mockService.getApiKey().then(setApiKey);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    if (window.confirm('Tem certeza? A chave antiga deixará de funcionar imediatamente.')) {
      setLoading(true);
      const newKey = await mockService.regenerateApiKey();
      setApiKey(newKey);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-white">Configuração de API</h2>
        <p className="text-gray-400 text-sm mt-1">Gerencie a chave de acesso para integrações externas e automação.</p>
      </div>

      {/* Key Card */}
      <div className="bg-dark-900 border border-gray-800 rounded-xl p-8 max-w-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-ninja-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-ninja-500/10 rounded-lg text-ninja-500">
            <Key size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Chave Privada</h3>
            <p className="text-sm text-gray-500">Use esta chave para autenticar requisições no endpoint <code className="bg-gray-800 px-1 py-0.5 rounded text-gray-300">/api/v1</code></p>
          </div>
        </div>

        <div className="relative mb-6">
          <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">Secret Key</label>
          <div className="relative group">
            <input 
              type={showKey ? "text" : "password"} 
              readOnly
              value={apiKey}
              className="w-full bg-black/30 border border-gray-700 rounded-lg py-4 pl-4 pr-32 font-mono text-gray-200 focus:outline-none focus:ring-1 focus:ring-ninja-500/50 transition-all"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <button 
                onClick={() => setShowKey(!showKey)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                title={showKey ? "Ocultar" : "Mostrar"}
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button 
                onClick={handleCopy}
                className="p-2 text-gray-400 hover:text-ninja-400 hover:bg-gray-700 rounded-md transition-colors flex items-center gap-2"
                title="Copiar"
              >
                {copied ? <span className="text-xs font-bold text-green-500">Copiado!</span> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-800 pt-6">
           <div className="flex items-start gap-2 max-w-md">
              <AlertTriangle size={16} className="text-yellow-500 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-400 leading-relaxed">
                Nunca compartilhe sua chave privada. Se suspeitar que ela foi comprometida, gere uma nova imediatamente.
              </p>
           </div>
           <Button 
             variant="danger" 
             onClick={handleRegenerate} 
             isLoading={loading}
             className="shrink-0"
           >
             <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
             Gerar Nova Chave
           </Button>
        </div>
      </div>

      {/* Docs Preview */}
      <div className="bg-dark-900 border border-gray-800 rounded-xl p-6 max-w-3xl">
         <h3 className="text-lg font-semibold text-white mb-4">Exemplo de Requisição</h3>
         <div className="bg-black/50 rounded-lg p-4 font-mono text-sm overflow-x-auto border border-gray-800">
           <div className="flex gap-2 mb-2 text-gray-500">
             <span className="text-purple-400">curl</span> 
             <span className="text-green-400">-X POST</span>
             <span className="text-gray-300">https://api.ninjabr.com/v1/profiles/create \</span>
           </div>
           <div className="flex gap-2 mb-2 text-gray-500 pl-4">
             <span className="text-green-400">-H</span>
             <span className="text-yellow-300">"Authorization: Bearer {apiKey ? (showKey ? apiKey : `${apiKey.substr(0, 10)}...`) : 'YOUR_API_KEY'}"</span>
             <span>\</span>
           </div>
           <div className="flex gap-2 text-gray-500 pl-4">
             <span className="text-green-400">-d</span>
             <span className="text-blue-300">'{"{"} "name": "Novo App", "os": "windows" {"}"}'</span>
           </div>
         </div>
      </div>
    </div>
  );
};
