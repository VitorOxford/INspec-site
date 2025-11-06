import React from "react";
import { BarChart3, Lock, Globe, FileText, Brain, Settings } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: BarChart3,
      title: "Painel de métricas em tempo real",
      description: "Visualize todas as atividades da equipe com dashboards intuitivos e atualizados instantaneamente."
    },
    {
      icon: Lock,
      title: "Criptografia ponta a ponta",
      description: "Segurança máxima com criptografia de nível empresarial em todas as transmissões e armazenamentos."
    },
    {
      icon: Globe,
      title: "Transmissão TURN/WebRTC otimizada",
      description: "Tecnologia de streaming de última geração com baixa latência e alta qualidade visual."
    },
    {
      icon: FileText,
      title: "Relatórios semanais e mensais",
      description: "Análises detalhadas e exportáveis para acompanhar evolução e tendências da equipe."
    },
    {
      icon: Brain,
      title: "IA de detecção de distração",
      description: "Inteligência artificial identifica padrões de comportamento e sugere melhorias de produtividade."
    },
    {
      icon: Settings,
      title: "Integração com ERP e Active Directory",
      description: "Conecte-se facilmente aos seus sistemas existentes para gestão unificada de usuários."
    }
  ];

  return (
    <section id="recursos" className="relative py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Recursos avançados
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Tudo que você precisa para monitoramento inteligente e gestão eficiente
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-2xl p-8 border border-slate-200 hover:border-purple-300 transition-all hover:shadow-xl hover:-translate-y-1 duration-300"
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Decorative Element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity -z-10" />
            </div>
          ))}
        </div>

        {/* Additional Info Banner */}
        <div className="mt-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Precisa de recursos personalizados?
              </h3>
              <p className="text-slate-600">
                Nosso plano Enterprise inclui desenvolvimento sob medida para suas necessidades específicas.
              </p>
            </div>
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all whitespace-nowrap">
              Falar com especialista
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}