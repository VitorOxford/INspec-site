// src/pages/DashboardWrapper.tsx
import { DashboardPage } from './DashboardPage';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useState, useCallback } from 'react';

/**
 * Este componente "wrapper" existe APENAS para lidar com o
 * carregamento inicial do dashboard.
 */
export default function DashboardWrapper() {
  const [isPreparing, setIsPreparing] = useState(true);

  // Memoiza a função para que ela seja estável e não recrie
  const handleLoadingComplete = useCallback(() => {
    setIsPreparing(false);
  }, []);

  // Se estiver preparando, mostra o LoadingScreen
  if (isPreparing) {
    return <LoadingScreen isLoading={true} onLoaded={handleLoadingComplete} />;
  }

  // Quando terminar, mostra o DashboardPage (o casco)
  return <DashboardPage />;
}