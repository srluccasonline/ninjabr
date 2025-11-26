
import React, { useState } from 'react';
import { Shield, Loader2 } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock network request
    setTimeout(() => {
      if (username === 'admin' && password === '1234') {
        onLogin(true);
      } else {
        setError('Credenciais inválidas. Tente admin / 1234');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-ninja-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-ninja-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md bg-dark-900 border border-gray-800 rounded-2xl shadow-2xl p-8 z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-br from-ninja-500/20 to-ninja-600/5 rounded-2xl flex items-center justify-center mb-4 text-ninja-500 border border-ninja-500/20 shadow-lg shadow-ninja-500/10">
            <Shield size={36} strokeWidth={2.5} />
          </div>
          
          {/* Animated Metallic Logo */}
          <h1 className="text-5xl font-black tracking-tighter mt-4 metallic-text select-none">
            NINJABR
          </h1>
          
          <p className="text-gray-500 text-sm mt-3 font-medium">Painel Anti-Detect Browser</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Usuário"
            placeholder="Ex: admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {error && (
            <div className="bg-red-500/10 text-red-400 px-3 py-2 rounded-lg text-sm border border-red-500/20 flex items-center justify-center">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg shadow-ninja-500/20 hover:shadow-ninja-500/30 transition-all" isLoading={loading}>
            Entrar no Sistema
          </Button>
        </form>

        <div className="mt-8 text-center">
           <p className="text-xs text-gray-600">
             Protegido por criptografia ponta-a-ponta.
           </p>
           <p className="text-[10px] text-gray-700 mt-1 uppercase tracking-widest font-semibold">
             NinjaBR v1.0.0
           </p>
        </div>
      </div>
    </div>
  );
};
