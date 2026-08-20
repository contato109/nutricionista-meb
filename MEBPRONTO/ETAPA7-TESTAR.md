# 🧪 ETAPA 7: TESTAR CADA FUNCIONALIDADE (30 min)

## 🎯 Objetivo
Validar que cada feature funciona corretamente

---

## ✅ CHECKLIST DE TESTES

### 1. Login/Logout ✅
```
□ Abra 🔐_LOGIN.html
□ Clique "Cadastre-se"
□ Crie usuário de teste
□ Veja "Cadastro realizado!"
□ Faça login com aquele usuário
□ Veja dashboard carregar
□ Clique "Sair"
□ Volte para login
✅ ESPERADO: Tudo funciona suavemente
```

### 2. Registrar Refeição ✅
```
□ Acesse página de paciente (📱_TELA_PACIENTE.html)
□ Procure formulário "Registrar Refeição"
□ Preencha:
  - Tipo: Café da manhã
  - Alimentos: Ovos, pão, café
  - Foto: (opcional)
  - Anotações: "Com fome"
□ Clique "Registrar"
□ Veja mensagem de sucesso: "Refeição registrada!"
□ Refeição aparece na lista
✅ ESPERADO: Dados salvos no Supabase
```

### 3. Marcar Hábito ✅
```
□ Na dashboard, encontre lista de hábitos
□ Procure hábito como "Beber 2L água"
□ Clique no hábito
□ Veja badge: "Completo!" ✅
□ Veja streak aumentar: 🔥 3 dias
□ Clique novamente (não deve aumentar de novo hoje)
✅ ESPERADO: Streak funciona corretamente
```

### 4. Registrar Peso ✅
```
□ Clique em "Registrar Peso"
□ Digite: 75.5 kg
□ (Opcional) Upload fotos frontal/lateral/costas
□ Clique "Registrar"
□ Veja gráfico atualizar
□ Histórico de peso aparece
✅ ESPERADO: Gráfico mostra evolução
```

### 5. Upload de Foto ✅
```
□ Procure campo "Enviar Foto"
□ Clique e selecione imagem (JPG/PNG <5MB)
□ Veja progress bar: "Uploading..."
□ Foto aparece como preview
□ Clique "Confirmar"
✅ ESPERADO: Foto salva em Supabase Storage
```

### 6. Gerar Relatório ✅
```
□ Clique "Gerar Relatório" (nutricionista)
□ Escolha formato: PDF / CSV
□ Veja download iniciar
□ Abra arquivo baixado
□ Veja dados formatados corretamente
✅ ESPERADO: Arquivo PDF/CSV com dados reais
```

### 7. Notificações ✅
```
□ Faça qualquer ação (registrar refeição, etc)
□ Toast verde aparece no canto: ✅ "Sucesso!"
□ Desaparece após 3 segundos
□ Tente ação inválida
□ Toast vermelho aparece: ❌ "Erro"
✅ ESPERADO: Notificações funcionam
```

### 8. Gráficos ✅
```
□ Acesse dashboard com histórico
□ Veja gráfico de peso (linha)
□ Veja gráfico de hábitos (barras)
□ Veja gráfico bem-estar (múltiplas linhas)
□ Clique/passe mouse no gráfico
□ Veja valores aparecerem
✅ ESPERADO: Gráficos interativos
```

### 9. Mensagens ✅
```
□ Nutricionista: clique em "Mensagens"
□ Escreva mensagem para paciente
□ Envie
□ Paciente recebe notificação
□ Paciente responde
□ Nutricionista vê resposta
✅ ESPERADO: Chat bidirecional funciona
```

---

## 🧪 Teste Rápido em Console (F12)

```javascript
// Abra console (F12 → Console)

// 1. Verificar autenticação
console.log('Usuário:', auth.getCurrentUser());

// 2. Testar conexão com banco
const pacientes = await meb.listarPacientes(auth.user.id);
console.log('Pacientes:', pacientes);

// 3. Testar upload
// (veja em meb-storage.js)
```

---

## 🚨 Erros Comuns Durante Testes

| Erro | Causa | Solução |
|------|-------|---------|
| "undefined method" | Script não carregou | Verifique `<script>` tags |
| "Token inválido" | Credenciais erradas | Copie novamente do Supabase |
| "Acesso negado" | RLS policy bloqueou | Verifique role do usuário |
| "Imagem muito grande" | Arquivo >5MB | Comprima antes de enviar |
| "Gráfico vazio" | Sem histórico | Registre alguns dados primeiro |

---

## ✅ Próximo Passo

→ **ETAPA 8: RODAR TESTES AUTOMATIZADOS**

Suite de 9 testes para validar tudo automaticamente.

