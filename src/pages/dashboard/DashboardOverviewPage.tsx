// src/pages/dashboard/DashboardOverviewPage.tsx
import React from 'react';
import StatCard from '@/components/dashboard/StatCard';
import UserGridCard from '@/components/dashboard/UserGridCard';
import RealtimeActivityChart from '@/components/dashboard/RealtimeActivityChart';
import { Users, Activity, BarChart, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// (Dados mocados por enquanto)
const mockUsers = [
  { name: 'Ana Paula', role: 'Designer UI/UX', status: 'online' as const },
  { name: 'Carlos Mendes', role: 'Desenvolvedor Front-end', status: 'online' as const },
  { name: 'Ricardo Ferreira', role: 'Gerente de Projetos', status: 'idle' as const },
  { name: 'Juliana Costa', role: 'Analista de Marketing', status: 'offline' as const },
  { name: 'Bruno Silva', role: 'Desenvolvedor Back-end', status: 'online' as const },
  { name: 'Fernanda Lima', role: 'Analista de QA', status: 'idle' as const },
];

export default function DashboardOverviewPage() {
  const { profile } = useAuth();

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Bem-vindo, {profile?.full_name ? profile.full_name.split(' ')[0] : 'Admin'}!
        </h1>
        <p className="mt-1 text-slate-400">
          Aqui está um resumo da atividade da sua equipe hoje.
        </p>
      </div>

      {/* 1. Cards de Estatísticas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Colaboradores Online" 
          value="3 / 6" 
          icon={Users} 
          colorClass="text-green-500" 
        />
        <StatCard 
          title="Em Atividade" 
          value="2" 
          icon={Activity} 
          colorClass="text-blue-500" 
        />
        <StatCard 
          title="Produtividade Média" 
          value="84%" 
          icon={BarChart} 
          colorClass="text-purple-500" 
        />
        <StatCard 
          title="Horas Registradas (Hoje)" 
          value="18.5h" 
          icon={Clock} 
          colorClass="text-yellow-500" 
        />
      </div>

      {/* 2. Grid de Miniaturas de Colaboradores */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-4">Colaboradores</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {mockUsers.map((user) => (
            <UserGridCard 
              key={user.name}
              name={user.name}
              role={user.role}
              status={user.status}
              // thumbnailUrl="url_da_imagem_real_aqui"
            />
          ))}
        </div>
      </div>

      {/* 3. Gráfico em Tempo Real */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-4">Atividade em Tempo Real</h2>
        <RealtimeActivityChart />
      </div>
    </div>
  );
}