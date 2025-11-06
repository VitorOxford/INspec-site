import React from "react";
import { Monitor, Brain, Shield } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Monitor,
      title: "Captura inteligente de tela via WebRTC",
      description: "Acompanhe em tempo real o que acontece nos computadores da empresa.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Brain,
      title: "Análise automática de comportamento",
      description: "Detecta inatividade, trocas de janela e padrões de distração.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Shield,
      title: "Segurança e privacidade",
      description: "Tudo é criptografado, armazenado localmente e restrito ao ambiente corporativo.",
      color: "from-blue-500 to-blue-600"
    }
  ];

  return (
    <section className="relative py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Como funciona
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Tecnologia de ponta para monitoramento ético e eficiente
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-slate-200 to-transparent" />
              )}
              
              <div className="relative bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 transition-all hover:shadow-xl group-hover:-translate-y-2 duration-300">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Number Badge */}
                <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                  {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}