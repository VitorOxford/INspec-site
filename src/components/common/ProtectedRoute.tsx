// src/components/common/ProtectedRoute.tsx

import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // REMOVEMOS ESTE BLOCO PARA EVITAR TELA BRANCA/PRETA INTERMEDIÁRIA
  // if (loading) {
  //   // Você pode substituir isso por um componente de Spinner/Loading
  //   return <div className="bg-slate-950 min-h-screen" />; 
  // }


  if (!user) {
    // Usuário não logado, redireciona para a página de autenticação
    return <Navigate to="/auth" replace />;
  }

  // Usuário logado, renderiza a página solicitada
  return children;
}