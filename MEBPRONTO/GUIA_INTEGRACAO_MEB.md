# GUIA DE INTEGRAÇÃO MEB + SUPABASE

## ✅ O QUE FOI CRIADO

1. **schema.sql** - Schema PostgreSQL completo com 16 tabelas
2. **edge-functions.sql** - 10 funções SQL + triggers
3. **meb-supabase-client.js** - Biblioteca JavaScript para integração

---

## 🚀 PASSO 1: Criar Projeto Supabase

1. Acesse https://supabase.com/dashboard
2. Clique em "New Project"
3. Nome: `meb-nutricao`
4. Região: `South America (São Paulo)` ou a mais próxima
5. Password: Use uma senha forte
6. Aguarde criar o projeto (~2 minutos)

---

## 🚀 PASSO 2: Executar Schema SQL

1. No Supabase Dashboard, vá para **SQL Editor**
2. Clique em **"New Query"**
3. Cole **TODO** o conteúdo do arquivo `schema.sql`
4. Clique em **"Run"** (Ctrl+Enter)
5. Copie as credenciais:
   - `SUPABASE_URL` (Settings → Configuration → API URL)
   - `SUPABASE_ANON_KEY` (Settings → Configuration → Project API Keys)

---

## 🚀 PASSO 3: Executar Edge Functions

1. No Supabase Dashboard, vá para **SQL Editor**
2. Clique em **"New Query"**
3. Cole **TODO** o conteúdo do arquivo `edge-functions.sql`
4. Clique em **"Run"**

---

## 🚀 PASSO 4: Atualizar HTMLs com Credenciais

Em cada arquivo HTML, substitua os placeholders:

```javascript
// ANTES
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// DEPOIS
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGc...sua-chave...';
```

---

## 🚀 PASSO 5: Adicionar Biblioteca MEB Client

Em cada HTML, adicione **antes do `</body>`**:

```html
<script src="meb-supabase-client.js"></script>
```

Ou copie o conteúdo diretamente num `<script>` tag.

---

## 📝 EXEMPLO: Conectar Painel do Nutricionista

### Antes (Dados simulados)
```javascript
// Array hardcoded
const PATIENTS_DATA = [
  { id: 'p1', name: 'Ana Paula Souza', ... },
  { id: 'p2', name: 'Roberta Lima', ... },
  // ... mais 6 pacientes ...
];
```

### Depois (Dados do Supabase)
```javascript
// Inicializar cliente
const meb = new MEBClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Carregar pacientes quando página inicia
async function loadPatients() {
  try {
    const nutricionistaId = 'user-id-da-nutricionista'; // Do auth
    const pacientes = await meb.listarPacientes(nutricionistaId);

    // Mapear estrutura para o que o código espera
    PATIENTS_DATA = pacientes.map(p => ({
      id: p.id,
      name: p.profiles?.name || 'Sem nome',
      initials: p.profiles?.name?.split(' ').slice(0, 2).map(x => x[0]).join('').toUpperCase(),
      goal: p.meta,
      plan: 'caminho', // Mapear do p.planos.nome
      status: p.status,
      age: 30, // Calcular da data de nascimento se tiver
      currentWeight: p.peso_atual_kg,
      goalWeight: p.peso_meta_kg,
      avatarColor: '#5C6B3A',
      notes: p.notas_nutricionista
    }));

    renderPatients();
  } catch (error) {
    console.error('Erro ao carregar pacientes:', error);
    showToast('Erro ao carregar pacientes', 'error');
  }
}

// Chamar ao inicializar
document.addEventListener('DOMContentLoaded', () => {
  loadPatients();
});
```

---

## 💬 EXEMPLO: Sistema de Mensagens

### Enviar Mensagem
```javascript
async function enviarMensagem(pacienteId, nutricionistaId, texto) {
  const currentUserId = 'seu-user-id'; // Do Supabase Auth

  try {
    await meb.enviarMensagem(
      pacienteId,
      nutricionistaId,
      currentUserId, // Seu ID (nutricionista)
      texto,
      'texto'
    );

    // Recarregar histórico
    await loadMensagens(pacienteId, nutricionistaId);
  } catch (error) {
    console.error('Erro ao enviar:', error);
  }
}
```

### Carregar Histórico
```javascript
async function loadMensagens(pacienteId, nutricionistaId) {
  const mensagens = await meb.obterMensagens(
    pacienteId,
    nutricionistaId,
    50 // Últimas 50
  );

  // Renderizar no DOM
  const chat = document.getElementById('chat-container');
  chat.innerHTML = mensagens.map(m => `
    <div class="msg ${m.remetente_id === currentUserId ? 'sent' : 'received'}">
      <p>${m.texto}</p>
      <span class="time">${new Date(m.criado_em).toLocaleTimeString()}</span>
    </div>
  `).join('');

  // Marcar como lidas
  await meb.marcarMensagensLidas(pacienteId, nutricionistaId);
}
```

---

## 🥗 EXEMPLO: Registrar Refeição

### Tela do Paciente
```javascript
async function registrarRefeicaoDia() {
  const pacienteId = currentUser.id;
  const dados = {
    tipo: 'almoco', // De um select
    descricao: 'Frango com arroz e salada',
    alimentos: ['frango', 'arroz', 'alface', 'tomate'],
    quantidades: ['150g', '150g', '100g', '100g'],
    calorias: 450,
    fotoUrl: null // URL da foto se upload
  };

  try {
    await meb.registrarRefeicao(pacienteId, dados);
    showToast('Refeição registrada! ✓');
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

### Visualizar no Painel
```javascript
async function loadRefeicoesDia(pacienteId) {
  const refeicoes = await meb.obterRefeicoesDia(pacienteId);

  const html = refeicoes.map(r => `
    <div class="meal-card">
      <h4>${r.tipo_refeicao}</h4>
      <p>${r.descricao}</p>
      <span class="cals">${r.calorias_estimadas} kcal</span>
    </div>
  `).join('');

  document.getElementById('meals-container').innerHTML = html;
}
```

---

## 📊 EXEMPLO: Registrar Peso e Calcular Progresso

```javascript
async function registrarPesoHoje(pesoKg) {
  const pacienteId = currentUser.id;

  try {
    const result = await meb.registrarPeso(pacienteId, pesoKg);
    // result = { peso_kg, percentual_progresso, restante_para_meta, dias_no_plano }

    // Atualizar UI
    document.getElementById('current-weight').textContent = result[0].peso_kg + ' kg';
    document.getElementById('progress-bar').style.width = result[0].percentual_progresso + '%';

    showToast(`Progresso: ${result[0].percentual_progresso}% ✓`);
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

---

## 📋 EXEMPLO: Cardápio da Semana

```javascript
async function loadCardapioSemana(pacienteId) {
  const cardapio = await meb.obterCardapioSemana(pacienteId);

  // Agrupar por dia
  const dias = {};
  cardapio.forEach(item => {
    if (!dias[item.dia_nome]) {
      dias[item.dia_nome] = [];
    }
    dias[item.dia_nome].push(item);
  });

  // Renderizar grid por dia
  Object.entries(dias).forEach(([dia, refeicoes]) => {
    const dayCard = document.createElement('div');
    dayCard.className = 'day-card';
    dayCard.innerHTML = `
      <h3>${dia}</h3>
      ${refeicoes.map(r => `
        <div class="meal">
          <strong>${r.tipo_refeicao}</strong>
          <p>${r.descricao}</p>
        </div>
      `).join('')}
    `;
    document.getElementById('cardapio-container').appendChild(dayCard);
  });
}
```

---

## 🎯 EXEMPLO: Diário + Hábitos

```javascript
// Registrar entrada do diário
async function registrarEntradaDiaria() {
  const pacienteId = currentUser.id;
  const dados = {
    humor: 'feliz',
    energia: 7.5,
    saciedade: 8,
    qualidadeSono: 7,
    notas: 'Dia muito produtivo!',
    sintomas: ['energia_alta']
  };

  await meb.registrarDiario(pacienteId, dados);
}

// Marcar hábito como completo
async function marcarHabitoCompleto(habitoId) {
  await meb.marcarHabitoCompleto(habitoId);
  updateHabitosUI();
}
```

---

## 🔐 SEGURANÇA - Row Level Security (RLS)

**Já está configurado no schema.sql:**

- ✅ Pacientes veem apenas seus próprios dados
- ✅ Nutricionista vê apenas seus pacientes
- ✅ Comunidade: pacientes veem posts de outros pacientes
- ✅ Mensagens: privadas entre paciente e nutricionista

**Para testar RLS:**
1. Supabase Dashboard → Authentication
2. Criar usuários de teste
3. Verificar que dados de um paciente não aparecem para outro

---

## 🆔 MAPEAMENTO DE DADOS

Seu código usa:
```javascript
p.id           → pacientes.id (UUID)
p.name         → profiles.name
p.goal         → pacientes.meta
p.plan         → planos.nome ('caminho', 'transformacao', 'jornada')
p.status       → pacientes.status ('ativa', 'pausada', etc)
p.currentWeight → pacientes.peso_atual_kg
p.goalWeight    → pacientes.peso_meta_kg
```

---

## 🚨 PROBLEMAS COMUNS

### "Erro 401: Unauthorized"
- ❌ Chave API incorreta
- ✅ Copiar SUPABASE_ANON_KEY de novo

### "Erro CORS"
- ❌ Domain não whitelisted
- ✅ Supabase Dashboard → Settings → Security → Add Origin

### "Row not found"
- ❌ Usuário não tem acesso por RLS
- ✅ Verificar policies e autenticação

### "Timeout na requisição"
- ❌ Índices não criados
- ✅ Verificar que todos índices foram criados (fim do schema.sql)

---

## 📱 INTEGRANDO A TELA DO PACIENTE

```javascript
// No _TELA_PACIENTE.html
document.addEventListener('DOMContentLoaded', async () => {
  const meb = new MEBClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const pacienteId = currentUser.id; // Do Supabase Auth

  // Abas principais
  const abasCarregadas = {
    inicio: loadInicio(meb, pacienteId),
    cardapio: loadCardapio(meb, pacienteId),
    diario: loadDiario(meb, pacienteId),
    chat: loadChat(meb, pacienteId),
    perfil: loadPerfil(meb, pacienteId)
  };

  // ... resto do código
});
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Criar projeto Supabase
- [ ] Copiar SUPABASE_URL e SUPABASE_ANON_KEY
- [ ] Executar schema.sql
- [ ] Executar edge-functions.sql
- [ ] Adicionar meb-supabase-client.js aos HTMLs
- [ ] Substituir PATIENTS_DATA por meb.listarPacientes()
- [ ] Conectar sistema de mensagens
- [ ] Conectar registro de refeições
- [ ] Conectar cardápio
- [ ] Conectar peso e progresso
- [ ] Testar com dados reais
- [ ] Configurar autenticação com Supabase Auth

---

## 📞 PRÓXIMOS PASSOS

1. **Supabase Auth**: Configurar signup/signin nos aplicativos
2. **Upload de Fotos**: Integrar Supabase Storage
3. **Notificações em Tempo Real**: Usar RealtimeDB para chat
4. **Relatórios**: Criar dashboards com dados agregados
5. **Backup**: Agendar backups automáticos

---

**Pronto para começar! 🚀**
