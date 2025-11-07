// src/components/dashboard/UserEditModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Edit, User, Briefcase, Upload, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAuth, type Profile } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

// Tipo de props para o Modal
interface UserEditModalProps {
  isOpen: boolean;
  onClose: (shouldRefresh: boolean) => void;
  user: Profile | null;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ isOpen, onClose, user }) => {
  const { profile: adminProfile } = useAuth(); // Perfil do Admin
  
  // Estado do formulário
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [role, setRole] = useState<'admin' | 'employee' | string>('employee');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // Estado de controle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Atualiza o estado do formulário quando o usuário selecionado muda
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setJobTitle(user.job_title || '');
      setRole(user.role || 'employee');
      setAvatarPreview(user.avatar_url || null);
      setError(null);
      setAvatarFile(null);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  // Limpa o estado ao fechar
  const handleClose = (shouldRefresh = false) => {
    onClose(shouldRefresh);
  };

  // Handler para seleção de arquivo de avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Lógica de Salvar Edições
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!adminProfile?.organization_id) throw new Error("Organização do admin não encontrada.");
      
      let avatar_url = user.avatar_url; // Começa com a URL existente

      // 1. Se um novo arquivo foi selecionado, faz o upload
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        // Caminho: {organization_id}/{user_id}.{ext}
        const filePath = `${adminProfile.organization_id}/${user.id}.${fileExt}`;

        console.log("Fazendo upload do avatar para:", filePath);
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, {
            cacheControl: '3600',
            upsert: true, // Sobrescreve se já existir
          });

        if (uploadError) throw new Error(`Falha no upload do avatar: ${uploadError.message}`);

        // Pega a URL pública
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        
        // Adiciona um timestamp para quebrar o cache do navegador
        avatar_url = publicUrlData.publicUrl + `?t=${new Date().getTime()}`;
      }
      
      // 2. Atualiza a tabela 'profiles'
      console.log("Atualizando perfil...");
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          job_title: jobTitle,
          role: role,
          avatar_url: avatar_url, // Atualiza com a nova URL (ou a antiga se nada mudou)
        })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      console.log("Perfil atualizado com sucesso!");
      handleClose(true); // Fecha e avisa que precisa recarregar

    } catch (err: any) {
      console.error("Erro ao salvar perfil:", err);
      setError(err.message || "Ocorreu um erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  const modalBg = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800';
  const textPrimary = 'text-slate-900 dark:text-white';
  const textSecondary = 'text-slate-500 dark:text-slate-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity">
      <div className={cn("relative w-full max-w-lg rounded-xl p-8 shadow-2xl", modalBg)}>
        
        {/* Close Button */}
        <button onClick={() => handleClose(false)} className={cn("absolute top-4 right-4 p-2 rounded-full", textSecondary, "hover:bg-slate-200 dark:hover:bg-slate-700")}>
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <Edit className="h-8 w-8 text-purple-500 mx-auto mb-3" />
          <h2 className={cn("text-2xl font-bold", textPrimary)}>
            Editar Colaborador
          </h2>
          <p className={cn("text-sm mt-1", textSecondary)}>
            Atualize as informações de {user.full_name || 'colaborador'}.
          </p>
        </div>

        {/* Formulário de Edição */}
        <form onSubmit={handleSave} className="space-y-5">
          
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-3">
            <Label htmlFor="avatarUpload" className="cursor-pointer">
              <img 
                src={avatarPreview || `https://api.dicebear.com/8.x/initials/svg?seed=${fullName}&backgroundType=gradient&backgroundColor=a855f7,60a5fa`}
                alt="Avatar"
                className="h-24 w-24 rounded-full object-cover border-4 border-slate-700 hover:opacity-80 transition-opacity"
              />
            </Label>
            <Button 
              type="button" 
              size="sm"
              variant="outline"
              className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={() => document.getElementById('avatarUpload')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Trocar foto
            </Button>
            <input 
              id="avatarUpload"
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          
          <div>
            <Label htmlFor="fullName" className={textPrimary}>Nome Completo</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mt-1 dark:bg-slate-800/80 dark:border-slate-700 dark:text-white"
            />
          </div>
          
          <div className='grid grid-cols-2 gap-4'>
              <div>
                  <Label htmlFor="jobTitle" className={textPrimary}>Cargo/Função</Label>
                  <Input
                      id="jobTitle"
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      required
                      className="mt-1 dark:bg-slate-800/80 dark:border-slate-700 dark:text-white"
                  />
              </div>
              <div>
                  <Label htmlFor="role" className={textPrimary}>Função no INspec</Label>
                  <div className="relative mt-1">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        className="flex h-10 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-2 text-sm pl-11 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-800/80 dark:border-slate-700 dark:text-white"
                      >
                          <option value="employee">Colaborador</option>
                          <option value="admin">Administrador</option>
                      </select>
                  </div>
              </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Salvar Alterações"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;