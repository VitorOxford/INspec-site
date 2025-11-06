// src/pages/DashboardWrapper.tsx
import { DashboardPage } from './DashboardPage';
import { useAuth } from '@/contexts/AuthContext'; 
import LoadingScreen from '@/components/common/LoadingScreen'; 
import { AlertTriangle } from 'lucide-react';

/**
 * Este componente "wrapper" existe para lidar com o
 * carregamento inicial e garantir que o perfil do usuário foi carregado.
 */
export default function DashboardWrapper() {
  const { loading, profile, user, signOut } = useAuth(); 
  
  console.log(`LOG: DashboardWrapper - Render. Loading: ${loading}. User: ${!!user}. Profile: ${!!profile}`); 

  // Se estiver carregando, sempre mostra a tela de loading.
  if (loading) { 
    return <LoadingScreen isLoading={true} onLoaded={() => {}} />;
  }
  
  // CRITICAL CHECK: Se não está carregando (loading: false), mas o usuário está logado (user: true)
  // e o perfil é explicitamente nulo (profile: null), é um erro irrecuperável do servidor.
  if (user && !profile) {
    console.log("LOG: DashboardWrapper - RETORNA ERRO CRÍTICO (Perfil Ausente/DB Loop)");
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-900 text-white">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-lg font-semibold mb-2">
            Falha Crítica: Erro de Recursão no Banco de Dados (500)
        </p>
        <p className="text-slate-400 mb-6">
            O servidor está retornando um erro de loop. Por favor, verifique os Logs de Funções/Triggers do Supabase.
        </p>
        <button
            onClick={signOut}
            className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition-colors"
        >
            Sair (Logout)
        </button>
      </div>
    );
  }

  // Se tudo estiver OK (loading: false, user: true, profile: true)
  console.log("LOG: DashboardWrapper - RETORNA DASHBOARD PAGE");
  return <DashboardPage />;
}