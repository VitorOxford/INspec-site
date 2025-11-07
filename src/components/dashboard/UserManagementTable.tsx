// src/components/dashboard/UserManagementTable.tsx
// VERSÃO 2.0 - COM DADOS REAIS E MODAL DE EDIÇÃO

import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit, Trash2, UserPlus, Settings, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabaseClient'; // Importa o Supabase
import { useAuth, type Profile } from '@/contexts/AuthContext'; // Importa o hook de auth e o tipo Profile

// Importa os novos modais
import UserInviteModal from './UserInviteModal'; 
import UserEditModal from './UserEditModal'; // NOVO: Modal de Edição

// --- Sub-Componentes de UI (Status) ---

const StatusBadge: React.FC<{ status: 'online' | 'idle' | 'offline' | null }> = ({ status }) => {
  const baseClasses = "flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full";
  let statusClasses = '';
  let dotClass = '';
  let label = '';

  // NOTA: O status real (online/offline) virá do Realtime/Presence.
  // Por enquanto, vamos tratar todos como 'offline'.
  switch (status) {
    case 'online':
      statusClasses = 'bg-green-500/20 text-green-400';
      dotClass = 'bg-green-500';
      label = 'Online';
      break;
    case 'idle':
      statusClasses = 'bg-yellow-500/20 text-yellow-400';
      dotClass = 'bg-yellow-500';
      label = 'Inativo';
      break;
    case 'offline':
    default:
      statusClasses = 'bg-slate-500/20 text-slate-400';
      dotClass = 'bg-slate-500';
      label = 'Offline';
      break;
  }

  return (
    <span className={cn(baseClasses, statusClasses)}>
      <span className={cn('h-2 w-2 rounded-full', dotClass)} />
      {label}
    </span>
  );
};


// --- Componente Principal ---

export default function UserManagementTable() {
  const { profile } = useAuth(); // Pega o perfil do admin logado
  const [users, setUsers] = useState<Profile[]>([]); // Estado para usuários reais
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para os modais
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  
  const { resolvedTheme } = useTheme();

  // Função para buscar os usuários
  const fetchUsers = async () => {
    if (!profile?.organization_id) return;

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('organization_id', profile.organization_id);

      if (error) throw error;
      setUsers(data as Profile[]);
    } catch (err: any) {
      setError(err.message || "Falha ao buscar colaboradores.");
    } finally {
      setLoading(false);
    }
  };

  // Busca os usuários quando o componente monta (e quando o profile carrega)
  useEffect(() => {
    if (profile?.organization_id) {
      fetchUsers();
    }
  }, [profile]);

  // Filtra usuários com base no termo de pesquisa
  const filteredUsers = users.filter(user =>
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.job_title && user.job_title.toLowerCase().includes(searchTerm.toLowerCase()))
    // (O email não está na tabela profiles, então removemos do filtro por enquanto)
  );

  // --- Handlers de Ação ---

  // Lógica de Deletar
  const handleDelete = async (userToDelete: Profile) => {
    if (userToDelete.id === profile?.id) {
      alert("Você não pode excluir seu próprio perfil.");
      return;
    }
    
    if (confirm(`Tem certeza que deseja excluir ${userToDelete.full_name}? Esta ação é irreversível.`)) {
      setLoading(true);
      // Precisamos de uma Edge Function para deletar o usuário do auth.users
      // Por enquanto, vamos apenas remover da tabela profiles (ou dar um soft delete)
      // NOTA: Isso deve ser trocado por uma Edge Function 'delete-user'
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id);
      
      if (error) {
        setError(error.message);
      } else {
        // Remove da lista local
        setUsers(users.filter(user => user.id !== userToDelete.id));
      }
      setLoading(false);
    }
  };

  // Lógica para abrir/fechar modais
  const handleOpenEditModal = (user: Profile) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  
  const handleCloseEditModal = (shouldRefresh: boolean) => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    if (shouldRefresh) {
      fetchUsers(); // Re-busca os dados se algo foi alterado
    }
  };
  
  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
    fetchUsers(); // Re-busca os dados pois um novo usuário foi criado
  };

  // --- Classes de UI ---
  const tableBg = resolvedTheme === 'dark' ? 'bg-slate-800/50' : 'bg-white';
  const tableHeader = resolvedTheme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const tableRowHover = resolvedTheme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100';


  return (
    <div className="space-y-6">
      
      {/* Header e Barra de Pesquisa */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Gestão de Colaboradores</h1>
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
            <Input
              type="text"
              placeholder="Pesquisar por nome ou cargo..."
              className={cn(
                "pl-10 h-12",
                resolvedTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              )}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => setIsInviteModalOpen(true)}
            className="h-12 px-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/30 whitespace-nowrap"
          >
            <UserPlus className="h-5 w-5 mr-2" /> 
            Convidar Colaborador
          </Button>
        </div>
      </div>

      {/* Tabela de Colaboradores */}
      <div className={cn("overflow-hidden rounded-xl border border-slate-700 shadow-2xl", tableBg)}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            
            {/* Cabeçalho da Tabela */}
            <thead className={resolvedTheme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}>
              <tr>
                {['Colaborador', 'Cargo/Função', 'Função INspec', 'Status', 'Ações'].map(header => (
                  <th 
                    key={header}
                    scope="col"
                    className={cn(
                      "px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider",
                      tableHeader
                    )}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Corpo da Tabela */}
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    Buscando colaboradores...
                  </td>
                </tr>
              ) : error ? (
                 <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className={cn("transition-colors duration-200", tableRowHover)}>
                    
                    {/* Colaborador (Avatar + Nome) */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          className="h-10 w-10 rounded-full mr-4 border border-purple-500/50 object-cover" 
                          // ATUALIZADO: Usa avatar_url se existir, senão usa o Dicebear
                          src={user.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${user.full_name}&backgroundType=gradient&backgroundColor=a855f7,60a5fa`} 
                          alt={user.full_name || 'Avatar'}
                        />
                        <div>
                          <div className="text-sm font-medium text-white">{user.full_name || 'Nome não definido'}</div>
                          {/* O email não está na tabela 'profiles', teríamos que fazer um JOIN. Vamos remover por enquanto. */}
                        </div>
                      </div>
                    </td>
                    
                    {/* Cargo */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-white">{user.job_title || '-'}</div>
                    </td>

                    {/* Role (Função no INspec) */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize",
                        user.role === 'admin' ? 'bg-purple-600/20 text-purple-400' : 'bg-blue-600/20 text-blue-400'
                      )}>
                        {user.role || 'N/A'}
                      </span>
                    </td>

                    {/* Status de Atividade (Fixo por enquanto) */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusBadge status="offline" />
                    </td>

                    {/* Ações */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center space-x-1">
                        {/* Botão de Editar */}
                        <Button
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleOpenEditModal(user)}
                          title="Editar"
                          className={cn(
                            "h-9 w-9 p-0",
                            resolvedTheme === 'dark' 
                                ? "text-slate-400 hover:bg-slate-700 hover:text-white"
                                : "text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                          )}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        {/* Botão de Excluir */}
                        <Button
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(user)}
                          title="Excluir"
                          className={cn(
                            "h-9 w-9 p-0",
                            "text-red-500 hover:bg-red-500/10 hover:text-red-400"
                          )}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        {/* Botão de Configurações (Token) */}
                        <Button
                          variant="ghost" 
                          size="sm"
                          onClick={() => alert("Função 'Visualizar Token' ainda não implementada.")}
                          title="Gerar/Visualizar Token"
                          className={cn(
                            "h-9 w-9 p-0",
                            "text-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
                          )}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    Nenhum colaborador encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Footer da Tabela */}
      <div className="text-sm text-slate-400">
        Total de Colaboradores: {users.length}
      </div>

      {/* --- Modais --- */}
      
      {/* Modal de Convite (Existente) */}
      <UserInviteModal 
        isOpen={isInviteModalOpen}
        onClose={handleCloseInviteModal}
        availableRoles={['employee', 'admin']}
      />
      
      {/* NOVO: Modal de Edição */}
      <UserEditModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        user={selectedUser}
      />
    </div>
  );
}