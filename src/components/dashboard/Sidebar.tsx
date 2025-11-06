// src/components/dashboard/Sidebar.tsx
import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Puxa o hook de autenticação
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, Monitor, Camera, Bell, Shield, Settings, LogOut, ChevronDown 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Itens do menu
const menuItems = [
  { href: "/dashboard/overview", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/dashboard/monitoring", label: "Monitoramento", icon: Monitor },
  { href: "/dashboard/screenshots", label: "Capturas", icon: Camera },
  { href: "/dashboard/requests", label: "Solicitações", icon: Bell },
  { href: "/dashboard/rules", label: "Regras", icon: Shield },
];

export default function Sidebar() {
  // 1. PUXANDO O 'profile' DO CONTEXTO
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const getInitials = (name: string | undefined) => {
    if (!name) return 'A';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const capitalize = (s: string | undefined) => {
    if (!s) return 'Admin';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900">
      
      {/* Logo */}
      <div className="flex h-20 items-center justify-center px-6">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
            <span className="text-xl font-bold text-white">IN</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            spec
          </span>
        </Link>
      </div>

      {/* Links de Navegação */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors", // Bordas arredondadas
                isActive
                  ? "bg-slate-800 text-white" // Sem borda, fundo sólido
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 flex-shrink-0",
                isActive ? "text-purple-400" : "text-slate-500 group-hover:text-slate-300"
              )} />
              {item.label}
              {item.label === "Solicitações" && (
                <span className="ml-auto inline-block rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                  3
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Menu de Configurações e Perfil (movido para baixo) */}
      <div className="mt-auto border-t border-slate-800 p-4">
        {/* Link de Configurações */}
        <NavLink
          to="/dashboard/settings"
          className={cn(
            "group flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors mb-2",
            location.pathname.startsWith("/dashboard/settings")
              ? "bg-slate-800 text-white"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          )}
        >
          <Settings className={cn(
            "h-5 w-5 flex-shrink-0",
            location.pathname.startsWith("/dashboard/settings") ? "text-purple-400" : "text-slate-500 group-hover:text-slate-300"
          )} />
          Configurações
        </NavLink>

        {/* Separador */}
        <div className="h-px bg-slate-800 my-2"></div>

        {/* Perfil e Logout */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0">
              <span className="flex h-full w-full items-center justify-center font-bold text-white">
                {/* 2. USA O 'profile' PARA AS INICIAIS */}
                {getInitials(profile?.full_name)}
              </span>
            </div>
            <div className="overflow-hidden">
              {/* 3. USA O 'profile' PARA O NOME E CARGO */}
              <p className="truncate text-sm font-medium text-white">
                {profile?.full_name || 'Usuário'}
              </p>
              <p className="truncate text-xs text-slate-400">
                {capitalize(profile?.role)}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" // Mais sutil
            size="sm" 
            className="flex-shrink-0 text-slate-400 hover:bg-slate-700 hover:text-white"
            onClick={signOut}
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}