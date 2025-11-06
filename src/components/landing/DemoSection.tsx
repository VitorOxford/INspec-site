import React from "react";
import { Activity, Eye, TrendingUp, Users } from "lucide-react";

export default function DemoSection() {
  return (
    <section id="demo" className="relative py-32 bg-gradient-to-br from-purple-950 via-slate-950 to-blue-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Description */}
          <div>
            <div className="inline-block mb-6 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
              <span className="text-sm text-purple-300">🎯 Demonstração Interativa</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Visualize o desempenho da equipe
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                como nunca antes
              </span>
            </h2>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Painel intuitivo com todas as métricas que você precisa para entender 
              a produtividade da sua equipe em tempo real.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {[
                { icon: Users, text: "Visualização de colaboradores online" },
                { icon: Eye, text: "Preview de telas em miniatura" },
                { icon: Activity, text: "Status ativo/inativo em tempo real" },
                { icon: TrendingUp, text: "Relatórios de produtividade detalhados" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/30">
                    <feature.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-slate-200">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl" />
            
            <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
              {/* Window Controls */}
              <div className="flex items-center gap-2 p-4 border-b border-slate-700/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 text-center text-sm text-slate-400">
                  Dashboard INspec
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 space-y-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Online", value: "24", color: "from-green-500 to-emerald-500" },
                    { label: "Ativos", value: "18", color: "from-blue-500 to-cyan-500" },
                    { label: "Produtividade", value: "87%", color: "from-purple-500 to-pink-500" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                      <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-slate-400">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* User Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                        <div className="flex-1">
                          <div className="h-2 bg-slate-700 rounded w-20 mb-1" />
                          <div className="h-1.5 bg-slate-700/50 rounded w-12" />
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      </div>
                      <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 rounded border border-slate-600/50" />
                    </div>
                  ))}
                </div>

                {/* Activity Chart */}
                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                  <div className="text-sm text-slate-400 mb-3">Atividade nas últimas 24h</div>
                  <div className="flex items-end gap-2 h-24">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((height, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-t opacity-70 hover:opacity-100 transition-opacity" style={{ height: `${height}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}