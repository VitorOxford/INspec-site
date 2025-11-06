// src/pages/DashboardPage.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/dashboard/Sidebar';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext.tsx'; // Importe o hook

// Renomeado para exportação nomeada
export function DashboardPage() { 
  const { resolvedTheme } = useTheme();

  // Define as classes de fundo dinamicamente
  const mainBackgroundClass = cn(
    'flex h-screen',
    {
      // Fundo Escuro
      'bg-slate-900 text-white': resolvedTheme === 'dark',
      // Fundo Claro (Ajustar as cores para um Light Mode limpo)
      'bg-slate-50 text-slate-900': resolvedTheme === 'light',
    }
  );

  return (
    <div className={mainBackgroundClass}>
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