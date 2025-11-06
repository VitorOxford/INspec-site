// src/components/dashboard/RealtimeActivityChart.tsx
import React from 'react';
import ReactApexChart from 'react-apexcharts';

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
  
  // Mapeamento dos dados para o formato do ApexCharts
  const series = [
    {
      name: 'Produtivo',
      data: data.map(d => d.produtivo),
    },
    {
      name: 'Improdutivo',
      data: data.map(d => d.improdutivo),
    },
  ];

  const options = {
    chart: {
      id: 'realtime-activity-chart',
      toolbar: { show: false },
      background: 'transparent',
      stacked: true, // Empilhar as áreas
    },
    colors: ['#a855f7', '#ef4444'], // purple-500, red-500
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: { 
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      }
    },
    xaxis: {
      categories: data.map(d => d.time),
      labels: { style: { colors: '#64748b' } }, // slate-500
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { 
        style: { colors: '#64748b' }, 
        formatter: (value: number) => `${Math.round(value)}`,
      },
    },
    grid: {
      borderColor: '#334155', // slate-700
      strokeDashArray: 4,
    },
    tooltip: {
      theme: 'dark',
      x: { format: 'HH:mm' },
    },
    legend: {
        position: 'top' as const,
        horizontalAlign: 'right' as const,
        labels: { colors: '#cbd5e1' },
    }
  };

  return (
    <div className="h-80 rounded-lg border border-slate-700 bg-slate-800/50 p-6 shadow-lg shadow-black/20">
      <h3 className="mb-4 text-lg font-semibold text-white">Atividade da Equipe (Última Hora)</h3>
      <div className='h-[calc(100%-40px)]'>
        <ReactApexChart 
            options={options} 
            series={series} 
            type="area" 
            height="100%" 
        />
      </div>
    </div>
  );
}