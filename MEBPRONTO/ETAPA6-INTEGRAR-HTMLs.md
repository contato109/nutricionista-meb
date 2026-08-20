# 🔌 ETAPA 6: INTEGRAR EM SEUS 18 HTMLs (60 min)

## 🎯 Objetivo
Adicionar autenticação e funcionalidades MEB em cada um dos seus 18 HTMLs

---

## 📋 TEMPLATE BASE - Copiar e Colar em Cada HTML

Este é o bloco que você vai adicionar em **CADA UM** dos seus 18 HTMLs.

### PASSO 1: Adicionar Scripts (antes de `</body>`)

**COPIE ISTO:**
```html
  <!-- MEB System Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
  <script src="meb-auth-sistema.js"></script>
  <script src="meb-client-corrigido.js"></script>
  <script src="meb-graficos.js"></script>
  <script src="meb-notificacoes.js"></script>
</body>
```

**COLE:** Logo antes do `</body>` do seu HTML

---

### PASSO 2: Adicionar Configuração (início do `<script>` do seu HTML)

**COPIE ISTO:**
```javascript
// ========== MEB CONFIGURATION ==========
const SUPABASE_URL = 'https://seu-projeto-xyz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// Initialize MEB
const auth = new MEBAuth(SUPABASE_URL, SUPABASE_ANON_KEY);
const meb = new MEBClient(SUPABASE_URL, SUPABASE_ANON_KEY);
meb.initializeAuth(auth);
const notificacoes = inicializarNotificacoes();

// Protect Page - Redireciona se não autenticado
if (!auth.isAuthenticated()) {
  window.location.href = '/🔐_LOGIN.html';
}

// ========== FIM MEB CONFIGURATION ==========
```

**COLE:** No início do seu bloco `<script>` existente

---

### PASSO 3: Verificar Role (se necessário)

**SE É PÁGINA DE NUTRICIONISTA, adicione:**
```javascript
// Verificar se é nutricionista
if (!auth.isNutricionista()) {
  alert('Acesso restrito a nutricionistas');
  window.location.href = '/🔐_LOGIN.html';
}

const nutricionistaId = auth.user.id;
// Agora use 'nutricionistaId' em suas queries
```

**SE É PÁGINA DE PACIENTE, adicione:**
```javascript
// Verificar se é paciente
if (!auth.isPaciente()) {
  alert('Acesso restrito a pacientes');
  window.location.href = '/🔐_LOGIN.html';
}

const pacienteId = auth.user.id;
// Agora use 'pacienteId' em suas queries
```

---

### PASSO 4: Adicionar Navbar (recomendado)

**COPIE ISTO (adicionar antes do `<body>`):**

```html
<nav style="background: #5C6B3A; color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
  <div style="display: flex; align-items: center; gap: 20px;">
    <h1 style="margin: 0; font-size: 24px; font-weight: bold;">MEB</h1>
    <span id="page-title" style="font-size: 16px; opacity: 0.9;"></span>
  </div>
  <div style="display: flex; align-items: center; gap: 15px;">
    <span id="user-name" style="font-size: 14px;">Carregando...</span>
    <button onclick="fazerLogout()" style="background: white; color: #5C6B3A; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">Sair</button>
  </div>
</nav>

<script>
  // Mostrar nome do usuário na navbar
  document.getElementById('user-name').textContent = auth.user.nome || auth.user.email;
  
  // Função de logout
  async function fazerLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
      await auth.logout();
      window.location.href = '/🔐_LOGIN.html';
    }
  }
</script>
```

---

## 🔄 Fluxo Completo - Um Arquivo Como Exemplo

### ANTES (seu HTML atual):
```html
<!DOCTYPE html>
<html>
<head>
  <title>Meu Painel</title>
</head>
<body>
  <h1>Meu Painel</h1>
  
  <script>
    // Seu código existente aqui
    const dados = [...];
  </script>
</body>
</html>
```

### DEPOIS (com MEB integrado):
```html
<!DOCTYPE html>
<html>
<head>
  <title>Meu Painel</title>
</head>
<body>
  <!-- NAVBAR MEB -->
  <nav style="background: #5C6B3A; color: white; padding: 15px; display: flex; justify-content: space-between;">
    <h1 style="margin: 0;">MEB</h1>
    <div>
      <span id="user-name">Carregando...</span>
      <button onclick="fazerLogout()" style="background: white; color: #5C6B3A; border: none; padding: 8px 15px; cursor: pointer; margin-left: 10px;">Sair</button>
    </div>
  </nav>

  <h1>Meu Painel</h1>
  
  <!-- MEB SCRIPTS -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
  <script src="meb-auth-sistema.js"></script>
  <script src="meb-client-corrigido.js"></script>
  <script src="meb-graficos.js"></script>
  <script src="meb-notificacoes.js"></script>

  <script>
    // ========== MEB SETUP ==========
    const SUPABASE_URL = 'https://seu-projeto.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGc...';

    const auth = new MEBAuth(SUPABASE_URL, SUPABASE_ANON_KEY);
    const meb = new MEBClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    meb.initializeAuth(auth);
    const notificacoes = inicializarNotificacoes();

    if (!auth.isAuthenticated()) {
      window.location.href = '/🔐_LOGIN.html';
    }

    // Mostrar nome do usuário
    document.getElementById('user-name').textContent = auth.user.nome;

    async function fazerLogout() {
      if (confirm('Deseja sair?')) {
        await auth.logout();
        window.location.href = '/🔐_LOGIN.html';
      }
    }
    // ========== FIM MEB SETUP ==========

    // Seu código existente aqui (ABAIXO do setup MEB)
    const dados = [...];
  </script>
</body>
</html>
```

---

## 💡 Exemplos de Uso - Dentro do Seu JavaScript

### Exemplo 1: Listar Pacientes (Nutricionista)
```javascript
// ANTES: dados hardcoded
const pacientes = [
  { id: 1, nome: 'Ana', peso: 75 },
  { id: 2, nome: 'Bruno', peso: 82 }
];

// DEPOIS: dados reais do banco
let pacientes = [];

async function carregarPacientes() {
  pacientes = await meb.listarPacientes(auth.user.id);
  renderizarPacientes(pacientes); // sua função existente
}

document.addEventListener('DOMContentLoaded', carregarPacientes);
```

### Exemplo 2: Registrar Refeição (Paciente)
```javascript
async function registrarRefeicao() {
  const form = document.getElementById('form-refeicao');
  
  const resultado = await meb.registrarRefeicao(auth.user.id, {
    tipo: form.tipo.value,
    alimentos: form.alimentos.value,
    anotacoes: form.anotacoes.value,
    fotoUrl: 'https://...' // ou vazio
  });

  if (resultado.success) {
    notificacoes.sucesso('Refeição registrada!', 'Sucesso');
    form.reset();
  }
}
```

### Exemplo 3: Marcar Hábito Completo
```javascript
async function marcarHabitoCompleto(habitoId) {
  const resultado = await meb.marcarHabitoCompleto(habitoId);
  
  if (resultado.success) {
    const streak = resultado.streak;
    notificacoes.sucesso(`Hábito marcado! Streak: ${streak} 🔥`);
    
    // Atualizar UI
    document.getElementById(`habito-${habitoId}`).classList.add('completado');
  }
}
```

### Exemplo 4: Ver Gráfico de Peso (Paciente)
```javascript
async function mostrarGraficosPeso() {
  const historico = await meb.obterHistoricoPeso(auth.user.id, 90);
  
  const graficos = new MEBGraficos();
  graficos.criarGraficoProgressoPeso('canvas-peso', historico);
}
```

---

## 📋 CHECKLIST - Para Cada HTML

Para **CADA UM** dos seus 18 HTMLs:

- [ ] Adicionou `<script src="meb-*.js">` antes de `</body>`
- [ ] Adicionou configuração (SUPABASE_URL, SUPABASE_ANON_KEY)
- [ ] Adicionou proteção: `if (!auth.isAuthenticated())`
- [ ] Se nutricionista: verificou `auth.isNutricionista()`
- [ ] Se paciente: verificou `auth.isPaciente()`
- [ ] Adicionou navbar (recomendado)
- [ ] Salvou o arquivo
- [ ] Testou abrindo no navegador (deve redirecionar para login se não autenticado)

---

## ⏱️ Tempo Estimado

- **Template** (copiar/colar): 5 min
- **× 18 HTMLs**: 5 min × 18 = **90 minutos** (1.5h)
- **Se arrastar**: até 2 horas

💡 **Dica:** Faça os primeiros 3 arquivos com cuidado. Depois fica automático!

---

## ✅ Próximo Passo

→ **ETAPA 7: TESTAR CADA FUNCIONALIDADE**

Depois de integrar todos, você testa cada feature.

