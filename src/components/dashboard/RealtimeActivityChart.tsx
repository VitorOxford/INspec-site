// src/components/dashboard/RealtimeActivityChart.tsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Defs, LinearGradient, Stop } from 'recharts';

// (Dados mocados por enquanto)
const data = [
  { time: '14:00', produtivo: 20, improdutivo: 5 },
  { time: '14:05', produtivo: 22, improdutivo: 8 },
  { time: '14:10', produtivo: 30, improdutivo: 10 },
  { time: '14:15', produtivo: 28, improdutivo: 12 },
  { time: '14:20', produtivo: 35, improdutivo: 10 },
  { time: '14:25', produtivo: 40, improdutivo: 8 },
  { time: '14:30', produtivo: 38, improdutivo: 5 },
  { time: '14:35', produtivo: 45, improdutivo: 7 },
  { time: '14:40', produtivo: 50, improdutivo: 10 },
];

export default function RealtimeActivityChart() {
  return (
    <div className="h-80 rounded-lg border border-slate-700 bg-slate-800/50 p-6 shadow-lg shadow-black/20">
      <h3 className="mb-4 text-lg font-semibold text-white">Atividade da Equipe (Última Hora)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, left: -20, bottom: 20 }}
        >
          <Defs>
            {/* Gradiente Roxo */}
            <LinearGradient id="colorProdutivo" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
              <Stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
            </LinearGradient>
            {/* Gradiente Cinza/Vermelho */}
            <LinearGradient id="colorImprodutivo" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="5%" stopColor="#ef4444" stopOpacity={0.7}/>
              <Stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
            </LinearGradient>
          </Defs>
          <XAxis 
            dataKey="time" 
            stroke="#64748b" // slate-500
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#64748b" 
            tickLine={false}
            axisLine={false}
            label={{ value: 'Usuários', angle: -90, position: 'insideLeft', fill: '#64748b' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b', // slate-800
              borderColor: '#334155', // slate-700
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#cbd5e1' }} // slate-300
          />
          <Area 
            type="monotone" 
            dataKey="produtivo" 
            stroke="#a855f7" // purple-500
            fillOpacity={1} 
            fill="url(#colorProdutivo)" 
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="improdutivo" 
            stroke="#ef4444" // red-500
            fillOpacity={1} 
            fill="url(#colorImprodutivo)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}