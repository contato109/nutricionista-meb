# ⚡ ETAPAS 4-9 - GUIA RÁPIDO PARA TERMINAR

**Tempo restante:** ~1.5 horas

---

## 🎯 ETAPA 4: TESTAR LOGIN (10 min)

### PASSO 1: Copiar Anon Key
1. Acesse: https://supabase.com/dashboard/project/rboagbyxhkztzzmwyucb
2. Menu esquerdo: **Settings → API**
3. Procure por **"Anon public"** (não service role!)
4. Clique no ícone de cópia
5. Copie o valor inteiro (começa com `eyJ...`)

### PASSO 2: Colar no Login
1. Abra arquivo: `🔐_LOGIN.html` em editor de texto
2. Procure por: `COPIE_E_COLE_SUA_ANON_KEY_AQUI`
3. **SUBSTITUA** por sua anon key copiada
4. **SALVE** o arquivo (Ctrl+S)

### PASSO 3: Testar
1. Clique 2x no arquivo `🔐_LOGIN.html` para abrir no navegador
2. Clique "Cadastre-se"
3. Preencha:
   ```
   Nome:      Teste Nutri
   Email:     testenutri@test.com
   Tipo:      ⚕️ Nutricionista
   Senha:     SenhaForte123
   ```
4. Clique "Cadastrar"
5. ✅ ESPERADO: "Cadastro realizado! Você será redirecionado..."
6. Faça login com mesmas credenciais
7. ✅ ESPERADO: Vai para dashboard

**✅ ETAPA 4 COMPLETA**

---

## 📚 ETAPA 5: ENTENDER ARQUITETURA (5 min - leitura rápida)

Leia: `ETAPA5-ARQUITETURA.md`

Principais pontos:
- ✅ 16 tabelas
- ✅ Hábitos é o CORE do sistema
- ✅ RLS automático (cada um vê seus dados)
- ✅ Sem calorias (conforme você pediu)

**✅ ETAPA 5 COMPLETA**

---

## 🔌 ETAPA 6: INTEGRAR EM 18 HTMLs (60 min)

### TEMPLATE PARA COPIAR/COLAR

**Em CADA um dos seus 18 HTMLs:**

#### PASSO 1: Adicionar Scripts (antes de `</body>`)
```html
  <!-- MEB System -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
  <script src="meb-auth-sistema.js"></script>
  <script src="meb-client-corrigido.js"></script>
  <script src="meb-graficos.js"></script>
  <script src="meb-notificacoes.js"></script>
</body>
```

#### PASSO 2: Adicionar Setup (início do seu `<script>`)
```javascript
// ========== MEB SETUP ==========
const SUPABASE_URL = 'https://rboagbyxhkztzzmwyucb.supabase.co';
const SUPABASE_ANON_KEY = '[SUA ANON KEY AQUI]'; // Copie a mesma de cima

const auth = new MEBAuth(SUPABASE_URL, SUPABASE_ANON_KEY);
const meb = new MEBClient(SUPABASE_URL, SUPABASE_ANON_KEY);
meb.initializeAuth(auth);
const notificacoes = inicializarNotificacoes();

// Proteger página
if (!auth.isAuthenticated()) {
  window.location.href = '/🔐_LOGIN.html';
}

// Se nutricionista
if (auth.isNutricionista()) {
  const nutricionistaId = auth.user.id;
  console.log('Nutricionista:', auth.user.nome);
}

// Se paciente
if (auth.isPaciente()) {
  const pacienteId = auth.user.id;
  console.log('Paciente:', auth.user.nome);
}
// ========== FIM MEB SETUP ==========
```

#### PASSO 3: Adicionar Navbar (antes de `<body>`)
```html
<nav style="background: #5C6B3A; color: white; padding: 15px; display: flex; justify-content: space-between;">
  <h1 style="margin: 0;">MEB</h1>
  <div>
    <span id="user-name">Carregando...</span>
    <button onclick="fazerLogout()" style="background: white; color: #5C6B3A; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-left: 10px;">Sair</button>
  </div>
</nav>

<script>
  document.getElementById('user-name').textContent = auth.user.nome;
  async function fazerLogout() {
    if (confirm('Deseja sair?')) {
      await auth.logout();
      window.location.href = '/🔐_LOGIN.html';
    }
  }
</script>
```

### Tempo por arquivo
- Primeiros 3: 15 min (mais cuidado)
- Próximos 15: 45 min (2-3 min cada)

**TOTAL: ~60 minutos**

**✅ ETAPA 6 COMPLETA**

---

## 🧪 ETAPA 7: TESTAR (15 min - rápido)

Em qualquer HTML que integrou:

1. **Login/Logout**
   - Abra página → redirecionou para login? ✅
   - Fez login → aparece nome? ✅
   - Clicou Sair → volta pro login? ✅

2. **Dados Carregam**
   - Página mostra dados do usuário? ✅
   - Navbar mostra nome? ✅

3. **Notificações**
   - Fazer uma ação → toast aparece? ✅

**✅ ETAPA 7 COMPLETA**

---

## 🤖 ETAPA 8: TESTES AUTOMATIZADOS (5 min)

No console do navegador (F12):

```javascript
const tester = new MEBTestes(SUPABASE_URL, SUPABASE_ANON_KEY);
await tester.executarTodos();
```

✅ ESPERADO: 9/9 testes passando

**✅ ETAPA 8 COMPLETA**

---

## 🚀 ETAPA 9: DEPLOY (10 min)

### Opção A: Netlify (RECOMENDADO)

1. Acesse: https://netlify.com
2. Clique "New site from Git"
3. Conecte seu GitHub
4. Selecione repositório do projeto MEB
5. Build command: (deixar vazio)
6. Publish directory: (deixar vazio)
7. Clique "Deploy"
8. Aguarde 2 min
9. Seu site estará em: `https://seu-site.netlify.app`

### Opção B: GitHub Pages (GRATUITO)

1. Vá para seu repo
2. Settings → Pages
3. Source: main branch
4. Save
5. Seu site está em: `https://usuario.github.io/seu-repo`

**✅ ETAPA 9 COMPLETA - VOCÊ ESTÁ NO AR! 🎉**

---

## 📊 RESUMO DO PROGRESSO

```
✅ ETAPA 1: Entender           (COMPLETO)
✅ ETAPA 2: Setup Supabase     (COMPLETO)
✅ ETAPA 3: Credenciais        (COMPLETO)
⏳ ETAPA 4: Testar Login       (10 min)
⏳ ETAPA 5: Arquitetura        (5 min)
⏳ ETAPA 6: Integrar HTMLs     (60 min)
⏳ ETAPA 7: Testar             (15 min)
⏳ ETAPA 8: Testes Auto        (5 min)
⏳ ETAPA 9: Deploy             (10 min)

TEMPO RESTANTE: ~105 minutos (1.5h)
```

---

## ⏱️ CRONÔMETRO

- **Agora:** Faça ETAPA 4 (10 min)
- **+15 min:** Faça ETAPA 5 (5 min)
- **+20 min:** Comece ETAPA 6 (60 min)
- **+80 min:** Faça ETAPAS 7-9 (30 min)

**TOTAL: ~2.5 horas desde o começo**

---

## ✅ VOCÊ CONSEGUE!

Falta pouco! Siga este guia rápido e seu sistema MEB está no ar em 1.5 horas! 🚀

**PRÓXIMO PASSO:** Copie a Anon Key e completa ETAPA 4!

