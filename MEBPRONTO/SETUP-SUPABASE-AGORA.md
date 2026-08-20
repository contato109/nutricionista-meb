# ⚡ SETUP SUPABASE - FAÇA AGORA (10 min)

## 🎯 Objetivo
Criar banco de dados MEB no Supabase e executar todo o SQL

---

## 📋 PASSO 1: Criar Projeto Supabase

1. **Abra:** https://supabase.com/dashboard
2. **Clique:** "New Project"
3. **Preencha:**
   - Name: `meb-nutricao`
   - Region: **South America (São Paulo)** ← Importante!
   - Password: Crie uma senha forte (ex: `Meb@Nutri2024Strong!`)
4. **Clique:** "Create New Project"
5. **Aguarde:** ~2 minutos (vai aparecer "Your project is ready")

✅ **Esperado:** Você verá o dashboard do Supabase

---

## 📋 PASSO 2: Copiar SQL

1. **Abra:** Arquivo `MEB-COMPLETO.sql` em seu computador
2. **Selecione:** TODO o conteúdo (Ctrl+A)
3. **Copie:** (Ctrl+C)

✅ **Esperado:** Você tem todo o SQL copiado

---

## 📋 PASSO 3: Executar SQL no Supabase

1. **No Supabase Dashboard:**
   - Clique no menu esquerdo → **"SQL Editor"**
   - Clique → **"New Query"**

2. **Cole o SQL:**
   - Clique na área branca
   - Ctrl+V (para colar)

3. **Verifique:**
   - Deve aparecer muito código (1000+ linhas)
   - Procure por: `-- MEB COMPLETO` no início

4. **Execute:**
   - Pressione: **Ctrl+Enter** (ou clique "RUN")
   - Espere completar...

✅ **Esperado:**
```
✓ Success

Tables created: 16
Functions created: 9
Triggers created: 8
Indexes created: 12
```

---

## 📋 PASSO 4: Verificar Tabelas

1. **No Supabase, clique:** "Table Editor" (menu esquerdo)
2. **Você deve ver essas 16 tabelas:**

```
✅ profiles
✅ nutritionists
✅ pacientes
✅ planos
✅ refeicoes
✅ cardapios
✅ cardapio_refeicoes
✅ diario_entradas
✅ habitos
✅ habito_completadas
✅ peso_progresso
✅ peso_historico
✅ posts_comunidade
✅ comentarios_comunidade
✅ mensagens
✅ questionarios
```

✅ **Se vê todas 16:** Banco criado com sucesso! ✅

---

## 🚨 Erros Comuns

### ❌ "Parse error at line X"
- **Causa:** SQL foi dividido
- **Solução:** Copie TUDO de MEB-COMPLETO.sql novamente

### ❌ "Permission denied"
- **Causa:** Role do Supabase
- **Solução:** Vá em "Settings" → "Database" → Verifique role

### ❌ "Table already exists"
- **Causa:** Executou 2x
- **Solução:** Tudo bem, pule para próximo passo

---

## ✅ Próximo Passo

Quando terminar com sucesso:
→ Vá para **ETAPA 3: COPIAR CREDENCIAIS**

