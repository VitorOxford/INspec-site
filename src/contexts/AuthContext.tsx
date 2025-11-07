// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

// Definição do tipo 'Profile'
export interface Profile {
  id: string;
  organization_id: string | null;
  role: 'admin' | 'employee' | string;
  full_name: string | null;
  company_size: string | null;
  industry: string | null;
  job_title: string | null;
  phone: string | null;
  document: string | null;
  source: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Função para buscar o perfil de forma segura (sem alterações)
const safeFetchProfile = async (userId: string) => {
  const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*') 
      .eq('id', userId)
      .single();
  
  if (profileError) {
      console.error("LOG: AuthContext - ERRO FATAL AO BUSCAR PERFIL (RLS/Schema):", profileError.message, profileError.details);
      return null;
  }
  
  console.log("LOG: AuthContext - PERFIL OBTIDO COM SUCESSO:", profileData);
  return profileData as Profile; 
}


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null); 
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true); // Começa como true
  
  // NOVO ESTADO: Controla se a verificação inicial de auth foi concluída
  const [authChecked, setAuthChecked] = useState(false);

  // Efeito 1: APENAS para o listener de autenticação
  useEffect(() => {
    console.log("LOG: AuthContext - Subscribing to onAuthStateChange");

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`LOG: AuthContext - Auth State Change: ${event}`);
        
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        // Marca que a verificação inicial (ou mudança) de auth aconteceu.
        // Isso vai disparar o Efeito 2.
        setAuthChecked(true); 
      }
    );

    return () => {
      console.log("LOG: AuthContext - Cleanup, unsubscribing listener.");
      authListener?.subscription.unsubscribe();
    };
  }, []); // Array vazio, roda apenas uma vez na montagem

  
  // Efeito 2: APENAS para buscar o perfil, reagindo ao usuário ou à verificação de auth
  useEffect(() => {
    // Não faz nada até que o Efeito 1 tenha rodado pelo menos uma vez
    if (!authChecked) {
      console.log("LOG: AuthContext - Profile Fetch esperando auth check...");
      return;
    }

    if (user) {
      // Usuário está logado, busca o perfil
      console.log("LOG: AuthContext - User detectado, buscando perfil...");
      // Garante que estamos carregando enquanto buscamos o perfil
      setLoading(true); 
      
      safeFetchProfile(user.id)
        .then((fetchedProfile) => {
          setProfile(fetchedProfile);
          console.log(`LOG: AuthContext - Profile set: ${fetchedProfile ? 'true' : 'false'}`);
        })
        .catch((e) => {
          console.error("LOG: AuthContext - Erro na promise safeFetchProfile:", e);
          setProfile(null);
        })
        .finally(() => {
          // Finalmente, define o loading como false
          setLoading(false);
          console.log("LOG: AuthContext - Loading FINALIZADO (profile fetch completo).");
        });
    } else {
      // Sem usuário (logado ou não), não estamos carregando
      setProfile(null);
      setLoading(false);
      console.log("LOG: AuthContext - Sem usuário, definindo loading=false.");
    }
  }, [user, authChecked]); // Roda sempre que 'user' ou 'authChecked' mudar

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    profile, 
    session,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};