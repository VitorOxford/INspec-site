// src/components/dashboard/Sidebar.tsx

// IMPORTS
import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; 
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, Monitor, Camera, Bell, Shield, Settings, LogOut, Moon, Sun 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext.tsx'; 

// ===========================================
// BLOCO FALTANTE: DEFINIÇÃO DO ARRAY menuItems
// OBRIGATÓRIO PARA RESOLVER O ReferenceError
// ===========================================
const menuItems = [
  { href: "/dashboard/overview", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/dashboard/monitoring", label: "Monitoramento", icon: Monitor },
  { href: "/dashboard/screenshots", label: "Capturas", icon: Camera },
  { href: "/dashboard/requests", label: "Solicitações", icon: Bell },
  { href: "/dashboard/rules", label: "Regras", icon: Shield },
];
// ===========================================

// Componente ThemeToggle
function ThemeToggle() {
    const { resolvedTheme, theme, setTheme } = useTheme();

    const nextTheme = theme === 'light' ? 'dark' : (theme === 'dark' ? 'system' : 'light');

    const handleClick = () => {
        setTheme(nextTheme);
    };

    const buttonClasses = cn(
        "flex-shrink-0",
        resolvedTheme === 'dark' 
            ? "text-slate-400 hover:bg-slate-700 hover:text-white"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    );

    return (
        <Button
            variant="ghost" 
            size="sm"
            className={buttonClasses}
            onClick={handleClick}
            title={`Mudar para modo ${nextTheme}`}
        >
            {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
    );
}

export default function Sidebar() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const { resolvedTheme } = useTheme(); 

  console.log(`LOG: Sidebar - Render. Profile: ${profile ? 'OK' : 'NULL'}. Full Name: ${profile?.full_name}`); // LOG DE PERFIL NA SIDEBAR

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

  // Classes Dinâmicas (início do código)
  const sidebarClasses = cn(
    "fixed inset-y-0 left-0 z-10 flex h-screen w-64 flex-col",
    resolvedTheme === 'dark' 
      ? "border-r border-slate-800 bg-slate-900"
      : "border-r border-slate-200 bg-white"
  );
  
  const separatorClasses = resolvedTheme === 'dark' ? "h-px bg-slate-800 my-2" : "h-px bg-slate-200 my-2";
  const profileTextClasses = resolvedTheme === 'dark' ? "text-sm font-medium text-white" : "text-sm font-medium text-slate-900";
  const profileRoleClasses = resolvedTheme === 'dark' ? "truncate text-xs text-slate-400" : "truncate text-xs text-slate-500";
  
  const getNavLinkClasses = (isActive: boolean) => cn(
    "group flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors",
    isActive
      ? resolvedTheme === 'dark' 
        ? "bg-slate-800 text-white" 
        : "bg-purple-100 text-purple-700" 
      : resolvedTheme === 'dark' 
        ? "text-slate-400 hover:bg-slate-800 hover:text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  );
  
  const getIconClasses = (isActive: boolean) => cn(
    "h-5 w-5 flex-shrink-0",
    isActive 
      ? resolvedTheme === 'dark' ? "text-purple-400" : "text-purple-600"
      : resolvedTheme === 'dark' ? "text-slate-500 group-hover:text-slate-300" : "text-slate-400 group-hover:text-slate-700"
  );
  
  // O restante do código do return...
  return (
    <aside className={sidebarClasses}>
      
      {/* Logo */}
      <div className={cn("flex h-20 items-center justify-center px-6", resolvedTheme === 'light' && 'border-b border-slate-200')}>
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
              className={getNavLinkClasses(isActive)}
            >
              <item.icon className={getIconClasses(isActive)} />
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
      <div className={cn("mt-auto p-4", resolvedTheme === 'dark' ? 'border-t border-slate-800' : 'border-t border-slate-200')}>
        
        {/* Link de Configurações */}
        <NavLink
          to="/dashboard/settings"
          className={getNavLinkClasses(location.pathname.startsWith("/dashboard/settings"))}
        >
          <Settings className={getIconClasses(location.pathname.startsWith("/dashboard/settings"))} />
          Configurações
        </NavLink>

        {/* Separador */}
        <div className={separatorClasses}></div>

        {/* Perfil e Logout */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0">
              <span className="flex h-full w-full items-center justify-center font-bold text-white">
                {getInitials(profile?.full_name)}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className={profileTextClasses}>
                {profile?.full_name || 'Usuário'}
              </p>
              <p className={profileRoleClasses}>
                {capitalize(profile?.role)}
              </p>
            </div>
          </div>
          
          {/* Botão de Tema (Dark/Light Mode) */}
          <ThemeToggle /> 

          {/* Botão de Logout */}
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
                "flex-shrink-0",
                resolvedTheme === 'dark' 
                    ? "text-slate-400 hover:bg-slate-700 hover:text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            )}
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