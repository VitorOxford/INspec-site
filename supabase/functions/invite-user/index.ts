import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
// ==========================================================
// ▼▼▼ A CORREÇÃO REAL ESTÁ AQUI ▼▼▼
// O erro "does not provide an export named 'generate'"
// significa que a função está no objeto 'v4' do módulo 'mod.ts'
// ==========================================================
import { v4 } from 'https://deno.land/std@0.177.0/uuid/mod.ts'
// ==========================================================
import { corsHeaders } from '../_shared/cors.ts'

console.log("FUNÇÃO 'invite-user' INICIALIZADA (código-fonte v5 - importação corrigida).")

// Função helper para criar um cliente em nome do *utilizador*
function createSupabaseUserClient(req: Request): SupabaseClient {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    throw new Error('Utilizador não autenticado (sem cabeçalho Authorization).')
  }
  return createClient(
    Deno.env.get('PROJECT_URL') ?? '',
    Deno.env.get('PROJECT_ANON_KEY') ?? '', // Usamos a ANON key
    { global: { headers: { Authorization: authHeader } } }
  )
}

// Função helper para criar o cliente Admin (Service Role)
function createSupabaseAdminClient(): SupabaseClient {
  return createClient(
    Deno.env.get('PROJECT_URL') ?? '',
    Deno.env.get('SERVICE_ROLE_KEY') ?? '',
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

Deno.serve(async (req) => {
  console.log("Nova requisição recebida:", req.method)
  if (req.method === 'OPTIONS') {
    // Responde ao preflight CORS
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Criar os clientes
    const supabaseUserClient = createSupabaseUserClient(req) 
    const supabaseAdmin = createSupabaseAdminClient()       

    // 2. Obter o ID do utilizador que está a chamar
    console.log("Obtendo utilizador (auth.getUser)...")
    const { data: { user: callerUser }, error: callerError } = await supabaseUserClient.auth.getUser()
    if (callerError || !callerUser) {
      throw new Error(`Falha na autenticação: ${callerError?.message}`)
    }
    console.log("Utilizador autenticado:", callerUser.id)

    // 3. Verificar a permissão do *utilizador*
    console.log("Verificando permissão (RPC get_my_role)...")
    const { data: role, error: rpcError } = await supabaseUserClient.rpc('get_my_role')
    if (rpcError) {
      throw new Error(`Falha ao verificar permissão (RPC): ${rpcError.message}`)
    }
    if (role !== 'admin') {
      throw new Error(`Ação não autorizada. O utilizador tem a role '${role}', mas é necessária 'admin'.`)
    }
    console.log("Permissão de Admin confirmada.")

    // 4. Obter o organization_id do admin
    console.log("Obtendo perfil do admin (organization_id)...")
    const { data: adminProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('organization_id')
      .eq('id', callerUser.id) 
      .single()

    if (profileError || !adminProfile || !adminProfile.organization_id) {
      throw new Error("Perfil do admin não encontrado ou não possui organization_id.")
    }
    const organizationId = adminProfile.organization_id;
    console.log("Organization ID encontrado:", organizationId)

    // 5. Obter dados do POST
    console.log("Lendo JSON do body...")
    const { email, fullName, jobTitle, role: newUserRole } = await req.json()
    if (!email || !fullName || !newUserRole) {
      throw new Error("Email, Nome e Função são obrigatórios.")
    }
    console.log("Dados recebidos:", { email, fullName, newUserRole })

    // 6. Criar o novo usuário (autenticação)
    console.log("Criando novo utilizador (auth.admin.createUser)...")
    // ==========================================================
    // ▼▼▼ CORREÇÃO DA CHAMADA DA FUNÇÃO ▼▼▼
    // A importação 'v4' é um objeto que tem a função 'generate'
    // ==========================================================
    const tempPassword = `pwd_${v4.generate()}`; 
    // ==========================================================
    const { data: newUserData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })

    if (createUserError) {
      throw new Error(`Falha ao criar usuário (auth): ${createUserError.message}`)
    }
    const newUser = newUserData.user;
    console.log("Novo utilizador criado (auth):", newUser.id)

    // 7. Criar o perfil do novo usuário (database)
    console.log("Inserindo perfil (db)...")
    const { error: createProfileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: newUser.id,
        organization_id: organizationId,
        full_name: fullName,
        job_title: jobTitle,
        role: newUserRole,
      })
      
    if (createProfileError) {
      console.error("ERRO ao inserir perfil. Revertendo utilizador...")
      await supabaseAdmin.auth.admin.deleteUser(newUser.id) // Reverte
      throw new Error(`Falha ao criar perfil (db): ${createProfileError.message}`)
    }
    console.log("Perfil inserido com sucesso (db).")

    // 8. Gerar e armazenar o token de convite
    console.log("Inserindo token (user_invites)...")
    // ==========================================================
    // ▼▼▼ CORREÇÃO DA CHAMADA DA FUNÇÃO ▼▼▼
    // ==========================================================
    const inviteToken = `${v4.generate().substring(0, 8)}`.toUpperCase(); 
    // ==========================================================
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

    // 9. Sucesso!
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