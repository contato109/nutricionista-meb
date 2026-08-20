# 🔐 IMPLEMENTAR AUTENTICAÇÃO - GUIA RÁPIDO

## O que foi criado

✅ **meb-auth-sistema.js** - Sistema completo de autenticação
✅ **🔐_LOGIN.html** - Página de login/signup
✅ **2-exemplo-painel-nutri-autenticado.html** - Exemplo de integração
✅ **snippets-autenticacao.html** - 10 snippets prontos para copiar
✅ **GUIA-AUTENTICACAO.md** - Documentação completa

---

## 🚀 5 PASSOS PARA COMEÇAR

### PASSO 1: Atualizar credenciais

Em **🔐_LOGIN.html**, procure por:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

Substitua por seus valores:
```javascript
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOi...';
```

### PASSO 2: Testar página de login

1. Abra `🔐_LOGIN.html` no navegador
2. Clique em "Cadastre-se"
3. Preencha os campos:
   - Nome: "Teste"
   - Email: "teste@test.com"
   - Tipo: "Paciente"
   - Senha: "SenhaForte123"
4. Clique "Cadastrar"

**Esperado:** "Cadastro realizado! Verifique seu email..."

### PASSO 3: Fazer login

1. Volte para login
2. Preencha Email: "teste@test.com"
3. Preencha Senha: "SenhaForte123"
4. Clique "Entrar"

**Esperado:** Redireciona para dashboard (por enquanto mostra erro 404, isso é normal)

### PASSO 4: Integrar em cada HTML

Para cada um dos seus 18 HTMLs, adicione NO INÍCIO:

```html
<!-- No topo do <body> -->
<script src="meb-auth-sistema.js"></script>
<script src="meb-client-corrigido.js"></script>

<script>
  const SUPABASE_URL = 'https://seu-projeto.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOi...';

  const auth = new MEBAuth(SUPABASE_URL, SUPABASE_ANON_KEY);
  const meb = new MEBClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  meb.initializeAuth(auth);

  // Proteger página
  if (!auth.isAuthenticated()) {
    window.location.href = '/🔐_LOGIN.html';
  }
</script>
```

### PASSO 5: Testar integração

1. Abra um HTML após adicionar código de autenticação
2. Deve redirecionar para login (porque não está autenticado)
3. Faça login com suas credenciais
4. Deve carregar a página (e você verá o erro ao usar dados reais)

---

## 📋 CHECKLIST POR TIPO DE PÁGINA

### Para páginas de NUTRICIONISTA (⚕️_PAINEL_NUTRI.html, etc)

```javascript
// Proteger + verificar role
if (!auth.isAuthenticated()) {
  window.location.href = '/🔐_LOGIN.html';
}

if (!auth.isNutricionista()) {
  alert('Acesso restrito a nutricionistas');
  window.location.href = '/📱_TELA_PACIENTE.html';
}

const nutricionistaId = auth.user.id;
```

### Para páginas de PACIENTE (📱_TELA_PACIENTE.html, etc)

```javascript
// Proteger + verificar role
if (!auth.isAuthenticated()) {
  window.location.href = '/🔐_LOGIN.html';
}

if (!auth.isPaciente()) {
  alert('Acesso restrito a pacientes');
  window.location.href = '/⚕️_PAINEL_NUTRI.html';
}

const pacienteId = auth.user.id;
```

### Para páginas COMPARTILHADAS (Comunidade, Biblioteca, etc)

```javascript
// Apenas proteger, sem verificar role
if (!auth.isAuthenticated()) {
  window.location.href = '/🔐_LOGIN.html';
}

// Mostrar conteúdo diferente conforme role
if (auth.isNutricionista()) {
  // Mostrar painel nutricionista
}

if (auth.isPaciente()) {
  // Mostrar tela paciente
}
```

---

## 🧠 COMO USAR O USUÁRIO AUTENTICADO

### Obter informações do usuário

```javascript
const usuario = auth.getCurrentUser();

console.log(usuario.id);      // UUID único
console.log(usuario.nome);    // Nome completo
console.log(usuario.email);   // Email
console.log(usuario.role);    // 'nutricionista' ou 'paciente'
```

### Usar em queries ao banco de dados

```javascript
// Exemplo 1: Nutricionista listar seus pacientes
const pacientes = await meb.listarPacientes(auth.user.id);

// Exemplo 2: Paciente registrar refeição
await meb.registrarRefeicao(auth.user.id, {
  tipo: 'almoco',
  alimentos: ['frango', 'salada'],
  descricao: 'Almoço',
  fotoUrl: null
});

// Exemplo 3: Qualquer um enviar mensagem
await meb.enviarMensagem(pacienteId, nutricionistaId, auth.user.id, 'Oi!');
```

### Escutar mudanças de autenticação

```javascript
const unsubscribe = auth.onAuthStateChange((eventType, user) => {
  if (eventType === 'login') {
    console.log('Usuário fez login:', user);
    // Recarregar dados
    carregarPacientes();
  } else if (eventType === 'logout') {
    console.log('Usuário fez logout');
    // Limpar UI
  }
});

// Parar de escutar quando sair da página
window.addEventListener('beforeunload', unsubscribe);
```

---

## 🎯 ESTRUTURA RECOMENDADA

```
/🔐_LOGIN.html                           ← Página de autenticação
├── Formulário de login
└── Formulário de signup

/⚕️_PAINEL_NUTRI.html                   ← Dashboard nutricionista
├── Navbar com logout
├── Lista de pacientes
├── Gráficos de progresso
└── Mensagens não lidas

/📱_TELA_PACIENTE.html                  ← Dashboard paciente
├── Navbar com logout
├── Registro de refeições
├── Marcação de hábitos
├── Histórico de peso
└── Entrada de diário

/🎥_ONBOARDING.html                     ← Página compartilhada
├── Conteúdo para nutricionista
└── Conteúdo para paciente

/[Outros 13 HTMLs com proteção]
```

---

## 🔍 VERIFICAR SE ESTÁ FUNCIONANDO

No console do navegador (F12 → Console):

```javascript
// Verificar autenticação
auth.isAuthenticated()                  // true/false

// Ver usuário
auth.getCurrentUser()                   // { id, email, role, nome }

// Ver token
auth.getAccessToken()                   // "eyJ..."

// Fazer logout
await auth.logout()

// Fazer login
const result = await auth.signIn('test@test.com', 'SenhaForte123')
```

---

## ⚠️ PROBLEMAS COMUNS

### "Erro 401 Unauthorized"
→ Verificar que SUPABASE_ANON_KEY está correto e completo

### "CORS blocked"
→ Supabase → Settings → API → Allowed Origins
→ Adicionar seu domínio: http://localhost:3000 ou similar

### "Cadastro falha"
→ Verificar que email não existe ainda
→ Verificar que senha tem +8 caracteres
→ Verificar console para mensagem de erro exata

### "Página redireciona para login mesmo autenticado"
→ Verificar que auth.isAuthenticated() retorna true
→ Verificar localStorage: `localStorage.getItem('meb_access_token')`
→ Se vazio, fazer login novamente

### "Erro ao listar pacientes"
→ Verificar que usuario é nutricionista
→ Verificar que MEBClient está inicializado com auth
→ Verificar que há pacientes criados no banco

---

## 📊 DADOS NO localStorage

Após autenticação, você terá:

```javascript
// Token JWT (usado para autorizar requests)
localStorage.getItem('meb_access_token')
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJz..."

// Dados do usuário (para UI)
localStorage.getItem('meb_user')
// {"id":"uuid...","email":"user@test.com","role":"paciente","nome":"Teste"}
```

Para limpar (logout):
```javascript
localStorage.removeItem('meb_access_token');
localStorage.removeItem('meb_user');
```

---

## 🛡️ SEGURANÇA

✅ **Implementado:**
- Token JWT (autorização)
- localStorage (persistência)
- RLS policies (isolamento de dados)
- Validação de role (nutricionista vs paciente)
- HTTPS only headers

⚠️ **Para produção:**
- Usar variáveis de ambiente (não hardcoded)
- HTTPS obrigatório
- CSP headers
- Refresh token (próxima fase)
- Email verification

---

## 📞 EXEMPLO COMPLETO EM 1 HTML

```html
<!DOCTYPE html>
<html>
<head>
  <title>MEB - Exemplo</title>
</head>
<body>
  <button onclick="fazerLogout()">Sair</button>

  <div id="conteudo">Carregando...</div>

  <script src="meb-auth-sistema.js"></script>
  <script src="meb-client-corrigido.js"></script>

  <script>
    const SUPABASE_URL = 'https://seu-projeto.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOi...';

    const auth = new MEBAuth(SUPABASE_URL, SUPABASE_ANON_KEY);
    const meb = new MEBClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    meb.initializeAuth(auth);

    // Proteger
    if (!auth.isAuthenticated()) {
      window.location.href = '/🔐_LOGIN.html';
    }

    // Usar
    async function carregar() {
      if (auth.isNutricionista()) {
        const pacientes = await meb.listarPacientes(auth.user.id);
        document.getElementById('conteudo').innerHTML = `
          <h1>Olá ${auth.user.nome}</h1>
          <p>Você tem ${pacientes.length} pacientes</p>
        `;
      }
    }

    async function fazerLogout() {
      await auth.logout();
      window.location.href = '/🔐_LOGIN.html';
    }

    carregar();
  </script>
</body>
</html>
```

---

## 🎉 PRÓXIMO PASSO

Após testar autenticação em 2-3 HTMLs:

**Fase 3: Dashboards e Gráficos**
- Gráficos de progresso de peso
- KPIs do nutricionista
- Visualização de hábitos
- Charts com Chart.js ou Recharts

---

**Status:** ✅ Autenticação 100% implementada

Próximo: Integrar em seus 18 HTMLs + criar dashboards com gráficos
