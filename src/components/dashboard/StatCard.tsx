// src/components/dashboard/StatCard.tsx
import { cn } from '@/lib/utils';
// CORREÇÃO: Adicionado 'type' para importar LucideIcon como um tipo
import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  colorClass: string; // Ex: "text-green-500"
}

export default function StatCard({ title, value, icon: Icon, colorClass }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 p-5 shadow-lg shadow-black/20">
      {/* Efeito de brilho no fundo */}
      <div className={cn(
        "absolute -top-1/3 -right-1/4 w-1/2 h-full rounded-full opacity-10 blur-3xl",
        colorClass.replace("text-", "bg-") // text-green-500 -> bg-green-500
      )} />

      <div className="flex items-center gap-4">
        <div className={cn("flex-shrink-0 rounded-lg p-3", colorClass.replace("text-", "bg-"), "bg-opacity-10")}>
          <Icon className={cn("h-6 w-6", colorClass)} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}