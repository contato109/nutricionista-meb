# 🔐 ETAPA 4: TESTAR LOGIN (10 min)

## 🎯 Objetivo
Testar se o sistema de autenticação funciona corretamente

---

## 📋 PASSO 1: Abrir 🔐_LOGIN.html

1. **Na sua máquina, encontre:** `🔐_LOGIN.html`
2. **Clique 2x para abrir** no navegador
3. **Você verá:** Uma página de login MEB com 2 abas:
   - "Entrar" (login)
   - "Cadastre-se" (novo usuário)

---

## 📋 PASSO 2: Encontrar as Credenciais no Arquivo

1. **No arquivo `🔐_LOGIN.html`, procure por (Ctrl+F):**
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```

2. **Você verá algo assim no início do `<script>`:**
   ```javascript
   <script>
     const SUPABASE_URL = 'YOUR_SUPABASE_URL';
     const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```

---

## 📋 PASSO 3: Substituir Credenciais

**ANTES (como está agora):**
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

**DEPOIS (com suas credenciais):**
```javascript
const SUPABASE_URL = 'https://seu-projeto-xyz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...';
```

**Como fazer:**
1. Abra o arquivo em um editor de texto (VS Code, Notepad++, etc)
2. Procure por `YOUR_SUPABASE_URL`
3. **Selecione apenas** `YOUR_SUPABASE_URL` (sem as aspas)
4. **Substitua** pela sua URL do Supabase
5. **Repita** para `YOUR_SUPABASE_ANON_KEY`
6. **Salve** (Ctrl+S)

---

## 📋 PASSO 4: Recarregar Página

1. **Volte ao navegador** com `🔐_LOGIN.html` aberto
2. **Pressione:** F5 (para recarregar)
3. **Aguarde:** Página deve carregar sem erros

---

## 📋 PASSO 5: Criar Usuário de Teste

1. **Na página, clique na aba:** **"Cadastre-se"**
2. **Preencha os campos:**
   ```
   Nome:     Teste
   Email:    teste@test.com
   Tipo:     Paciente (clique no emoji 👤)
   Senha:    SenhaForte123
   ```

3. **Clique:** Botão "Cadastrar"

**✅ ESPERADO:** 
```
Cadastro realizado!
Você será redirecionado para login...
```

4. **Aguarde:** Página redireciona para login (automático em 2s)

---

## 📋 PASSO 6: Fazer Login

1. **Agora na aba "Entrar":**
   ```
   Email:    teste@test.com
   Senha:    SenhaForte123
   ```

2. **Clique:** Botão "Entrar"

**✅ ESPERADO:**
```
Entrando...
(após 2-3 segundos)
Redireciona para dashboard
```

---

## 🎯 Resultado Esperado

Se tudo funcionou, você deve ver:

```
✅ Cadastro criado no Supabase
✅ Login funcionando
✅ Token JWT sendo gerado
✅ Redirecionado para dashboard
✅ Sistema de autenticação FUNCIONA!
```

---

## 🚨 Possíveis Erros

### ❌ "Erro 401 - Credenciais inválidas"
**Causa:** URL ou Anon Key errada
**Solução:** Copie novamente do Supabase (Settings → API)

### ❌ "Network error / CORS"
**Causa:** Credenciais não foram atualizadas
**Solução:** Verifique se salvou o arquivo e recarregou (F5)

### ❌ "Email já existe"
**Causa:** Você já criou esse usuário antes
**Solução:** Use outro email (teste2@test.com)

### ❌ "Nada acontece quando clica"
**Causa:** Arquivo não foi salvo corretamente
**Solução:** Abra em um editor, verifique credenciais, salve novamente

---

## ✅ Próximo Passo

Se tudo funcionou → **ETAPA 5: ENTENDER ARQUITETURA**

Se deu erro → Avise qual foi e conserto com você!

