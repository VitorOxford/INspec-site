// src/pages/AuthPage.tsx
// VERSÃO CORRIGIDA - Baseada na imagem image_f786c7.jpg

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Ícone do Google ---
const GoogleIcon = () => (
  <svg className="mr-3 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
  </svg>
);

// --- Componente de Input com Ícone (Reutilizado) ---
interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
            "absolute top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 transition-colors group-focus-within:text-purple-400",
            iconPosition === 'left' ? "left-3" : "right-3",
            clickableIcon && "cursor-pointer hover:text-slate-300"
          )}
          onClick={onIconClick}
        />
        <Input
          ref={ref}
          className={cn(
            "h-12 bg-slate-800/50 border-slate-700 focus:border-purple-500 focus:ring-purple-500",
            iconPosition === 'left' ? "pl-11" : "pr-11",
            className
          )}
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
  const navigate = useNavigate();

  // Handler para Login com E-mail
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler para Login Social (OAuth)
  const handleOAuthLogin = async (provider: 'google') => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;
    } catch (err: any) {
      setError(err.error_description || err.message);
      setLoading(false);
    }
  };

  return (
    // Layout principal com grid, sem scroll
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-slate-950 text-slate-300">
      
      {/* Coluna 1: Lado Esquerdo (Estático) */}
      <div className="hidden lg:flex items-center justify-center p-12 bg-gradient-to-br from-purple-950 via-slate-950 to-blue-950">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          INspec Monitor
        </h1>
      </div>

      {/* Coluna 2: Formulário de Login */}
      <div className="flex items-center justify-center p-6 sm:p-12 min-h-screen bg-slate-900">
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
            <h1 className="text-3xl font-bold text-white">
              Acesse sua conta
            </h1>
            <p className="text-slate-400 mt-2">
              Bem-vindo de volta! Insira seus dados.
            </p>
          </div>

          {/* Botão Google */}
          <Button
            variant="outline"
            className="w-full h-12 text-base bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:text-white"
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
          >
            <GoogleIcon /> Continuar com Google
          </Button>

          {/* Divisor "OU" */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500">
                OU CONTINUE COM
              </span>
            </div>
          </div>

          {/* Formulário Email/Senha */}
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-slate-300">E-mail</Label>
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
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-300">Senha</Label>
                <Link to="#" className="text-sm font-medium text-purple-400 hover:text-purple-300">
                  Esqueceu a senha?
                </Link>
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
            
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

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
            <p className="text-slate-400">
              Não tem uma conta?{" "}
              <Link
                to="/signup"
                className="font-semibold text-purple-400 hover:text-purple-300"
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