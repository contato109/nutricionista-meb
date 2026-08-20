# ✅ CHECKLIST DE CONFIGURAÇÃO SUPABASE MEB

## 📋 Pré-requisitos
- [ ] Conta Supabase criada (https://supabase.com)
- [ ] Projeto criado
- [ ] Credenciais copiadas (SUPABASE_URL + SUPABASE_ANON_KEY)

---

## 🗄️ FASE 1: BANCO DE DADOS

### 1.1 - Executar Schema SQL
- [ ] Ir para **SQL Editor** no Supabase Dashboard
- [ ] Clique em **"New Query"**
- [ ] Cole **TODO** o arquivo `schema.sql`
- [ ] Execute com **Ctrl+Enter**
- [ ] Verificar: Deve criar 16 tabelas + 15 índices

**Se der erro:**
- Deletar a query e tentar novamente
- Se persister, abrir "Auth" e verificar que há um usuário de teste

### 1.2 - Executar Edge Functions
- [ ] Ir para **SQL Editor** → **"New Query"**
- [ ] Cole **TODO** o arquivo `edge-functions.sql`
- [ ] Execute com **Ctrl+Enter**
- [ ] Verificar: Deve criar 10 funções + 8 triggers

**Funções que devem existir:**
- `criar_paciente()`
- `calcular_progresso_plano()`
- `dias_restantes_plano()`
- `registrar_peso()`
- `marcar_mensagens_lidas()`
- `contar_nao_lidas_totais()`
- `obter_mensagens_pagina()`
- `obter_cardapio_semana()`
- `registrar_diario()`
- `obter_stats_paciente()`

### 1.3 - Verificar Row Level Security (RLS)
- [ ] Ir para **Authentication** → **Policies**
- [ ] Verificar que cada tabela tem policies:

```
✓ profiles       → 4 policies
✓ nutritionists  → 2 policies
✓ pacientes      → 4 policies
✓ mensagens      → 3 policies
✓ refeicoes      → 2 policies
✓ cardapios      → 2 policies
✓ diario_entradas → 2 policies
✓ peso_progresso → 2 policies
✓ posts_comunidade → 2 policies
✓ comentarios_comunidade → 2 policies
```

---

## 🔐 FASE 2: AUTENTICAÇÃO

### 2.1 - Configurar Providers
- [ ] Ir para **Authentication** → **Providers**
- [ ] Habilitar: **Email**
- [ ] Habilitar (opcional): **Google**, **GitHub** para teste rápido

### 2.2 - Email Templates
- [ ] Ir para **Authentication** → **Email Templates**
- [ ] **Confirm signup**: Verificar que está em português ou deixar padrão
- [ ] **Password reset**: Idem

### 2.3 - Criar Usuários de Teste
- [ ] Ir para **Authentication** → **Users**
- [ ] Clique em **"Add user"** (ou usar API)

**Criar 2 usuários:**

**Usuário 1 - Nutricionista**
- Email: `duda@nutricionista.com`
- Password: `SenhaForte123!`
- User Metadata (JSON):
  ```json
  {
    "role": "nutricionista",
    "name": "Duda Silva"
  }
  ```

**Usuário 2 - Paciente**
- Email: `ana@paciente.com`
- Password: `SenhaForte123!`
- User Metadata (JSON):
  ```json
  {
    "role": "paciente",
    "name": "Ana Paula Souza"
  }
  ```

### 2.4 - Criar Profiles no Banco
- [ ] Ir para **SQL Editor** → **New Query**
- [ ] Execute (ajuste os UUIDs dos usuários):

```sql
-- Nutricionista profile
INSERT INTO profiles (id, role, name, email)
VALUES (
  'USER_ID_DO_USUARIO_1', -- Copiar de Authentication > Users
  'nutricionista',
  'Duda Silva',
  'duda@nutricionista.com'
) ON CONFLICT DO NOTHING;

-- Paciente profile
INSERT INTO profiles (id, role, name, email)
VALUES (
  'USER_ID_DO_USUARIO_2',
  'paciente',
  'Ana Paula Souza',
  'ana@paciente.com'
) ON CONFLICT DO NOTHING;

-- Nutricionista extended info
INSERT INTO nutritionists (id, crn, specialization, is_active)
VALUES (
  'USER_ID_DO_USUARIO_1',
  'CRN-SP-123456',
  'Emagrecimento e Transformação',
  TRUE
) ON CONFLICT DO NOTHING;
```

### 2.5 - Criar Primeiro Paciente
- [ ] Ir para **SQL Editor** → **New Query**
- [ ] Execute:

```sql
SELECT criar_paciente(
  'USER_ID_DO_USUARIO_2'::UUID,     -- ID do paciente
  'USER_ID_DO_USUARIO_1'::UUID,     -- ID da nutricionista
  'caminho',                         -- Nome do plano
  'Emagrecimento e reeducação alimentar',
  162,                               -- Altura em cm
  74.2,                              -- Peso atual
  65                                 -- Peso meta
);
```

---

## 🌐 FASE 3: API & CONFIGURAÇÃO

### 3.1 - Verificar Endpoints REST
- [ ] Ir para **Settings** → **API**
- [ ] Anotar: **Project URL** (seu SUPABASE_URL)
- [ ] Anotar: **Project API Keys** → **anon** (seu SUPABASE_ANON_KEY)

### 3.2 - Configurar CORS
- [ ] Ir para **Settings** → **API**
- [ ] Rolar até **Allowed Origins**
- [ ] Adicionar seus domínios:
  - `http://localhost:3000`
  - `http://localhost:8080`
  - `http://127.0.0.1:5500` (Live Server do VS Code)
  - Seu domínio de produção quando houver

### 3.3 - Verificar Rate Limiting
- [ ] Ir para **Settings** → **API**
- [ ] Verificar **Rate Limiting** (padrão está OK)

---

## 📦 FASE 4: STORAGE (Fotos)

### 4.1 - Criar Buckets
- [ ] Ir para **Storage** → **Buckets**
- [ ] Clique em **"New Bucket"**

**Bucket 1 - Fotos de Refeições**
- Nome: `meal-photos`
- Public/Private: **Private**
- [ ] Criar

**Bucket 2 - Fotos de Perfil**
- Nome: `profile-photos`
- Public/Private: **Private**
- [ ] Criar

### 4.2 - Configurar Policies de Upload
- [ ] Ir para **Storage** → **meal-photos**
- [ ] Clique em **"Policies"**
- [ ] Create a new policy → **For SELECT**:
  ```
  Authenticated users can select
  ```
- [ ] Create a new policy → **For INSERT**:
  ```
  Users can insert their own data
  Condition: auth.uid()::text = (storage.foldername(name))[1]
  ```

---

## 📊 FASE 5: MONITORAMENTO

### 5.1 - Ver Logs
- [ ] Ir para **Logs** → **API Logs**
- [ ] Deve ver requisições quando você testar
- [ ] Se ver muitos 401/403, verificar RLS policies

### 5.2 - Ver Database Usage
- [ ] Ir para **Settings** → **Usage**
- [ ] Verificar que está dentro do free tier:
  - Database: 500 MB
  - Auth: 50,000 sign-ups
  - Storage: 1 GB
  - API Calls: 2M/mês

### 5.3 - Configurar Backups
- [ ] Ir para **Settings** → **Backups**
- [ ] Ativar backups automáticos (mesmo no free tier)

---

## ✅ FASE 6: TESTES

### 6.1 - Testar Conectividade
- [ ] Abra seu HTML em um navegador
- [ ] Abra **DevTools** (F12)
- [ ] Execute no console:

```javascript
const meb = new MEBClient(
  'https://seu-projeto.supabase.co',
  'sua-chave-anon'
);

// Testar GET
await fetch(
  'https://seu-projeto.supabase.co/rest/v1/planos?select=*',
  { headers: { 'apikey': 'sua-chave-anon' } }
).then(r => r.json()).then(console.log);
```

Deve retornar os 3 planos que inserimos.

### 6.2 - Testar Sign In
```javascript
const resultado = await meb.signin('duda@nutricionista.com', 'SenhaForte123!');
console.log(resultado.access_token); // Deve ter um token
```

### 6.3 - Testar Listar Pacientes
```javascript
const nutricionistaId = 'COLOQUE_UUID_DO_USUARIO_1';
const pacientes = await meb.listarPacientes(nutricionistaId);
console.log(pacientes); // Deve ter 1 paciente
```

### 6.4 - Testar Funções SQL
```javascript
const stats = await meb.obterStats('COLOQUE_UUID_DO_USUARIO_2');
console.log(stats); // Deve ter dados do paciente
```

---

## 🚀 FASE 7: DEPLOYMENT

### 7.1 - Variáveis de Ambiente
- [ ] Em seu `.env` (production):
  ```
  VITE_SUPABASE_URL=https://seu-projeto.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
  ```

### 7.2 - Atualizar CORS
- [ ] Adicionar seu domínio de produção em Settings → API → Allowed Origins

### 7.3 - Verificar SSL
- [ ] Seu site deve estar em HTTPS (force isso no Supabase)

---

## 🆘 TROUBLESHOOTING

### Erro: "401 Unauthorized"
**Causa:** Chave API incorreta ou expirada
**Solução:**
1. Copiar novamente de Settings → API
2. Limpar localStorage e tentar de novo
3. Verificar que `SUPABASE_ANON_KEY` não é vazio

### Erro: "CORS blocked"
**Causa:** Seu domínio não está em Allowed Origins
**Solução:**
1. Ir para Settings → API → Allowed Origins
2. Adicionar seu domínio
3. Aguardar ~1 minuto e tentar de novo

### Erro: "Row not found" ou dados vazios
**Causa:** RLS policy bloqueando acesso
**Solução:**
1. Verificar que usuário está autenticado (`auth.uid()` retorna UUID)
2. Verificar policies em Authentication → Policies
3. Testar com usuário que é dono dos dados

### Erro: "Function does not exist"
**Causa:** Edge functions não foram executadas
**Solução:**
1. Voltar para SQL Editor
2. Copiar arquivo `edge-functions.sql`
3. Executar tudo novamente

### Lentidão/Timeout
**Causa:** Query complexa ou sem índices
**Solução:**
1. Verificar que todos índices foram criados (fim de `schema.sql`)
2. Testar com dados menores
3. Verificar Logs → Query Performance

---

## 📋 CHECKLIST FINAL

- [ ] Schema SQL executado (16 tabelas)
- [ ] Edge Functions executadas (10 funções)
- [ ] 2 usuários de teste criados
- [ ] Profiles dos usuários criados
- [ ] Primeiro paciente criado
- [ ] CORS configurado
- [ ] Buckets de storage criados (optional)
- [ ] Teste de conectividade passou
- [ ] Teste de sign-in passou
- [ ] Teste de listar pacientes passou
- [ ] Teste de obter stats passou
- [ ] Code integrado nos HTMLs
- [ ] Botões enviando dados e trazendo resposta
- [ ] Toast notifications funcionando
- [ ] Dados persistindo entre refreshes

---

## 🎉 PRONTO!

Quando tudo estiver verde, seu MEB está pronto para produção:

1. **Dados em tempo real** no Supabase
2. **Segurança** com RLS
3. **Performance** com índices
4. **Escalabilidade** automática

**Próximo passo:** Integrar upload de fotos com Storage!

---

**Dúvidas?** Consulte a documentação do Supabase: https://supabase.com/docs
