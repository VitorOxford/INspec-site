// src/components/dashboard/UserInviteModal.tsx
import React, { useState } from 'react';
import { Mail, Briefcase, X, UserPlus, Zap, Send, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient'; 

// Tipo de props para o Modal
interface UserInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableRoles: string[]; 
}

const UserInviteModal: React.FC<UserInviteModalProps> = ({ isOpen, onClose, availableRoles }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [role, setRole] = useState('employee'); // Padrão
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Para erros
  const [successToken, setSuccessToken] = useState<string | null>(null);
  const { profile } = useAuth(); // Para pegar o organization_id do Admin

  if (!isOpen) return null;

  // Limpa o estado ao fechar
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setEmail('');
      setName('');
      setJobTitle('');
      setRole('employee');
      setLoading(false);
      setError(null);
      setSuccessToken(null);
    }, 300);
  };

  // Lógica de Convite (Chamando a Edge Function)
 const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessToken(null);

    // Validação
    if (!email || !name || !jobTitle) {
      setError("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      console.log("FRONTEND: Invocando função 'invite-user'...");
      // Chama a Supabase Edge Function 'invite-user'
      const { data, error } = await supabase.functions.invoke('create-invite-code', {
        body: {
          email,
          fullName: name,
          jobTitle,
          role,
        },
      });

      // ==========================================================
      // ▼▼▼ LÓGICA DE ERRO ATUALIZADA (MAIS SIMPLES) ▼▼▼
      // ==========================================================
      if (error) {
        // Se 'error' existir, ele contém o objeto de erro
        // O supabase-js já faz o parse do JSON de erro para nós
        
        // Log para vermos o objeto de erro completo
        console.error("FRONTEND: Erro recebido da função:", JSON.stringify(error));
        
        // A mensagem de erro real da nossa função está em 'error.message'
        // que pode ser uma string JSON "{\"error\":\"...\"}"
        let errorMessage = "Erro desconhecido.";
        try {
          const parsed = JSON.parse(error.message);
          errorMessage = parsed.error; // Extrai a mensagem
        } catch(e) {
          // Se não for JSON, é uma mensagem simples (ex: "NetworkError")
          errorMessage = error.message;
        }

        setError(errorMessage);
        setLoading(false);
        return; // Pára a execução aqui
      }
      // ==========================================================
      // ▲▲▲ FIM DA CORREÇÃO ▲▲▲
      // ==========================================================

      // Sucesso! A função retorna o token de convite
      if (data && data.invite_token) {
        console.log("FRONTEND: Sucesso! Token recebido:", data.invite_token);
        setSuccessToken(data.invite_token);
        
        // Limpa os campos
        setEmail('');
        setName('');
        setJobTitle('');
        setRole('employee');
      } else {
        throw new Error("A função não retornou um token, mesmo com sucesso.");
      }

    } catch (err: any) {
      // Este catch agora só apanha erros de sintaxe do lado do cliente
      console.error("FRONTEND: Erro de sintaxe/runtime no handleInvite:", err);
      setError(`Erro inesperado no cliente: ${err.message}`);
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
        <button onClick={handleClose} className={cn("absolute top-4 right-4 p-2 rounded-full", textSecondary, "hover:bg-slate-200 dark:hover:bg-slate-700")}>
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
            <h3 className="text-xl font-semibold text-green-400">Convite Gerado!</h3>
            <p className={cn("text-sm", textSecondary)}>
              Peça ao colaborador para inserir estes códigos no App Desktop (Electron).
            </p>
            
            {/* Display do Código */}
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-500 mb-1 uppercase">Código do Colaborador (Token)</p>
                <code className="text-2xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 select-all">
                    {successToken}
                </code>
            </div>
            
            {/* Display do Organization ID */}
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-500 mb-1 uppercase">ID da Organização</p>
                <code className="text-xl font-mono font-bold text-white select-all">
                    {profile?.organization_id || 'ID_DA_ORG_NAO_ENCONTRADO'} 
                </code>
            </div>
            
            <Button onClick={handleClose} className="w-full mt-4 bg-green-600 hover:bg-green-700">
                Fechar
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

            {/* Mensagem de Erro */}
            {error && (
              <div className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-3">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={loading}
            >
              {loading ? "Convidando..." : "Convidar e Gerar Código"}
              {!loading && <Send className="ml-2 h-5 w-5" />}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserInviteModal;