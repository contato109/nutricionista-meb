# ✅ CHECKLIST VISUAL - MEB Setup Supabase

## 📋 FASE 1: SUPABASE (30 minutos)

### ☐ Passo 1: Criar Projeto
- [ ] Ir para https://supabase.com/dashboard
- [ ] Clique "New Project"
- [ ] Preencha:
  - Name: `meb-nutricao`
  - Region: `South America (São Paulo)` ou mais próxima
  - Password: Anote uma senha forte
- [ ] Aguarde ~2 minutos

### ☐ Passo 2: Executar SQL (CRÍTICO!)
**Não divida em partes! Execute TUDO de uma vez:**

1. Abra Supabase Dashboard
2. Clique em **SQL Editor**
3. Clique em **New Query**
4. Copie **TODO** o arquivo `MEB-COMPLETO.sql`
5. Cole na janela do editor
6. Pressione **Ctrl+Enter** (ou Run)
7. Aguarde terminar (deve aparecer "✓ Success")

**Checklist de criação:**
- [ ] 16 tabelas criadas (profiles, pacientes, refeicoes, etc)
- [ ] 9 funções criadas (criar_paciente, registrar_peso, etc)
- [ ] 8 triggers criados (trig_profiles_timestamp, etc)
- [ ] 12 índices criados
- [ ] Sem erros no console

### ☐ Passo 3: Copiar Credenciais
1. Clique em **Settings**
2. Clique em **API**
3. Procure por:
   - **Project URL** → copie como `SUPABASE_URL`
   - **Project API Keys** → procure **anon** → copie como `SUPABASE_ANON_KEY`
4. Cole em um arquivo .txt seguro (vamos usar em breve)

**Exemplo:**
```
SUPABASE_URL = https://xyzabc.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### ☐ Passo 4: Verificar RLS
- [ ] Supabase Dashboard → Authentication → Policies
- [ ] Deve aparecer policies em: profiles, pacientes, mensagens, etc
- [ ] Tudo automático, não precisa fazer nada

---

## 📱 FASE 2: INTEGRAÇÃO NOS HTMLS (30 minutos)

### ☐ Passo 5: Adicionar Biblioteca JS
Em cada arquivo HTML (ou pelo menos um para testar):

1. Procure por `</body>` (final do arquivo)
2. ANTES de `</body>`, adicione:
```html
<script src="meb-client-corrigido.js"></script>
```

3. Salve o arquivo

### ☐ Passo 6: Atualizar Credenciais
Em cada HTML, procure por:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

Substitua por seus valores:
```javascript
const SUPABASE_URL = 'https://xyzabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

**Checklist:**
- [ ] Ambas as constantes preenchidas
- [ ] Sem espaços extras
- [ ] Sem quebras de linha

### ☐ Passo 7: Testar Conectividade
1. Abra um HTML em seu navegador
2. Abra DevTools com **F12**
3. Abra a aba **Console**
4. Digite e execute:
```javascript
fetch('https://seu-projeto.supabase.co/rest/v1/planos?select=*', {
  headers: { 'apikey': 'sua-chave-aqui' }
}).then(r => r.json()).then(console.log)
```

**Resultado esperado:**
```json
[
  { id: 1, nome: 'caminho', ... },
  { id: 2, nome: 'transformacao', ... },
  { id: 3, nome: 'jornada', ... }
]
```

**Se vir os 3 planos → ✅ Funcionando!**

---

## 🎯 FASE 3: PRIMEIROS DADOS (30 minutos)

### ☐ Passo 8: Criar Usuários de Teste

**No Supabase:**
1. Clique em **Authentication**
2. Clique em **Users**
3. Clique em **Add user**

**Usuário 1 - Nutricionista:**
- Email: `duda@test.com`
- Password: `SenhaForte123!`
- Mark as confirmed: ✅

**Usuário 2 - Paciente:**
- Email: `paciente@test.com`
- Password: `SenhaForte123!`
- Mark as confirmed: ✅

**Copie os UUIDs (você vai precisar):**
- `NUTRI_ID` = UUID do usuário nutricionista
- `PACIENTE_ID` = UUID do usuário paciente

### ☐ Passo 9: Criar Profiles (SQL)

**No SQL Editor:**
```sql
-- Nutricionista
INSERT INTO profiles (id, role, name, email)
VALUES ('NUTRI_ID', 'nutricionista', 'Duda Silva', 'duda@test.com');

-- Paciente
INSERT INTO profiles (id, role, name, email)
VALUES ('PACIENTE_ID', 'paciente', 'Ana Paula', 'paciente@test.com');

-- Nutricionista extended
INSERT INTO nutritionists (id, crn, is_active)
VALUES ('NUTRI_ID', 'CRN-SP-123456', true);
```

**Resultado:** ✅ 2 usuários criados

### ☐ Passo 10: Criar Primeiro Paciente

**No SQL Editor:**
```sql
SELECT criar_paciente(
  'PACIENTE_ID'::UUID,
  'NUTRI_ID'::UUID,
  'caminho',
  'Emagrecer e reeducar',
  162,
  74.2,
  65
);
```

**Resultado:** ✅ Paciente criado com plano

---

## 💬 FASE 4: TESTAR FLUXOS (30 minutos)

### ☐ Passo 11: Testar Listar Pacientes

Console do navegador:
```javascript
const meb = new MEBClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const pacientes = await meb.listarPacientes('NUTRI_ID');
console.log(pacientes);
```

**Esperado:** Array com 1 paciente

### ☐ Passo 12: Testar Registrar Refeição

```javascript
await meb.registrarRefeicao('PACIENTE_ID', {
  tipo: 'almoco',
  alimentos: ['frango', 'salada'],
  descricao: 'Almoço do dia',
  fotoUrl: null
});

// Verificar
const refeicoes = await meb.obterRefeicoesDia('PACIENTE_ID');
console.log(refeicoes);
```

**Esperado:** 1 refeição registrada

### ☐ Passo 13: Testar Marcar Hábito

Primeiro, criar um hábito:
```javascript
const habito = await meb.criarHabito('PACIENTE_ID', {
  nome: 'Beber 2L de água',
  categoria: 'hidratacao',
  emoji: '💧',
  frequenciaSemanall: 7,
  metaDiaria: '2 litros'
});

// Marcar como completo
await meb.marcarHabitoCompleto(habito.id);

// Ver streak
const streak = await meb.obterStreakHabito(habito.id);
console.log('Streak:', streak); // Deve ser 1
```

**Esperado:** Streak = 1 dia

### ☐ Passo 14: Testar Registrar Peso

```javascript
await meb.registrarPeso('PACIENTE_ID', 73.5);

// Verificar progresso
const historico = await meb.obterHistoricoPeso('PACIENTE_ID', 30);
console.log(historico);
```

**Esperado:** Novo peso registrado

### ☐ Passo 15: Testar Diário

```javascript
await meb.registrarDiario('PACIENTE_ID', {
  humor: 'feliz',
  energia: 8,
  saciedade: 8,
  qualidadeSono: 7,
  sintomas: ['energia_alta']
});

// Verificar
const diario = await meb.obterDiario('PACIENTE_ID');
console.log(diario);
```

**Esperado:** Entrada do diário salva

---

## ✅ CHECKLIST FINAL

### ✓ Setup Supabase
- [ ] Projeto criado
- [ ] SQL executado (16 tabelas + 9 funções)
- [ ] Credenciais copiadas
- [ ] RLS ativado

### ✓ Integração HTML
- [ ] Biblioteca JS adicionada
- [ ] Credenciais atualizadas
- [ ] Conectividade testada

### ✓ Dados de Teste
- [ ] 2 usuários criados
- [ ] 2 profiles criados
- [ ] 1 paciente criado
- [ ] 1 nutricionista criada

### ✓ Fluxos Testados
- [ ] Listar pacientes ✅
- [ ] Registrar refeição ✅
- [ ] Marcar hábito ✅
- [ ] Registrar peso ✅
- [ ] Registrar diário ✅

---

## 🎉 PRONTO!

Se todas as caixas acima estiverem ✅, seu MEB está 100% operacional!

**Próximos passos:**
1. Integrar autenticação (Sign up/Sign in)
2. Conectar os 18 HTMLs gradualmente
3. Testar cada tela
4. Deploy em produção

---

## 🆘 SE ALGO QUEBRAR

| Problema | Solução |
|----------|---------|
| "Erro 401" | Copie credenciais de novo |
| "CORS blocked" | Settings → API → Add domain |
| "Function not found" | Execute MEB-COMPLETO.sql novamente |
| "Dados vazios" | Verifique RLS policies |
| "Lentidão" | Verifique índices (fim do SQL) |

---

**Sucesso! 🚀**
