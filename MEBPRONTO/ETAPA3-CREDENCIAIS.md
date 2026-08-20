# 🔑 ETAPA 3: COPIAR CREDENCIAIS (2 min)

## 🎯 Objetivo
Pegar as credenciais do Supabase que você vai usar em TODOS os HTMLs

---

## 📋 PASSO 1: Abrir Settings

1. **No Supabase Dashboard**
2. **Menu esquerdo:** Clique em **"Settings"**
3. **Você verá:** Um menu com várias opções

---

## 📋 PASSO 2: Abrir API

1. **No Settings, clique:** **"API"** (próximo ao ícone de chave)
2. **Você verá:**
   ```
   Project URL
   Anon public
   Service role (não use!)
   ```

---

## 📋 PASSO 3: COPIAR Project URL

1. **Procure por:** `Project URL`
2. **Clique no ícone de cópia** (ou selecione manualmente)
3. **Exemplo do que vai aparecer:**
   ```
   https://abcxyz123.supabase.co
   ```
4. **COPIE:** Esse é seu `SUPABASE_URL`

**Salve em um bloco de notas:**
```
SUPABASE_URL = https://abcxyz123.supabase.co
```

---

## 📋 PASSO 4: COPIAR Anon Public

1. **Procure por:** `Anon public` (abaixo de Project URL)
2. **Clique no ícone de cópia**
3. **Exemplo do que vai aparecer:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY3h5ejEyMyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjkzNzI5NjAwLCJleHAiOjE4OTQyMDAwMDB9.ABC123XYZ...
   ```
4. **COPIE:** Esse é seu `SUPABASE_ANON_KEY`

**Salve em um bloco de notas:**
```
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ✅ Resultado Final

Você deve ter algo assim salvo:

```javascript
const SUPABASE_URL = 'https://seu-projeto-xyz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...';
```

✅ **Pronto!** Você tem as credenciais.

---

## 🚨 IMPORTANTE

⚠️ **NÃO COMPARTILHE** essas credenciais públicas (pode deixar no código)
⚠️ **NÃO USE** a "Service role key" (é privada)
⚠️ **USE APENAS** a "Anon public key"

---

## ✅ Próximo Passo

→ **ETAPA 4: TESTAR LOGIN**

Vou guiar você a abrir `🔐_LOGIN.html` e substituir as credenciais.

