// src/components/dashboard/UserManagementTable.tsx

import React, { useState } from 'react';
import { 
  Plus, Search, Edit, Trash2, UserPlus, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
// IMPORTAÇÃO CORRETA DO MODAL (DO NOVO ARQUIVO)
import UserInviteModal from './UserInviteModal'; 

// --- Tipos e Dados Mockados ---

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  jobTitle: string;
  status: 'online' | 'idle' | 'offline';
  lastActivity: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'Ana Paula Silva', email: 'ana@empresa.com', role: 'admin', jobTitle: 'Diretora de Operações', status: 'online', lastActivity: 'Agora mesmo' },
  { id: '2', name: 'Carlos Mendes', email: 'carlos@empresa.com', role: 'employee', jobTitle: 'Desenvolvedor Front-end', status: 'idle', lastActivity: 'Há 5 min' },
  { id: '3', name: 'Ricardo Ferreira', email: 'ricardo@empresa.com', role: 'employee', jobTitle: 'Analista de QA', status: 'offline', lastActivity: '08:00' },
  { id: '4', name: 'Juliana Costa', email: 'juliana@empresa.com', role: 'employee', jobTitle: 'Designer UI/UX', status: 'online', lastActivity: 'Há 1 min' },
  { id: '5', name: 'Bruno Silva', email: 'bruno@empresa.com', role: 'employee', jobTitle: 'Desenvolvedor Back-end', status: 'idle', lastActivity: '14:30' },
];


// --- Sub-Componentes de UI ---

const StatusBadge: React.FC<{ status: User['status'] }> = ({ status }) => {
  const baseClasses = "flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full";
  let statusClasses = '';
  let dotClass = '';
  let label = '';

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
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // NOVO ESTADO DO MODAL
  const { resolvedTheme } = useTheme();

  // Filtra usuários com base no termo de pesquisa
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableBg = resolvedTheme === 'dark' ? 'bg-slate-800/50' : 'bg-white';
  const tableHeader = resolvedTheme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const tableRowHover = resolvedTheme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100';


  // Lógica de Ação (Placeholder)
  const handleEdit = (id: string) => console.log('Editar usuário:', id);
  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este colaborador?')) {
      setUsers(users.filter(user => user.id !== id));
      console.log('Excluir usuário:', id);
    }
  };
  // ATUALIZAÇÃO: Abre o Modal
  const handleInvite = () => setIsModalOpen(true); 


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
              placeholder="Pesquisar por nome ou email..."
              className={cn(
                "pl-10 h-12",
                resolvedTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              )}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Botão Big Tech - Ação Principal (Abre o Modal) */}
          <Button 
            onClick={handleInvite}
            className="h-12 px-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/30 whitespace-nowrap"
          >
            <UserPlus className="h-5 w-5 mr-2" /> 
            Convidar Colaborador
          </Button>
        </div>
      </div>

      {/* Tabela de Colaboradores (Agora um "Cartão" mais limpo) */}
      <div className={cn("overflow-hidden rounded-xl border border-slate-700 shadow-2xl", tableBg)}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            
            {/* Cabeçalho da Tabela */}
            <thead className={resolvedTheme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}>
              <tr>
                {/* <th>Email</th> removido para simplificar o cabeçalho */}
                {['Colaborador', 'Cargo/Função', 'Função INspec', 'Status', 'Última Atividade', 'Ações'].map(header => (
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className={cn("transition-colors duration-200", tableRowHover)}>
                    
                    {/* Nome e Email (Combinados) */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          className="h-10 w-10 rounded-full mr-4 border border-purple-500/50" 
                          src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.name}&backgroundType=gradient&backgroundColor=a855f7,60a5fa`} 
                          alt={user.name} 
                        />
                        <div>
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-xs text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Cargo */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-white">{user.jobTitle}</div>
                    </td>

                    {/* Role (Função no INspec) */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                        user.role === 'admin' ? 'bg-purple-600/20 text-purple-400' : 'bg-blue-600/20 text-blue-400'
                      )}>
                        {user.role === 'admin' ? 'Administrador' : 'Colaborador'}
                      </span>
                    </td>

                    {/* Status de Atividade */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusBadge status={user.status} />
                    </td>

                    {/* Última Atividade */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-400">
                      {user.lastActivity}
                    </td>

                    {/* Ações (Botões Pequenos e Espaçados - Big Tech Style) */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center space-x-1"> {/* Reduzido o espaço */}
                        {/* Botão de Editar */}
                        <Button
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(user.id)}
                          title="Editar"
                          className={cn(
                            "h-9 w-9 p-0", // Ligeiramente maior para clique
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
                          onClick={() => handleDelete(user.id)}
                          title="Excluir"
                          className={cn(
                            "h-9 w-9 p-0",
                            "text-red-500 hover:bg-red-500/10 hover:text-red-400"
                          )}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        {/* Botão de Configurações (Token/Reassociação) */}
                        <Button
                          variant="ghost" 
                          size="sm"
                          onClick={() => console.log(`Gerar token para ${user.name}`)}
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
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
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

      {/* MODAL DE CONVITE */}
      <UserInviteModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableRoles={['employee', 'admin']}
      />
    </div>
  );
}