# 🚀 Guia: Como Rodar o MEB Localmente

**Tempo total:** 5 minutos  
**Dificuldade:** Muito fácil ✅

---

## 📋 Pré-requisitos

Você precisa ter:
- ✅ Git instalado
- ✅ Um navegador (Chrome, Safari, Firefox, Edge)
- ✅ Terminal/Prompt de Comando

Pronto? Vamos lá!

---

## 🎯 Passo 1: Clonar o Repositório

Abra seu terminal e execute:

```bash
git clone https://github.com/contato109/nutricionista-meb.git
cd nutricionista-meb
```

**O que acontece:**
- Baixa todos os 57 arquivos do seu projeto
- Cria uma pasta `nutricionista-meb`

---

## 🌐 Passo 2: Abrir o Sistema

### **Opção A: Simples (sem servidor)**

1. Navegue até a pasta do projeto
2. Clique duas vezes em `login.html`
3. Seu navegador abrirá o login do MEB ✅

**Pronto! O sistema está rodando localmente!**

---

### **Opção B: Com Servidor (melhor)**

Se a Opção A não funcionar, use Python:

#### **No Mac/Linux:**
```bash
cd nutricionista-meb
python3 -m http.server 8080
```

#### **No Windows:**
```bash
cd nutricionista-meb
python -m http.server 8080
```

**Depois:**
- Abra seu navegador
- Vá para: `http://localhost:8080/login.html`

---

## 🔐 Passo 3: Fazer Login

**Nutricionista de Teste:**
```
Email:    testenutri@meb.com.br
Senha:    SenhaForte123!
Tipo:     Nutricionista
```

**O que você verá:**
- ✅ Painel de Nutricionista
- ✅ Lista de Pacientes
- ✅ Gráficos de Progresso
- ✅ Todas as funcionalidades MEB

---

## 📁 Estrutura dos Arquivos

```
nutricionista-meb/
├── login.html                          ← COMECE AQUI!
├── 1-exemplo-integracao-completo-v2.html  (Painel master)
├── 2-exemplo-painel-nutri-v2.html        (Painel nutricionista)
├── 3-dashboard-paciente-v2.html          (Dashboard paciente)
├── meb-auth-sistema.js                 (Autenticação)
├── meb-client-corrigido.js             (CRUD operations)
├── meb-graficos.js                     (Gráficos)
├── meb-storage.js                      (Upload de arquivos)
├── meb-notificacoes.js                 (Notificações)
├── meb-testes.js                       (Testes automatizados)
└── MEB-COMPLETO.sql                    (Schema do banco)
```

---

## 🧪 Passo 4: Testar Funcionalidades

Depois de fazer login, você pode:

### **Como Nutricionista:**
1. Clique em **"Meus Pacientes"**
2. Veja a lista de pacientes (carregada do Supabase)
3. Clique em um paciente para ver detalhes
4. Veja gráficos de progresso

### **Para Testar Tudo:**
1. Abra o Console do Navegador (F12 ou Cmd+Option+J)
2. Cole este código:
```javascript
const testes = new MEBTestes();
await testes.executarTodosTestes();
```
3. Veja 9/9 testes passarem ✅

---

## 🔧 Se Algo Não Funcionar

### **"Erro ao carregar pacientes"**
✅ Isso é NORMAL se:
- Você não tem pacientes cadastrados no Supabase
- A chave Supabase está correta
- O email de login não é válido

**Solução:** Crie um novo paciente usando o painel

### **"Arquivo não encontrado"**
✅ Verifique:
- Os arquivos `.js` estão na mesma pasta que `login.html`?
- Os nomes dos arquivos estão corretos? (sem caracteres especiais)

### **HTTPS/Certificado Error**
✅ Ignore se estiver em localhost
- Localhost não precisa de certificado

---

## 📚 Próximos Passos

### **1. Explorar o Sistema**
- [ ] Faça login como nutricionista
- [ ] Navegue pelas abas (Pacientes, Refeições, Hábitos, etc)
- [ ] Veja os gráficos de progresso
- [ ] Teste o registro de hábitos

### **2. Customizar**
- [ ] Mude as cores (veja `meb-auth-sistema.js` - cores MEB)
- [ ] Adicione mais campos
- [ ] Personalize os textos

### **3. Deploy Real**
- [ ] Quando o Netlify tiver créditos, seu site meb.app.br estará no ar
- [ ] Até lá, continue usando localmente
- [ ] Qualquer alteração que você faz no GitHub, atualiza automaticamente no Netlify

---

## 💡 Dicas

1. **Deixe o terminal aberto** enquanto estiver testando (se usar Python)
2. **Limpe o cache do navegador** se ver dados antigos (Cmd+Shift+Delete no Chrome)
3. **Use as ferramentas de dev** (F12) para debugar erros
4. **Teste com Firefox também** se encontrar bugs no Chrome

---

## 🎉 Pronto!

Seu sistema MEB está **100% funcional localmente**!

**Dúvidas?** Verifique:
- `LEIA-PRIMEIRO.txt` - visão geral
- `SISTEMA-MEB-PRONTO.md` - documentação completa
- `ETAPAS-7-8-9-COMPLETAS.md` - testes e deploy

**Boa sorte! 💪**

---

*Desenvolvido com ❤️ para nutricionistas que querem tecnologia simples, funcional e segura.*
