# 🤖 ETAPA 8: RODAR TESTES AUTOMATIZADOS (5 min)

## 🎯 Objetivo
Executar suite de 9 testes automaticamente para validar todo o sistema

---

## 📋 COMO EXECUTAR

### PASSO 1: Abrir Console
```
1. Abra seu navegador
2. Pressione: F12 (ou Ctrl+Shift+I no Windows/Linux)
3. Clique na aba: "Console"
```

### PASSO 2: Criar Tester
```javascript
// Cole no console:
const tester = new MEBTestes(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### PASSO 3: Executar Todos os Testes
```javascript
// Cole no console:
await tester.executarTodos();
```

**Aguarde:** Os testes rodam (deve levar 30-60 segundos)

---

## ✅ Resultado Esperado

```
🧪 Suite de Testes MEB

├─ 1️⃣  Teste Conectividade
│  ├─ ✅ Conectado ao Supabase
│  └─ Status: PASSOU
│
├─ 2️⃣  Teste Autenticação
│  ├─ ✅ Sign up funcionando
│  ├─ ✅ Sign in funcionando
│  └─ Status: PASSOU
│
├─ 3️⃣  Teste Pacientes
│  ├─ ✅ Criar paciente
│  ├─ ✅ Listar pacientes
│  └─ Status: PASSOU
│
├─ 4️⃣  Teste Refeições
│  ├─ ✅ Registrar refeição
│  ├─ ✅ Obter refeições
│  └─ Status: PASSOU
│
├─ 5️⃣  Teste Hábitos
│  ├─ ✅ Criar hábito
│  ├─ ✅ Marcar completo
│  ├─ ✅ Calcular streak
│  └─ Status: PASSOU
│
├─ 6️⃣  Teste Peso
│  ├─ ✅ Registrar peso
│  ├─ ✅ Histórico funciona
│  └─ Status: PASSOU
│
├─ 7️⃣  Teste Diário
│  ├─ ✅ Registrar entrada
│  ├─ ✅ Obter histórico
│  └─ Status: PASSOU
│
├─ 8️⃣  Teste Mensagens
│  ├─ ✅ Enviar mensagem
│  ├─ ✅ Receber mensagem
│  └─ Status: PASSOU
│
└─ 9️⃣  Teste Comunidade
   ├─ ✅ Criar post
   ├─ ✅ Comentar post
   └─ Status: PASSOU

📊 RESUMO:
   Total: 9 testes
   ✅ Sucessos: 9
   ❌ Falhas: 0
   📈 Percentual: 100% ✅

🎉 TODOS OS TESTES PASSARAM!
```

---

## 🚨 Se Algum Teste Falhar

### ❌ Teste: Conectividade FALHOU
**Causa:** Sem conexão com Supabase
**Solução:** 
- Verifique internet
- Verifique credenciais (SUPABASE_URL e SUPABASE_ANON_KEY)
- Tente novamente

### ❌ Teste: Autenticação FALHOU
**Causa:** JWT expirado ou inválido
**Solução:**
- Faça logout (localStorage.clear())
- Faça login novamente
- Tente testes de novo

### ❌ Teste: Pacientes FALHOU
**Causa:** Permissões RLS bloqueadas
**Solução:**
- Verifique se você é nutricionista
- Verifique RLS policies no Supabase

### ❌ Teste: Upload FALHOU
**Causa:** Arquivo muito grande ou formato inválido
**Solução:**
- Use imagem <5MB
- Use formato JPG/PNG/WebP

---

## 📊 Exportar Relatório

Depois que testes rodarem (com sucesso ou não):

```javascript
// Cole no console:
tester.exportarJSON();
```

**Resultado:** Um arquivo `meb-testes-[timestamp].json` é baixado com detalhes de cada teste.

---

## 🎯 Interpretação de Resultados

| Percentual | Significado | Ação |
|------------|-------------|------|
| **100%** | Tudo funciona | ✅ Pronto para produção |
| **89-99%** | 1-2 testes falharam | 🔧 Conserte o problema |
| **50-88%** | Vários testes falharam | ⚠️ Verifique setup |
| **<50%** | Maioria falhou | 🚫 Refaça setup Supabase |

---

## ✅ Próximo Passo

Se **100% dos testes passaram**:
→ **ETAPA 9: DEPLOY**

Se alguns falharam:
→ Avise qual teste falhou e conserto com você!

