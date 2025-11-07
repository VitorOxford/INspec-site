// src/components/dashboard/UserInviteModal.tsx
import React, { useState } from 'react';
import { Mail, Briefcase, Plus, X, UserPlus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

// Tipo de props para o Modal
interface UserInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  // TODO: Em uma implementação real, passaria a lista de organizações disponíveis para o Admin aqui
  availableRoles: string[]; 
}

const UserInviteModal: React.FC<UserInviteModalProps> = ({ isOpen, onClose, availableRoles }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [role, setRole] = useState('employee'); // Padrão
  const [loading, setLoading] = useState(false);
  const [successToken, setSuccessToken] = useState<string | null>(null);
  const { profile } = useAuth(); // Para pegar o organization_id do Admin

  if (!isOpen) return null;

  // Lógica de Cadastro/Convite (Backend Mockado)
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessToken(null);

    // MOCK: Em uma aplicação real, aqui o Supabase faria:
    // 1. Chamar uma Função Edge (Serverless) para:
    //    a. Criar o usuário (supabase.auth.admin.createUser)
    //    b. Inserir o perfil com o organization_id do Admin (profile?.organization_id)
    //    c. GERAR UM TOKEN ÚNICO E CURTO (Ex: "ABC-123456")
    //    d. Enviar e-mail de convite (opcional)

    try {
      // Simulação de delay de API e geração de Token
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      const generatedToken = Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Math.floor(Math.random() * 1000);
      
      setSuccessToken(generatedToken);
      
      // Limpa os campos após sucesso
      setEmail('');
      setName('');
      setJobTitle('');
      setRole('employee');

    } catch (error) {
      console.error("Erro ao convidar usuário:", error);
      // Aqui você lidaria com erros (ex: usuário já existe)
    } finally {
      setLoading(false);
    }
  };

  const modalBg = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800';
  const textPrimary = 'text-slate-900 dark:text-white';
  const textSecondary = 'text-slate-500 dark:text-slate-400';

  // --- Renderização do Modal ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity">
      <div className={cn("relative w-full max-w-lg rounded-xl p-8 shadow-2xl", modalBg)}>
        
        {/* Close Button */}
        <button onClick={onClose} className={cn("absolute top-4 right-4 p-2 rounded-full", textSecondary, "hover:bg-slate-200 dark:hover:bg-slate-700")}>
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <UserPlus className="h-8 w-8 text-purple-500 mx-auto mb-3" />
          <h2 className={cn("text-2xl font-bold", textPrimary)}>
            Convidar Novo Colaborador
          </h2>
          <p className={cn("text-sm mt-1", textSecondary)}>
            Preencha os dados e gere o código de monitoramento.
          </p>
        </div>

        {/* Token de Sucesso */}
        {successToken ? (
          <div className="text-center p-6 bg-green-500/10 border border-green-500/30 rounded-lg space-y-4 animate-fadeIn">
            <Zap className="h-8 w-8 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold text-green-400">Convite Enviado!</h3>
            <p className={cn("text-sm", textSecondary)}>
              Peça ao colaborador para inserir este código no **App Electron/Desktop** e o **ID da sua Organização**.
            </p>
            
            {/* Display do Código */}
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-500 mb-1 uppercase">Código do Colaborador</p>
                <code className="text-2xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 select-all">
                    {successToken}
                </code>
            </div>
            
            {/* Display do Organization ID */}
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-500 mb-1 uppercase">ID da Organização</p>
                <code className="text-xl font-mono font-bold text-white select-all">
                    {profile?.organization_id || 'ORG-NOT-SET'} 
                </code>
            </div>
            
            <Button onClick={onClose} className="w-full mt-4 bg-green-600 hover:bg-green-700">
                Fechar e Gerenciar
            </Button>
          </div>
        ) : (
          /* Formulário de Convite */
          <form onSubmit={handleInvite} className="space-y-5">
            <div>
              <Label htmlFor="name" className={textPrimary}>Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: João da Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 dark:bg-slate-800/80 dark:border-slate-700 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="email" className={textPrimary}>E-mail de Cadastro</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 dark:bg-slate-800/80 dark:border-slate-700 dark:text-white"
              />
            </div>
            
            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <Label htmlFor="jobTitle" className={textPrimary}>Cargo/Função</Label>
                    <Input
                        id="jobTitle"
                        type="text"
                        placeholder="Ex: Dev Jr"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        required
                        className="mt-1 dark:bg-slate-800/80 dark:border-slate-700 dark:text-white"
                    />
                </div>
                <div>
                    <Label htmlFor="role" className={textPrimary}>Função no INspec</Label>
                    <div className="relative mt-1">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                        <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        className="flex h-10 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-2 text-sm pl-11 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-800/80 dark:border-slate-700 dark:text-white"
                        >
                            <option value="employee">Colaborador</option>
                            <option value="admin">Administrador</option>
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        </div>
                    </div>
                </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={loading}
            >
              {loading ? "Enviando Convite..." : "Convidar e Gerar Código"}
              {!loading && <Send className="ml-2 h-5 w-5" />}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserInviteModal;