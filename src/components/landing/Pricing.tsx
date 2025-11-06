import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      description: "Para pequenas equipes",
      price: "39",
      priceDetail: "por usuário/mês",
      limit: "até 10 estações",
      features: [
        "Monitoramento em tempo real",
        "Captura de tela básica",
        "Relatórios semanais",
        "Suporte via email",
        "Criptografia padrão",
        "1 administrador"
      ],
      cta: "Começar agora",
      popular: false
    },
    {
      name: "Business",
      description: "Para empresas em crescimento",
      price: "29",
      priceDetail: "por usuário/mês",
      limit: "até 100 estações",
      features: [
        "Tudo do Starter, mais:",
        "IA de detecção de distração",
        "Relatórios personalizados",
        "Suporte prioritário",
        "Integração com Active Directory",
        "Até 5 administradores",
        "API de integração",
        "Armazenamento estendido"
      ],
      cta: "Começar agora",
      popular: true
    },
    {
      name: "Enterprise",
      description: "Para grandes corporações",
      price: "Custom",
      priceDetail: "sob consulta",
      limit: "ilimitado",
      features: [
        "Tudo do Business, mais:",
        "Recursos personalizados",
        "Suporte 24/7 dedicado",
        "SLA garantido",
        "Onboarding personalizado",
        "Treinamento da equipe",
        "Administradores ilimitados",
        "Infraestrutura dedicada"
      ],
      cta: "Falar com vendas",
      popular: false
    }
  ];

  return (
    <section id="planos" className="relative py-32 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Planos e Licenças
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Escolha o plano ideal para o tamanho da sua operação
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-2xl p-8 border-2 transition-all hover:-translate-y-2 duration-300 ${
                plan.popular 
                  ? "border-purple-500 shadow-2xl shadow-purple-500/20" 
                  : "border-slate-200 hover:border-purple-300 hover:shadow-xl"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    Mais Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-600 mb-6">{plan.description}</p>
                
                <div className="mb-4">
                  {plan.price === "Custom" ? (
                    <div className="text-4xl font-bold text-slate-900">Personalizado</div>
                  ) : (
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-slate-900">R$ {plan.price}</span>
                      <span className="text-slate-600 ml-2">{plan.priceDetail}</span>
                    </div>
                  )}
                </div>
                
                <div className="inline-block px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600">
                  {plan.limit}
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      plan.popular 
                        ? "bg-gradient-to-br from-purple-500 to-blue-500" 
                        : "bg-slate-200"
                    }`}>
                      <Check className={`w-3 h-3 ${plan.popular ? "text-white" : "text-slate-600"}`} />
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button 
                className={`w-full py-6 text-lg font-semibold transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl px-6 py-4">
            <p className="text-slate-700">
              <span className="font-semibold">🔒 Todos os planos incluem:</span> Criptografia completa e conformidade com a LGPD
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}