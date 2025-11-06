import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginSection() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { email, password });
  };

  return (
    <section id="login" className="relative py-32 bg-gradient-to-br from-purple-950 via-slate-950 to-blue-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Info */}
          <div className="text-white">
            <div className="inline-block mb-6 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
              <span className="text-sm text-purple-300">🔐 Acesso Seguro</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Acesse seu painel
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                INspec
              </span>
            </h2>

            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Gerencie sua equipe, visualize relatórios em tempo real e 
              otimize a produtividade do seu time.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {[
                "Dashboard completo com métricas em tempo real",
                "Relatórios exportáveis e personalizáveis",
                "Acesso seguro com autenticação de dois fatores",
                "Suporte técnico disponível 24/7"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Holographic Dashboard Illustration */}
            <div className="mt-12 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl blur-2xl" />
              <div className="relative bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-video bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg border border-slate-700/30 animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl" />
            
            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-2xl border border-slate-200">
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-slate-900 mb-2">Entrar</h3>
                <p className="text-slate-600">Acesse sua conta INspec</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11 h-12 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
                    <span className="text-slate-600">Lembrar de mim</span>
                  </label>
                  <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                    Esqueci minha senha
                  </a>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg font-semibold"
                >
                  Entrar
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500">ou</span>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-slate-600">
                    Ainda não tem uma conta?{" "}
                    <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold">
                      Criar conta gratuita
                    </a>
                  </p>
                </div>
              </form>

              {/* Security Badge */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <Lock className="w-4 h-4" />
                  <span>Conexão segura com criptografia SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}