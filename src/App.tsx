// src/App.tsx
import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import SignUpPage from './pages/SignUpPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import { useAuth } from './contexts/AuthContext'
import DashboardWrapper from './pages/DashboardWrapper'; 

// NOVO: Importe o LoadingScreen para uso global
import LoadingScreen from './components/common/LoadingScreen'; 

import DashboardOverviewPage from './pages/dashboard/DashboardOverviewPage'
import DashboardMonitoringPage from './pages/dashboard/DashboardMonitoringPage'
import DashboardScreenshotsPage from './pages/dashboard/DashboardScreenshotsPage'
import DashboardRequestsPage from './pages/dashboard/DashboardRequestsPage'
import DashboardRulesPage from './pages/dashboard/DashboardRulesPage'
import DashboardSettingsPage from './pages/dashboard/DashboardSettingsPage'
import DashboardUsersPage from './pages/dashboard/DashboardUsersPage'



function App() {
  const { user, loading: authLoading } = useAuth();
  
  // NOVO ESTADO: Controla a transição visual
  const [loadingComplete, setLoadingComplete] = useState(false); 

  console.log(`LOG: APP - Render. AuthLoading: ${authLoading}. LoadingComplete: ${loadingComplete}.`);

  // HOOK: Garante que o estado de transição seja resetado
  useEffect(() => {
    console.log(`LOG: APP - useEffect [authLoading] rodou. Novo authLoading: ${authLoading}.`);
    // Se o Auth loading for reativado, resetamos o estado visual
    if (authLoading && loadingComplete) {
        console.log('LOG: APP - authLoading TRUE e loadingComplete TRUE. RESETANDO VISUAL.');
        setLoadingComplete(false);
    }
  }, [authLoading, loadingComplete]);


  // CORREÇÃO: Usa o LoadingScreen enquanto o AuthContext carrega OU enquanto a transição visual não está pronta.
  if (authLoading || !loadingComplete) {
  console.log('LOG: APP - Retornando LoadingScreen.');
  return (
    <LoadingScreen 
      key={authLoading ? 'auth-loading' : 'auth-done'}  // 👈 força remontagem quando muda
      isLoading={authLoading} 
      onLoaded={() => {
        console.log('LOG: APP - onLoaded() chamado pelo LoadingScreen. Disparando setLoadingComplete(true).');
        setTimeout(() => setLoadingComplete(true), 100);
      }}
    />
  );
}

  console.log('LOG: APP - Retornando Rota Principal (Dashboard/Public).');
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/auth" 
        element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
      />
      <Route 
        path="/signup" 
        element={user ? <Navigate to="/dashboard" replace /> : <SignUpPage />} 
      />
      
      {/* Rota Protegida do Dashboard (O Casco) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardWrapper />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="overview" replace />} /> 
        <Route path="overview" element={<DashboardOverviewPage />} />
        <Route path="monitoring" element={<DashboardMonitoringPage />} />
        <Route path="screenshots" element={<DashboardScreenshotsPage />} />
        <Route path="requests" element={<DashboardRequestsPage />} />
        <Route path="rules" element={<DashboardRulesPage />} />
        <Route path="users" element={<DashboardUsersPage />} />
        <Route path="settings" element={<DashboardSettingsPage />} />
        
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Route>

      {/* Fallback global */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;