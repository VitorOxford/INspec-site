// src/pages/SignUpPage.tsx
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input, type InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Mail, Lock, User, Building, Briefcase, Phone, Info, Search, 
  CheckCircle, ArrowRight, ArrowLeft 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from '@/contexts/ThemeContext'; // NOVO: Importe o hook de tema

// --- Componentes de UI Internos (Tema-Aware) ---

// 1. Input com Ícone
interface IconInputProps extends InputProps {
  icon: React.ElementType;
}

const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  ({ icon: Icon, className, ...props }, ref) => {
    return (
      <div className="relative group">
        <Icon className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 transition-colors", 
            "group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400"
        )} />
        <Input
          ref={ref}
          className={cn(
            "pl-11 h-12",
            // Light Mode
            "bg-white border-slate-300 text-slate-900 focus:border-purple-500",
            // Dark Mode
            "dark:bg-slate-800/50 dark:border-slate-700 dark:text-white dark:focus:border-purple-500",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

// 2. Select Estilizado
interface StyledSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon: React.ElementType;
  options: { value: string; label: string }[];
}

const StyledSelect = React.forwardRef<HTMLSelectElement, StyledSelectProps>(
  ({ icon: Icon, className, options, ...props }, ref) => {
    return (
      <div className="relative group">
        <Icon className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 transition-colors", 
            "group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400"
        )} />
        <select
          ref={ref}
          className={cn(
            "flex h-12 w-full appearance-none rounded-md pl-11 pr-10 py-2 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-purple-500",
            
            // Light Mode
            "bg-white border-slate-300 text-slate-900 focus:border-purple-500",
            
            // Dark Mode
            "dark:bg-slate-800/50 dark:border-slate-700 dark:text-white dark:focus:border-purple-500",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} 
              className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" // Otimiza a cor das opções
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg className="h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>
    );
  }
);

// --- Listas de Opções (Inalteradas) ---
const TamanhoEmpresa = [
  { value: "", label: "Selecione o tamanho" },
  { value: "1-10", label: "1-10 funcionários" },
  { value: "11-50", label: "11-50 funcionários" },
  { value: "51-200", label: "51-200 funcionários" },
  { value: "201-500", label: "201-500 funcionários" },
  { value: "501+", label: "501+ funcionários" },
];

const RamoAtividade = [
  { value: "", label: "Selecione o ramo" },
  { value: "tecnologia", label: "Tecnologia, TI, Software" },
  { value: "agencia", label: "Agência de Marketing/Publicidade" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "varejo", label: "Varejo (Físico ou Online)" },
  { value: "saude", label: "Saúde e Bem-estar" },
  { value: "financeiro", label: "Financeiro e Contabilidade" },
  { value: "juridico", label: "Jurídico / Advocacia" },
  { value: "educacao", label: "Educação" },
  { value: "industria", label: "Indústria e Manufatura" },
  { value: "construcao", label: "Construção e Engenharia" },
  { value: "logistica", label: "Logística e Transporte" },
  { value: "telecom", label: "Telecomunicações" },
  { value: "consultoria", label: "Consultoria e Serviços B2B" },
  { value: "outro", label: "Outro" },
];

const OndeConheceu = [
  { value: "", label: "Como nos encontrou?" },
  { value: "google", label: "Google / Busca" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram / Facebook" },
  { value: "indicacao", label: "Indicação de colega" },
  { value: "evento", label: "Evento / Feira" },
  { value: "outro", label: "Outro" },
];

// --- Tipos de Dados (Inalterados) ---
type FormData = {
  fullName: string;
  email: string;
  password: string;
  companySize: string;
  industry: string;
  jobTitle: string;
  phone: string;
  document: string; // CPF ou CNPJ
  source: string;
};

// --- Componente Principal da Página (Tema-Aware) ---
export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: "", email: "", password: "", companySize: "", industry: "",
    jobTitle: "", phone: "", document: "", source: ""
  });

  const { resolvedTheme } = useTheme(); // NOVO: Use o tema resolvido

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validação final (simplificada)
    if (step < totalSteps) return; // Garante que o submit só funciona no último passo
    
    if (!formData.phone || !formData.source) {
      setError("Por favor, preencha os campos obrigatórios.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            company_size: formData.companySize,
            industry: formData.industry,
            job_title: formData.jobTitle,
            phone: formData.phone,
            document: formData.document,
            source: formData.source,
          }
        }
      });
      if (error) throw error;
      setLoading(false);
      nextStep(); // Vai para a etapa de Sucesso (Step 4)

    } catch (err: any) {
      setError(err.error_description || err.message);
      setLoading(false);
    }
  };

  const totalSteps = 3;

  // Classes Dinâmicas de Layout
  const mainBgClass = resolvedTheme === 'dark' 
    ? 'from-purple-950 via-slate-950 to-blue-950 text-slate-100' 
    : 'from-purple-50 via-white to-blue-50 text-slate-900';
  
  const cardClasses = resolvedTheme === 'dark'
    ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-700 shadow-2xl'
    : 'bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl';
    
  const textPrimary = resolvedTheme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = resolvedTheme === 'dark' ? 'text-slate-300' : 'text-slate-600';
  const textLabel = resolvedTheme === 'dark' ? 'text-slate-300' : 'text-slate-700';
  const barBg = resolvedTheme === 'dark' ? 'bg-slate-700' : 'bg-slate-200';


  return (
    <div className={cn("min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br", mainBgClass)}>
      
      {/* Card Principal */}
      <div className={cn("relative w-full max-w-2xl rounded-2xl p-8 md:p-12 transition-all duration-500", cardClasses)}>
        
        {/* Logo Flutuante */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <Link to="/" className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full border-4 border-slate-900 shadow-lg">
            <span className="text-white font-bold text-3xl">IN</span>
          </Link>
        </div>

        {/* Formulário Multi-Etapas */}
        <form onSubmit={handleSubmit} className="pt-12">
          
          {/* ETAPA 4: SUCESSO */}
          {step === 4 ? (
            <div className="text-center transition-opacity duration-300 animate-fadeIn">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h2 className={cn("text-3xl font-bold mb-4", textPrimary)}>
                Cadastro enviado!
              </h2>
              <p className={cn("text-lg mb-8", textSecondary)}>
                Enviamos um link de confirmação para <strong className="text-purple-600 dark:text-purple-400">{formData.email}</strong>.
                Por favor, verifique sua caixa de entrada (e spam) para ativar sua conta.
              </p>
              <Link to="/auth">
                <Button className="h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Ir para o Login
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Stepper (Barra de Progresso) */}
              <div className="mb-8">
                <p className="text-sm text-slate-500 mb-2">
                  Etapa {step} de {totalSteps}
                </p>
                <div className={cn("w-full rounded-full h-2", barBg)}>
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              {/* Título da Etapa */}
              <h2 className={cn("text-3xl font-bold mb-6 text-center", textPrimary)}>
                {step === 1 && "Vamos começar"}
                {step === 2 && "Sobre sua empresa"}
                {step === 3 && "Quase lá..."}
              </h2>

              {/* Mensagem de Erro Global */}
              {error && <p className="text-sm text-red-500 mb-4 text-center">{error}</p>}

              {/* --- ETAPA 1: Conta --- */}
              {step === 1 && (
                <div className="space-y-4 transition-opacity duration-300 animate-fadeIn">
                  <div>
                    <Label htmlFor="fullName" className={textLabel}>Nome Completo</Label>
                    <IconInput icon={User} name="fullName" id="fullName" type="text" placeholder="Seu nome"
                      value={formData.fullName} onChange={handleInput} required />
                  </div>
                  <div>
                    <Label htmlFor="email" className={textLabel}>E-mail</Label>
                    <IconInput icon={Mail} name="email" id="email" type="email" placeholder="seu@email.com"
                      value={formData.email} onChange={handleInput} required />
                  </div>
                  <div>
                    <Label htmlFor="password" className={textLabel}>Senha</Label>
                    <IconInput icon={Lock} name="password" id="password" type="password" placeholder="••••••••"
                      value={formData.password} onChange={handleInput} required minLength={6} />
                  </div>
                </div>
              )}

              {/* --- ETAPA 2: Empresa --- */}
              {step === 2 && (
                <div className="space-y-4 transition-opacity duration-300 animate-fadeIn">
                  <div>
                    <Label htmlFor="companySize" className={textLabel}>Tamanho da Empresa</Label>
                    <StyledSelect icon={Building} name="companySize" id="companySize"
                      value={formData.companySize} onChange={handleInput} required
                      options={TamanhoEmpresa} />
                  </div>
                  <div>
                    <Label htmlFor="industry" className={textLabel}>Ramo de Atividade</Label>
                    <StyledSelect icon={Briefcase} name="industry" id="industry"
                      value={formData.industry} onChange={handleInput} required
                      options={RamoAtividade} />
                  </div>
                  <div>
                    <Label htmlFor="jobTitle" className={textLabel}>Seu Cargo</Label>
                    <IconInput icon={Info} name="jobTitle" id="jobTitle" type="text" placeholder="Ex: Diretor de TI, Gerente de RH"
                      value={formData.jobTitle} onChange={handleInput} required />
                  </div>
                </div>
              )}
              
              {/* --- ETAPA 3: Contato --- */}
              {step === 3 && (
                <div className="space-y-4 transition-opacity duration-300 animate-fadeIn">
                  <div>
                    <Label htmlFor="phone" className={textLabel}>Telefone / WhatsApp</Label>
                    <IconInput icon={Phone} name="phone" id="phone" type="tel" placeholder="(11) 99999-9999"
                      value={formData.phone} onChange={handleInput} required />
                  </div>
                  <div>
                    <Label htmlFor="document" className={textLabel}>CPF / CNPJ (Opcional)</Label>
                    <IconInput icon={Info} name="document" id="document" type="text" placeholder="Seu CPF ou CNPJ"
                      value={formData.document} onChange={handleInput} />
                  </div>
                  <div>
                    <Label htmlFor="source" className={textLabel}>Onde nos conheceu?</Label>
                    <StyledSelect icon={Search} name="source" id="source"
                      value={formData.source} onChange={handleInput} required
                      options={OndeConheceu} />
                  </div>
                </div>
              )}
              
              {/* Botões de Navegação */}
              <div className="flex items-center justify-between mt-10">
                <Button 
                  type="button" 
                  variant="outline"
                  // Classes responsivas para o botão Voltar
                  className={cn(
                    "hover:shadow-lg transition-all",
                    resolvedTheme === 'dark' 
                        ? "border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                        : "border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                    step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  )}
                  onClick={prevStep}
                  disabled={step === 1}
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> Voltar
                </Button>

                {step < totalSteps && (
                  <Button 
                    type="button" 
                    className="h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={nextStep}
                  >
                    Próximo <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}

                {step === totalSteps && (
                  <Button 
                    type="submit" 
                    className="h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    disabled={loading}
                  >
                    {loading ? "Finalizando..." : "Finalizar Cadastro"}
                    {!loading && <CheckCircle className="ml-2 h-5 w-5" />}
                  </Button>
                )}
              </div>
            </>
          )}

        </form>
      </div>

      {/* CSS para animação de fade-in */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}