// src/pages/AuthPage.tsx
// VERSÃO COMPLETA com Dark/Light Mode e Recuperação de Senha

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input, type InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from '@/contexts/ThemeContext'; // Importe o hook de tema

// --- Ícone do Google ---
const GoogleIcon = () => (
  <svg className="mr-3 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
  </svg>
);

// --- Componente de Input com Ícone (Tema-Aware) ---
interface IconInputProps extends InputProps {
  icon: React.ElementType;
  iconPosition?: 'left' | 'right';
  onIconClick?: () => void;
  clickableIcon?: boolean;
}

const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  ({ icon: Icon, className, iconPosition = 'left', onIconClick, clickableIcon, ...props }, ref) => {
    return (
      <div className="relative group">
        <Icon
          className={cn(
            "absolute top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 transition-colors",
            "group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400",
            iconPosition === 'left' ? "left-3" : "right-3",
            clickableIcon && "cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
          )}
          onClick={onIconClick}
        />
        <Input
          ref={ref}
          className={cn(
            "h-12 pl-11 pr-11", // Paddings fixos
            // Light Mode
            "bg-white border-slate-300 text-slate-900 focus:border-purple-500",
            // Dark Mode
            "dark:bg-slate-800/50 dark:border-slate-700 dark:text-white dark:focus:border-purple-500",
            className
          )}
          // CORREÇÃO: Usar 'autoComplete' (camelCase)
          // Adicionado 'username' para o email e 'current-password' para a senha, conforme sugestão do console
          {...(props.type === 'password' && { autoComplete: 'current-password' })}
          {...(props.name === 'email' && { autoComplete: 'username' })}
          {...props}
        />
      </div>
    );
  }
);


export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null); // NOVO: Estado de feedback
  const navigate = useNavigate();
  
  const { resolvedTheme } = useTheme(); 

  // Handler para Login com E-mail
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Credenciais inválidas. Verifique seu e-mail e senha.");
        throw error;
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.error_description || err.message || "Falha desconhecida no login.");
    } finally {
      setLoading(false);
    }
  };

  // NOVO: Handler para Esqueci minha senha
  const handleForgotPassword = async () => {
    setError(null);
    setFeedback(null);

    if (!email) {
      setError("Por favor, digite seu e-mail no campo acima.");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // Redireciona para uma página de sucesso após redefinição (ou para o próprio login)
        redirectTo: `${window.location.origin}/auth` 
      });

      if (error) {
        setFeedback({
            message: "Falha ao enviar link. Verifique o e-mail digitado.",
            isError: true,
        });
        throw error;
      }

      setFeedback({
        message: "Link de redefinição enviado! Verifique sua caixa de entrada e spam.",
        isError: false,
      });

    } catch (err: any) {
      // Supabase retorna erro 404 se o e-mail não existir, mas tratamos de forma genérica para segurança.
      console.error("Forgot Password Error:", err.message);
    }
  };
  
  // Handler para Login Social (OAuth)
  const handleOAuthLogin = async (provider: 'google') => {
    setLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider,
        options: {
            redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.error_description || err.message);
      setLoading(false);
    }
  };

  // Classes Dinâmicas de Layout
  const mainBgClass = resolvedTheme === 'dark' 
    ? 'bg-slate-950 text-slate-300' 
    : 'bg-white text-slate-900';
    
  const loginColBg = resolvedTheme === 'dark'
    ? 'bg-slate-900' 
    : 'bg-slate-50'; 

  const headingText = resolvedTheme === 'dark' ? 'text-white' : 'text-slate-900';
  const subheadingText = resolvedTheme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const dividerBorder = resolvedTheme === 'dark' ? 'border-t border-slate-700' : 'border-t border-slate-300';
  const dividerTextBg = resolvedTheme === 'dark' ? 'bg-slate-900' : 'bg-slate-50';

  return (
    // Layout principal com grid, usando classes dinâmicas
    <div className={cn("min-h-screen w-full grid grid-cols-1 lg:grid-cols-2", mainBgClass)}>
      
      {/* Coluna 1: Lado Esquerdo (Fundo Fixo com Gradiente) */}
      <div className="hidden lg:flex items-center justify-center p-12 bg-gradient-to-br from-purple-950 via-slate-950 to-blue-950">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          INspec Monitor
        </h1>
      </div>

      {/* Coluna 2: Formulário de Login */}
      <div className={cn("flex items-center justify-center p-6 sm:p-12 min-h-screen", loginColBg)}>
        <div className="mx-auto w-full max-w-sm space-y-7">
          
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">IN</span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                spec
              </span>
            </Link>
          </div>

          {/* Cabeçalho */}
          <div className="text-center">
            <h1 className={cn("text-3xl font-bold", headingText)}>
              Acesse sua conta
            </h1>
            <p className={cn("mt-2", subheadingText)}>
              Bem-vindo de volta! Insira seus dados.
            </p>
          </div>

          {/* Botão Google */}
          <Button
            variant="outline"
            className={cn(
                "w-full h-12 text-base font-medium",
                // Light Mode
                "bg-white border-slate-300 hover:bg-slate-100 text-slate-700",
                // Dark Mode
                "dark:bg-slate-800/50 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-white"
            )}
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
          >
            <GoogleIcon /> Continuar com Google
          </Button>

          {/* Divisor "OU" */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className={dividerBorder} />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className={cn("px-2 text-slate-500", dividerTextBg)}>
                OU CONTINUE COM
              </span>
            </div>
          </div>

          {/* Formulário Email/Senha */}
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <Label htmlFor="email" className={resolvedTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>E-mail</Label>
              <IconInput 
                icon={Mail} 
                name="email" 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
                autocomplete="username" // Sugerido pelo console
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className={resolvedTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>Senha</Label>
                
                {/* Botão Esqueci a Senha (Funcionalidade de Redefinição) */}
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <IconInput 
                icon={showPassword ? EyeOff : Eye}
                iconPosition="right"
                clickableIcon={true}
                onIconClick={() => setShowPassword(!showPassword)}
                name="password" 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2"
              />
            </div>
            
            {/* Exibir Erro de Login ou Mensagem de Redefinição */}
            {(error || feedback) && (
              <p className={cn("text-sm text-center", (error || feedback?.isError) ? "text-red-500" : "text-green-500")}>
                {error || feedback?.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={loading}
            >
              {loading ? "Carregando..." : "Entrar"}
              {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>

          {/* Link de Cadastro */}
          <div className="text-center text-sm">
            <p className={subheadingText}>
              Não tem uma conta?{" "}
              <Link
                to="/signup"
                className="font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
              >
                Cadastre-se
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}