// src/pages/DashboardPage.tsx
// (VERSÃO SIMPLIFICADA - SEM LOADING)

import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/dashboard/Sidebar';

// Renomeado para exportação nomeada
export function DashboardPage() { 
  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* O Menu Vertical Fixo */}
      <Sidebar />

      {/* A Área de Conteúdo Principal (scrollável) */}
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="p-8">
          {/* O <Outlet/> renderiza a "aba" (Visão Geral, Monitoramento, etc.) */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}