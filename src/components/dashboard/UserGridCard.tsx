// src/components/dashboard/UserGridCard.tsx
import React from 'react';
import { Button } from '../ui/button';
import { Monitor, Camera, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

// (Dados mocados por enquanto)
interface UserGridCardProps {
  name: string;
  role: string;
  status: 'online' | 'offline' | 'idle';
  // A URL da miniatura virá do Supabase Storage ou WebRTC
  thumbnailUrl?: string; 
}

export default function UserGridCard({ name, role, status, thumbnailUrl }: UserGridCardProps) {
  const statusColors = {
    online: 'bg-green-500',
    idle: 'bg-yellow-500',
    offline: 'bg-slate-600',
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 shadow-lg shadow-black/20 transition-all duration-300 hover:border-purple-500 hover:shadow-purple-500/20">
      
      {/* Header com Nome e Status */}
      <div className="flex items-center gap-3 p-4">
        <div className="relative flex-shrink-0">
          <img 
            className="h-10 w-10 rounded-full border-2 border-slate-600"
            src={`https://api.dicebear.com/8.x/initials/svg?seed=${name}`} 
            alt={name} 
          />
          <span className={cn(
            "absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-slate-800",
            statusColors[status]
          )} />
        </div>
        <div className="overflow-hidden">
          <p className="truncate text-sm font-medium text-white">{name}</p>
          <p className="truncate text-xs text-slate-400">{role}</p>
        </div>
      </div>

      {/* Área da Miniatura */}
      <div className="relative aspect-video w-full bg-gradient-to-br from-slate-800 to-slate-900">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={`Tela de ${name}`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Monitor className="h-12 w-12 text-slate-700" />
          </div>
        )}
        
        {/* Overlay de ações (aparece no hover) */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button size="sm" variant="outline" className="h-9 bg-white/10 text-white backdrop-blur-sm border-white/20 hover:bg-white/20">
            <ZoomIn className="h-4 w-4 mr-2" /> Ver Ao Vivo
          </Button>
          <Button size="sm" variant="outline" className="h-9 bg-white/10 text-white backdrop-blur-sm border-white/20 hover:bg-white/20">
            <Camera className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}