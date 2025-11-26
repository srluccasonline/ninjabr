
import React, { useEffect, useState } from 'react';
import { Activity, Search, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { Log } from '../types';
import { mockService } from '../services/mockService';

export const Logs: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    mockService.getLogs().then(data => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  const getIcon = (type: Log['type']) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-green-500" />;
      case 'error': return <AlertCircle size={16} className="text-red-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'info': return <Info size={16} className="text-blue-500" />;
    }
  };

  const getRowStyle = (type: Log['type']) => {
    switch (type) {
      case 'error': return 'bg-red-500/5 hover:bg-red-500/10';
      case 'warning': return 'bg-yellow-500/5 hover:bg-yellow-500/10';
      default: return 'hover:bg-gray-800/50';
    }
  };

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(filter.toLowerCase()) || 
    log.user.toLowerCase().includes(filter.toLowerCase()) ||
    log.details.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Logs do Sistema</h2>
          <p className="text-gray-400 text-sm mt-1">Rastreabilidade completa de todas as ações no painel.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Filtrar logs..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-64 bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ninja-500"
          />
        </div>
      </div>

      <div className="bg-dark-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
        {loading ? (
           <div className="p-12 flex justify-center text-ninja-500">
             <Activity className="animate-spin" size={32} />
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-gray-800 text-gray-200 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4 w-10">Status</th>
                  <th className="px-6 py-4">Ação</th>
                  <th className="px-6 py-4">Detalhes</th>
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4 text-right">Horário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className={`transition-colors ${getRowStyle(log.type)}`}>
                    <td className="px-6 py-4">
                      {getIcon(log.type)}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 text-gray-400 max-w-md truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-800 px-2 py-1 rounded text-xs text-gray-300 border border-gray-700">
                        {log.user}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs">
                      {log.timestamp}
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
