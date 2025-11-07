// supabase/functions/invite-user/index.ts
// VERSÃO v-GATILHO-SEGURO (A versão definitiva)

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("FUNÇÃO 'invite-user' INICIALIZADA (código-fonte v-GATILHO-SEGURO).")

// --- Funções Helper (sem alteração) ---
function createSupabaseUserClient(req: Request): SupabaseClient {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) throw new Error('Utilizador não autenticado (sem cabeçalho Authorization).')
  return createClient(
    Deno.env.get('PROJECT_URL') ?? '',
    Deno.env.get('PROJECT_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )
}
function createSupabaseAdminClient(): SupabaseClient {
  return createClient(
    Deno.env.get('PROJECT_URL') ?? '',
    Deno.env.get('SERVICE_ROLE_KEY') ?? '',
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
// -------------------------------------

Deno.serve(async (req) => {
  console.log("Nova requisição recebida:", req.method)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Passos 1-4 (autenticação, permissão, org_id) - Sem alteração
    const supabaseUserClient = createSupabaseUserClient(req) 
    const supabaseAdmin = createSupabaseAdminClient()       
    const { data: { user: callerUser }, error: callerError } = await supabaseUserClient.auth.getUser()
    if (callerError || !callerUser) throw new Error(`Falha na autenticação: ${callerError?.message}`)
    console.log("Utilizador autenticado:", callerUser.id)

    const { data: role, error: rpcError } = await supabaseUserClient.rpc('get_my_role')
    if (rpcError) throw new Error(`Falha ao verificar permissão (RPC): ${rpcError.message}`)
    if (role !== 'admin') throw new Error(`Ação não autorizada. Role necessária 'admin'.`)
    console.log("Permissão de Admin confirmada.")

    const { data: adminProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('organization_id')
      .eq('id', callerUser.id) 
      .single()
    if (profileError || !adminProfile || !adminProfile.organization_id) throw new Error("Perfil do admin não encontrado ou sem organization_id.")
    const organizationId = adminProfile.organization_id;
    console.log("Organization ID encontrado:", organizationId)

    // Passo 5: Obter dados - Sem alteração
    const { email, fullName, jobTitle, role: newUserRole } = await req.json()
    if (!email || !fullName || !newUserRole) throw new Error("Email, Nome e Função são obrigatórios.")
    console.log("Dados recebidos:", { email, fullName, newUserRole })

    // ==========================================================
    // ▼▼▼ A CORREÇÃO DE LÓGICA (GATILHO + UPSERT) ▼▼▼
    // ==========================================================

    // Passo 6: Criar o usuário (Passando DADOS FALSOS para o gatilho)
    console.log("Criando novo utilizador (auth) e satisfazendo gatilho...")
    const tempPassword = `pwd_${crypto.randomUUID()}`;
    
    const { data: newUserData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { 
        full_name: fullName,
        job_title: jobTitle,
        role: newUserRole, // Passamos o role correto
        organization_id: organizationId, // Passamos a org correta
        // --- Dados falsos para satisfazer o gatilho (baseado na SignUpPage.tsx) ---
        company_name: 'Convidado pelo Admin', // Placeholder
        company_size: 'N/A', // Placeholder
        industry: 'N/A', // Placeholder
        phone: 'N/A', // Placeholder
        document: 'N/A', // Placeholder
        source: 'Convidado pelo Admin' // Placeholder
      },
    })

    if (createUserError) {
      // Se falhar agora, é 100% porque o usuário já existe
      throw new Error(`Falha ao criar usuário (auth): ${createUserError.message}`)
    }
    const newUser = newUserData.user;
    console.log("Novo utilizador criado (auth):", newUser.id)


    // Passo 7: USAR "UPSERT" PARA GARANTIR OS DADOS CORRETOS
    // Mesmo que o gatilho tenha criado o perfil, vamos ATUALIZAR
    // para garantir que organization_id e role estão 100% corretos.
    console.log("Fazendo Upsert/Correção do perfil (db)...")
    const { error: upsertProfileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: newUser.id, // Chave primária
        organization_id: organizationId,
        full_name: fullName,
        job_title: jobTitle,
        role: newUserRole,
        // (Não precisamos mais dos campos falsos aqui, mas não faz mal)
      })
      
    if (upsertProfileError) {
      console.error("ERRO ao fazer Upsert do perfil. Revertendo utilizador...")
      await supabaseAdmin.auth.admin.deleteUser(newUser.id) // Reverte
      throw new Error(`Falha ao criar/atualizar perfil (db): ${upsertProfileError.message}`)
    }
    console.log("Perfil criado/atualizado com sucesso (db).")

    // Passo 8: Gerar e armazenar o token de convite (Sem alteração)
    console.log("Inserindo token (user_invites)...")
    const inviteToken = `${crypto.randomUUID().substring(0, 8)}`.toUpperCase();
    
    const { error: tokenError } = await supabaseAdmin
      .from('user_invites')
      .insert({
        user_id: newUser.id,
        organization_id: organizationId,
        invite_token: inviteToken,
      })

    if (tokenError) {
      console.error("ERRO ao inserir token. Revertendo...")
      await supabaseAdmin.auth.admin.deleteUser(newUser.id) // Reverte
      throw new Error(`Falha ao criar token (invites): ${tokenError.message}`)
    }
    console.log("Token inserido com sucesso:", inviteToken)

    // ==========================================================
    // ▲▲▲ FIM DA CORREÇÃO DE LÓGICA ▲▲▲
    // ==========================================================

    // Passo 9: Sucesso!
    console.log("SUCESSO. Retornando token para o cliente.")
    return new Response(
      JSON.stringify({ invite_token: inviteToken }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (e) {
    // Retorna um 400 com a mensagem de erro específica
    console.error("ERRO FATAL NA FUNÇÃO:", e.message)
    return new Response(
      JSON.stringify({ error: e.message }), // Envia a mensagem de erro real
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})