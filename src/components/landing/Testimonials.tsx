
import React from "react";
import { Star, Quote, Shield } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Reduzimos distrações em 43% no primeiro mês. O ROI foi imediato e a equipe entendeu que não se trata de vigilância, mas de organização.",
      author: "Carlos Mendes",
      role: "CTO",
      company: "TechPlus",
      rating: 5
    },
    {
      quote: "Visual limpo, relatórios claros, suporte excelente. A implementação foi surpreendentemente rápida e sem complicações.",
      author: "Ana Paula Silva",
      role: "Gerente de Operações",
      company: "Grupo DataOne",
      rating: 5
    },
    {
      quote: "Nos trouxe total controle sem burocracia. Finalmente conseguimos identificar gargalos de produtividade e otimizar processos.",
      author: "Ricardo Ferreira",
      role: "Diretor de TI",
      company: "SoftTeam Brasil",
      rating: 5
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            O que nossos clientes dizem
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Cases reais de empresas que transformaram sua gestão com INspec
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-2xl p-8 border border-slate-200 hover:border-purple-300 transition-all hover:shadow-xl hover:-translate-y-2 duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                  <Quote className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6 mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-700 leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{testimonial.author}</div>
                  <div className="text-sm text-slate-600">{testimonial.role}</div>
                  <div className="text-sm text-purple-600 font-medium">{testimonial.company}</div>
                </div>
              </div>

              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-20 flex flex-wrap justify-center items-center gap-8 md:gap-12">
          <div className="text-center">
            <div className="text-sm text-slate-500 mb-2">Certificações</div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-slate-700">ISO 27001</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-500 mb-2">Conformidade</div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-slate-700">LGPD</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-500 mb-2">Suporte</div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-slate-700">5.0/5.0</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
