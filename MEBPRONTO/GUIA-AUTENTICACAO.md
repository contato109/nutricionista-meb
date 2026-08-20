# 🔐 GUIA DE AUTENTICAÇÃO MEB

## O que você tem

### 1. **meb-auth-sistema.js** (Class MEBAuth)
Sistema completo de autenticação com Supabase Auth:
- ✅ Sign up (novo usuário)
- ✅ Sign in (login)
- ✅ Logout
- ✅ Gerenciamento de sessão (localStorage)
- ✅ Recuperação de senha
- ✅ Atualização de perfil
- ✅ Event listeners (onAuthStateChange)
- ✅ Renovação de token

### 2. **🔐_LOGIN.html** (Página de autenticação)
Interface completa com:
- 📝 Formulário de login
- 📋 Formulário de cadastro
- 👤 Seletor de role (Paciente / Nutricionista)
- 🎨 Design MEB (cores, ícones)
- ⚡ Validação cliente
- 🔄 Alternância entre login/signup
- 💾 Integração com meb-auth-sistema.js

---

## 🚀 COMEÇAR (5 minutos)

### Passo 1: Adicionar credenciais ao 🔐_LOGIN.html

```javascript
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOi...sua-chave-completa...';
```

### Passo 2: Testar login

1. Abra `🔐_LOGIN.html` no navegador
2. Clique em "Cadastre-se"
3. Preencha:
   - Nome: "Teste"
   - Email: "teste@test.com"
   - Tipo: "Paciente" (👤)
   - Senha: "SenhaForte123"
4. Clique "Cadastrar"

**Esperado:** Mensagem "Cadastro realizado!"

### Passo 3: Fazer login

1. Preencha Email e Senha
2. Clique "Entrar"

**Esperado:** Redireciona para dashboard do paciente

---

## 📱 INTEGRAÇÃO NOS SEUS HTMLs

Cada um dos seus 18 HTMLs precisa usar a autenticação. Aqui como:

### Opção A: Proteger página (Redirecionar não-autenticados)

```html
<!-- No topo do seu arquivo HTML -->
<script src="meb-auth-sistema.js"></script>
<script>
  const auth = new MEBAuth('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

  // Se não autenticado, redireciona para login
  if (!auth.isAuthenticated()) {
    window.location.href = '/🔐_LOGIN.html';
  }

  // Agora você tem acesso ao usuário autenticado
  const usuario = auth.getCurrentUser();
  console.log('Usuário:', usuario);
</script>
```

### Opção B: Usar dados do usuário logado

```javascript
const auth = new MEBAuth(SUPABASE_URL, SUPABASE_ANON_KEY);

// Verificar se é nutricionista
if (auth.isNutricionista()) {
  // Mostrar painel nutricionista
  document.getElementById('painel-nutri').style.display = 'block';
}

// Verificar se é paciente
if (auth.isPaciente()) {
  // Mostrar tela paciente
  document.getElementById('tela-paciente').style.display = 'block';
}

// Obter ID do usuário
const userId = auth.user.id; // Para usar em queries
```

### Opção C: Usar no MEBClient (Integração automática)

```javascript
const auth = new MEBAuth(SUPABASE_URL, SUPABASE_ANON_KEY);
const meb = new MEBClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Inicializar autenticação no client
meb.initializeAuth(auth);

// Agora todas as chamadas do MEBClient incluem o token automaticamente
const pacientes = await meb.listarPacientes(auth.user.id);
```

---

## 🔄 FLUXO TÍPICO

```
🔐_LOGIN.html
    ↓
  [Sign up] ou [Sign in]
    ↓
  Supabase Auth (criar usuário + token)
    ↓
  localStorage (salvar token + user)
    ↓
  Redirecionar para:
    • /⚕️_PAINEL_NUTRI.html (se nutricionista)
    • /📱_TELA_PACIENTE.html (se paciente)
    ↓
  Páginas protegidas verificam:
    if (!auth.isAuthenticated()) {
      redirecionar para login
    }
```

---

## 💾 ESTRUTURA DO TOKEN (localStorage)

Após autenticação, você terá 2 itens no localStorage:

```javascript
// Token JWT
localStorage.getItem('meb_access_token')
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Dados do usuário
localStorage.getItem('meb_user')
// {
//   "id": "uuid-do-usuario",
//   "email": "user@email.com",
//   "role": "nutricionista" ou "paciente",
//   "nome": "Seu Nome"
// }
```

---

## 🛡️ SEGURANÇA

### ✅ O que está implementado

1. **HTTPS Only** - Token enviado via header Authorization
2. **RLS ativado** - Supabase garante isolamento de dados
3. **Sem exposição de senha** - Supabase Auth gerencia tudo
4. **Token em localStorage** - Persiste entre abas/refreshes
5. **Validação cliente** - Evita submissões inválidas

### ⚠️ Em produção, fazer também

```javascript
// 1. Usar variáveis de ambiente
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

// 2. HTTPS obrigatório
// (Seu hosting deve forçar HTTPS)

// 3. CSP headers (Content Security Policy)
// Configurar no servidor/hosting

// 4. Refresh token (implementação futura)
// Atualmente usa access token com expiração
```

---

## 📞 MÉTODOS DISPONÍVEIS

### Autenticação

```javascript
// Cadastro novo
await auth.signUp(email, password, nome, role)
// role: 'paciente' ou 'nutricionista'

// Login
await auth.signIn(email, password)

// Logout
await auth.logout()

// Redefinir senha
await auth.requestPasswordReset(email)
```

### Verificação

```javascript
// Verificar se autenticado
auth.isAuthenticated() // true/false

// Obter usuário atual
auth.getCurrentUser() // { id, email, role, nome }

// Verificar role
auth.isNutricionista() // true/false
auth.isPaciente()      // true/false

// Obter token
auth.getAccessToken() // "eyJ..."
```

### Perfil

```javascript
// Atualizar dados do usuário
await auth.updateProfile({
  nome: 'Novo Nome',
  // Outros campos do profile
})
```

### Event Listeners

```javascript
// Escutar mudanças de autenticação
const unsubscribe = auth.onAuthStateChange((eventType, data) => {
  if (eventType === 'login') {
    console.log('Usuário fez login:', data);
  } else if (eventType === 'logout') {
    console.log('Usuário fez logout');
  }
});

// Parar de escutar
unsubscribe();
```

---

## 🧪 TESTE RÁPIDO NO CONSOLE

```javascript
// 1. Abrir DevTools (F12)
// 2. Ir para Console
// 3. Executar:

const auth = new MEBAuth(SUPABASE_URL, SUPABASE_ANON_KEY);

// Verificar se autenticado
console.log('Autenticado?', auth.isAuthenticated());

// Ver usuário atual
console.log('Usuário:', auth.getCurrentUser());

// Ver token
console.log('Token:', auth.getAccessToken());
```

---

## ❌ TROUBLESHOOTING

### "Erro 401 Unauthorized"
→ Verificar SUPABASE_ANON_KEY (copiar novamente)

### "CORS blocked"
→ Settings → API → Allowed Origins
→ Adicionar seu domínio (http://localhost:3000, etc)

### "Cadastro falha com erro"
→ Verificar que email não existe
→ Verificar que senha tem +8 caracteres
→ Verificar Supabase Dashboard → Authentication → Users

### "Logout não funciona"
→ localStorage está sendo limpo corretamente
→ Verificar que você chama `await auth.logout()`

### "Token expira e perde sessão"
→ Implementar refresh token (veja próxima fase)

---

## 🎯 PRÓXIMAS FASES

### Fase 2a: Refresh Token (Semana 2)
- Implementar refresh_token no Supabase
- Auto-renovar token antes de expirar
- Melhorar UX (menos "expirações surpresa")

### Fase 2b: Email Verification (Semana 2)
- Enviar email de confirmação após signup
- Bloquear login até confirmar email
- Re-enviar email se não recebeu

### Fase 2c: Social Login (Semana 3)
- Google OAuth
- GitHub OAuth
- Integração com Supabase Auth

---

## 📚 ESTRUTURA DO PROJETO

```
/
├── 🔐_LOGIN.html              ← Página de autenticação
├── meb-auth-sistema.js         ← Class MEBAuth
├── meb-client-corrigido.js     ← Client com suporte a auth
│
├── ⚕️_PAINEL_NUTRI.html        ← Adicionar: redirecionamento + auth.user
├── 📱_TELA_PACIENTE.html       ← Adicionar: redirecionamento + auth.user
├── [outros 16 HTMLs]           ← Adicionar: redirecionamento + auth.user
│
└── GUIA-AUTENTICACAO.md        ← Este arquivo
```

---

## ✨ EXEMPLO COMPLETO

Aqui está o mínimo que você precisa em cada HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Seu HTML</title>
</head>
<body>
  <div id="conteudo">
    <!-- Seu conteúdo -->
  </div>

  <script src="meb-auth-sistema.js"></script>
  <script src="meb-client-corrigido.js"></script>

  <script>
    const SUPABASE_URL = 'YOUR_SUPABASE_URL';
    const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

    const auth = new MEBAuth(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Proteger página
    if (!auth.isAuthenticated()) {
      window.location.href = '/🔐_LOGIN.html';
    }

    // Seu código aqui
    console.log('Usuário:', auth.getCurrentUser());
  </script>
</body>
</html>
```

---

**Pronto! 🚀 Você tem autenticação completa.**

Próximo passo: Integrar em cada um dos 18 HTMLs
