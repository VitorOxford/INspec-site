// src/App.tsx
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

function App() {
  const { user, loading: authLoading } = useAuth();
  
  // CORREÇÃO: Usar o LoadingScreen que preenche a tela
  if (authLoading) {
    // Retorna a tela de loading visualmente agradável
    return <LoadingScreen isLoading={true} onLoaded={() => {}} />; 
  }

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
            {/* O DashboardWrapper deve estar com o LoadingScreen comentado 
                para evitar loops, já que App.tsx agora lida com o loading inicial. */}
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
        <Route path="settings" element={<DashboardSettingsPage />} />
        
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Route>

      {/* Fallback global */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;