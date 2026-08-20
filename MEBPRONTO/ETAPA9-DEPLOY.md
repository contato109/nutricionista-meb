# 🚀 ETAPA 9: DEPLOY EM PRODUÇÃO (10 min)

## 🎯 Objetivo
Colocar seu sistema MEB no ar para que pacientes acessem

---

## 🤔 Escolha Sua Plataforma

### ✅ OPÇÃO A: Netlify (RECOMENDADO - Mais fácil)
### ⚫ OPÇÃO B: Vercel (Alternativa)
### 🟡 OPÇÃO C: GitHub Pages (Gratuito, mais limitado)

---

## 📋 OPÇÃO A: NETLIFY (RECOMENDADO)

### PASSO 1: Criar Conta
```
1. Acesse: https://netlify.com
2. Clique "Sign Up"
3. Registre-se com GitHub (mais fácil)
```

### PASSO 2: Conectar GitHub
```
1. Depois de cadastrado, clique "New site from Git"
2. Clique "GitHub"
3. Autorize Netlify a acessar seus repos
4. Selecione seu repositório do projeto MEB
```

### PASSO 3: Configurar Build
```
Deixe padrão:
├─ Base directory: (deixar vazio)
├─ Build command: (deixar vazio)
└─ Publish directory: ./ (raiz do projeto)
```

### PASSO 4: Adicionar Environment Variables
```
1. Clique "Show Advanced"
2. Clique "New Variable"
3. Adicione:

   Nome: VITE_SUPABASE_URL
   Valor: https://seu-projeto-xyz.supabase.co

   Nome: VITE_SUPABASE_ANON_KEY
   Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### PASSO 5: Deploy
```
1. Clique "Deploy Site"
2. Aguarde ~2 minutos
3. Você verá: "Site is live"
4. Link aparece como: https://seu-site-xyz.netlify.app
```

### PASSO 6: Configurar Domínio (Opcional)
```
1. Clique "Domain Settings"
2. Clique "Add Custom Domain"
3. Adicione seu domínio (ex: meu-consultorio.com.br)
4. Siga instruções de DNS
```

---

## 📋 OPÇÃO B: VERCEL

### PASSO 1: Criar Conta
```
1. Acesse: https://vercel.com
2. Clique "Sign Up"
3. Use GitHub para mais fácil
```

### PASSO 2: Importar Projeto
```
1. Clique "New Project"
2. Selecione seu repo do GitHub
3. Clique "Import"
```

### PASSO 3: Configurar
```
Framework Preset: Other (static)
Build Command: (deixar vazio)
Output Directory: ./
```

### PASSO 4: Environment Variables
```
Adicione mesmas variáveis do Netlify:
├─ VITE_SUPABASE_URL
└─ VITE_SUPABASE_ANON_KEY
```

### PASSO 5: Deploy
```
Clique "Deploy"
Aguarde completar
Link aparece como: https://seu-site.vercel.app
```

---

## 📋 OPÇÃO C: GITHUB PAGES (Gratuito)

### PASSO 1: Ir para Settings
```
1. GitHub → seu repositório
2. Settings → Pages
```

### PASSO 2: Configurar Source
```
Branch: main
Directory: / (root)
```

### PASSO 3: Save
```
1. Clique "Save"
2. Aguarde 1-2 minutos
3. Seu site estará em: https://seu-usuario.github.io/seu-projeto
```

⚠️ **Nota:** GitHub Pages não suporta variáveis de ambiente. Você precisa hardcoding as credenciais no arquivo (menos seguro).

---

## ✅ Depois de Fazer Deploy

### PASSO 1: Testar Site
```
1. Abra seu novo link (ex: seu-site.netlify.app)
2. Você deve ver: Login MEB
3. Teste signup
4. Teste signin
5. Teste funcionalidades
```

### PASSO 2: Configurar CORS (se necessário)
```
Se der erro de CORS:
1. Supabase Dashboard
2. Settings → API
3. URL Schemes → Adicione seu domínio novo
```

### PASSO 3: Testar em Mobile
```
1. Abra em seu telefone
2. Teste em 4G (não só Wi-Fi)
3. Teste formulários
4. Teste upload de foto
```

---

## 🚀 Seu Site Está No Ar!

**Parabéns!** Você tem um sistema profissional em produção!

---

## 📋 CHECKLIST PRÉ-PRODUÇÃO

Antes de compartilhar com pacientes:

- [ ] Todos os testes passam (9/9)
- [ ] Login funciona
- [ ] Cadastro de pacientes funciona
- [ ] Registrar refeição funciona
- [ ] Marcar hábito funciona
- [ ] Gráficos aparecem
- [ ] Upload de foto funciona
- [ ] Relatórios geram
- [ ] Testado em mobile
- [ ] Testado em outro navegador
- [ ] Notificações funcionam
- [ ] Logout funciona

---

## 🎯 Próximas Ações

### SEMANA 1:
- [ ] Convide seus primeiros 3-5 pacientes
- [ ] Recolha feedback
- [ ] Corrija bugs (se houver)

### SEMANA 2-4:
- [ ] Adicione mais pacientes
- [ ] Otimize baseado em feedback
- [ ] Configure integrações (email, SMS)

### MÊS 2+:
- [ ] App mobile (React Native)
- [ ] PWA (offline)
- [ ] Social login
- [ ] Analytics

---

## 📞 Precisa de Ajuda?

**Erro ao fazer deploy?**
1. Verifique credenciais (Supabase)
2. Verifique se todos os arquivos estão no repo
3. Verifique se `🔐_LOGIN.html` está na raiz

**Sistema está lento?**
1. Ative cache no Netlify
2. Otimize imagens
3. Minifique JavaScript

**Usuário reclamando de erro?**
1. Abra console (F12)
2. Veja qual erro aparece
3. Corrija e redeploy

---

## ✅ PARABÉNS! 🎉

Você completou as **9 ETAPAS** e seu sistema MEB está:

✅ Configurado  
✅ Testado  
✅ No ar em produção  
✅ Pronto para pacientes!  

**Tempo total:** ~2.5 horas  
**Custo:** R$ 0 (free tier Supabase + Netlify)  
**Escalabilidade:** Suporta milhares de usuários  

---

**Bem-vindo à próxima fase do seu negócio! 🚀**

Seus pacientes vão adorar!

