import React from "react";
import { Shield, Zap, Users, Award } from "lucide-react";

export default function About() {
  const values = [
    { icon: Shield, label: "Ética e Privacidade" },
    { icon: Zap, label: "Tecnologia de Ponta" },
    { icon: Users, label: "Foco no Cliente" },
    { icon: Award, label: "Excelência" }
  ];

  return (
    <section id="sobre" className="relative py-32 bg-white overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-100 to-purple-100 rounded-full blur-3xl opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Image/Illustration */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 p-1">
              <div className="w-full h-full bg-white rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center">
                    <span className="text-6xl font-bold text-white">IN</span>
                  </div>
                  <div className="space-y-4">
                    {values.map((value, i) => (
                      <div key={i} className="flex items-center gap-3 justify-center">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                          <value.icon className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="text-slate-700 font-medium">{value.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl opacity-20 blur-xl" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl opacity-20 blur-xl" />
          </div>

          {/* Right Side - Content */}
          <div>
            <div className="inline-block mb-6 px-4 py-2 bg-purple-100 border border-purple-200 rounded-full">
              <span className="text-sm text-purple-700 font-semibold">💡 Sobre a INspec</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Unindo produtividade
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                e ética corporativa
              </span>
            </h2>

            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
              <p>
                A <span className="font-semibold text-slate-900">INspec</span> nasceu da necessidade 
                de unir produtividade e ética no ambiente corporativo. Em um mundo cada vez mais 
                digital, entendemos que a gestão eficiente de equipes remotas e híbridas exige 
                ferramentas modernas e transparentes.
              </p>

              <p>
                Desenvolvido com base em tecnologias de ponta como <span className="font-semibold text-slate-900">Electron e WebRTC</span>, 
                nosso sistema oferece visibilidade total sobre a operação, garantindo ao mesmo tempo 
                o cumprimento das normas da <span className="font-semibold text-slate-900">LGPD</span> e 
                o respeito à privacidade profissional.
              </p>

              <p>
                Acreditamos que monitoramento não precisa ser invasivo. Com o INspec, você tem 
                o controle necessário sem sacrificar a confiança e o bem-estar da sua equipe.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              {[
                { value: "500+", label: "Empresas" },
                { value: "15k+", label: "Usuários ativos" },
                { value: "99.9%", label: "Uptime" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}