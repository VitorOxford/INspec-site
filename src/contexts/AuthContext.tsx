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

// Função para buscar o perfil de forma segura
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    console.log("LOG: AuthContext - useEffect INICIADO");

    const fetchSessionAndProfile = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) console.error("LOG: AuthContext - ERRO na sessão:", sessionError);

        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        console.log(`LOG: AuthContext - Sessão obtida. User ID: ${currentUser?.id ? currentUser.id : 'null'}`);

        if (session) {
          const fetchedProfile = await safeFetchProfile(session.user.id);
          setProfile(fetchedProfile);
          console.log(`LOG: AuthContext - Profile set: ${fetchedProfile ? 'true' : 'false'}`);
        } else {
          setProfile(null);
        }
      } catch (e) {
        console.error("LOG: AuthContext - Erro no fetch inicial:", e);
      } finally {
        setLoading(false);
        console.log("LOG: AuthContext - Loading FINALIZADO.");
      }
    };
    
    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`LOG: AuthContext - Auth State Change: ${event}`);

        setSession(session);
        setUser(session?.user ?? null);

        if (event === 'SIGNED_IN' && session) {
          setLoading(true);
          const fetchedProfile = await safeFetchProfile(session.user.id);
          setProfile(fetchedProfile);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

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