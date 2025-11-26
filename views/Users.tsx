import React, { useState } from 'react';
import { UserPlus, Mail, Shield, MoreVertical } from 'lucide-react';
import { User } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { mockService } from '../services/mockService';

interface UsersProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const Users: React.FC<UsersProps> = ({ users, setUsers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newUser = await mockService.createUser({
        name,
        email,
        role,
        status: 'active'
      });
      setUsers(prev => [...prev, newUser]);
      setIsModalOpen(false);
      setName('');
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciar Usuários</h2>
          <p className="text-gray-400 text-sm mt-1">Controle quem tem acesso aos seus perfis.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <UserPlus size={18} className="mr-2" />
          Adicionar Membro
        </Button>
      </div>

      <div className="bg-dark-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-800 text-gray-200 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Função</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Último Login</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ninja-500 to-ninja-700 flex items-center justify-center text-white font-bold text-lg">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {user.role === 'admin' ? <Shield size={12} className="mr-1" /> : null}
                      {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {user.status === 'active' ? 'Ativo' : 'Bloqueado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

       {/* Create User Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-dark-900 border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl p-6">
             <h3 className="text-xl font-bold text-white mb-4">Adicionar Membro</h3>
             <p className="text-sm text-gray-400 mb-6">Convide alguém para colaborar nos seus perfis.</p>
             
             <form onSubmit={handleCreateUser} className="space-y-4">
               <Input 
                 label="Nome Completo" 
                 placeholder="Ex: Ana Clara" 
                 value={name}
                 onChange={e => setName(e.target.value)}
                 required
               />
               
               <Input 
                type="email"
                 label="E-mail" 
                 placeholder="ana@exemplo.com" 
                 value={email}
                 onChange={e => setEmail(e.target.value)}
                 required
               />

               <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Permissão</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="role" 
                      value="user" 
                      checked={role === 'user'} 
                      onChange={() => setRole('user')}
                      className="text-ninja-500 focus:ring-ninja-500 bg-gray-800 border-gray-600"
                    />
                    Usuário Padrão
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="role" 
                      value="admin" 
                      checked={role === 'admin'} 
                      onChange={() => setRole('admin')}
                      className="text-ninja-500 focus:ring-ninja-500 bg-gray-800 border-gray-600"
                    />
                    Admin
                  </label>
                </div>
               </div>
               
               <div className="flex gap-3 mt-6">
                 <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
                   Cancelar
                 </Button>
                 <Button type="submit" className="flex-1" isLoading={loading}>
                   Adicionar
                 </Button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};