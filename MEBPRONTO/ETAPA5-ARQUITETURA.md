# 🏗️ ETAPA 5: ENTENDER ARQUITETURA (10 min)

## 🎯 Objetivo
Entender como o sistema MEB funciona por trás dos panos

---

## 📊 Diagrama de Fluxo do Sistema

```
┌─────────────────────────────────────────────────────┐
│          USUÁRIO ACESSA PÁGINA HTML                │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │  🔐_LOGIN.html      │
         │  - Formulário login │
         │  - Formulário signup│
         └──────────┬──────────┘
                    │
        ┌───────────┴────────────┐
        │                        │
        ▼                        ▼
   ✅ LOGIN OK           ❌ LOGIN FALHA
        │                        │
        ▼                        ▼
   Tira JWT Token         Mostra erro
   Salva localStorage     Tenta novamente
        │
        ▼
   ┌──────────────────────────────────┐
   │  MEBAuth (meb-auth-sistema.js)   │
   │  - Verifica JWT                  │
   │  - Carrega dados do usuário      │
   │  - Identifica role               │
   │  - (Nutricionista ou Paciente)   │
   └─────────────┬────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
  ⚕️ NUTRICIONISTA   📱 PACIENTE
  
  Painel com:         Dashboard com:
  - Lista pacientes   - Peso/gráficos
  - Progresso         - Hábitos/streaks
  - Mensagens         - Refeições
  - Relatórios        - Diário
```

---

## 🗄️ Banco de Dados - 16 Tabelas

### 👤 Usuários (3 tabelas)
```
profiles
├─ id (UUID)
├─ email
├─ nome
├─ role (nutricionista / paciente)
├─ created_at

nutritionists
├─ id (FK profiles)
├─ especialidade
├─ crm
├─ bio

pacientes
├─ id (FK profiles)
├─ nutricionista_id (FK nutritionists)
├─ peso_atual
├─ peso_meta
├─ altura
└─ plano_id (FK planos)
```

### 📋 Planos (1 tabela)
```
planos
├─ id
├─ paciente_id
├─ tipo (Caminho/Transformação/Jornada)
├─ data_inicio
├─ data_fim
├─ status (ativo/concluído)
└─ progresso (%)
```

### 🍽️ Alimentação (3 tabelas)
```
refeicoes
├─ id
├─ paciente_id
├─ tipo (café/almoço/lanche/jantar)
├─ alimentos (descrição)
├─ foto_url
├─ anotacoes
└─ created_at

cardapios
├─ id
├─ nutricionista_id
├─ nome (ex: "Cardápio Semana 1")
├─ descricao

cardapio_refeicoes
├─ id
├─ cardapio_id
├─ dia_semana (segunda/terça...)
└─ refeicoes (JSON: [])
```

### 💪 Hábitos (2 tabelas) ⭐ CORAÇÃO DO MEB
```
habitos
├─ id
├─ paciente_id
├─ nome (ex: "Beber 2L água")
├─ categoria (hidratação/movimento/sono...)
├─ emoji (🚶‍♀️ 💧 😴...)
├─ frequencia (diária/semanal)
└─ meta (ex: 7 para semana)

habito_completadas
├─ id
├─ habito_id
├─ data (hoje/ontem...)
└─ streak (dias seguidos)
```

### ⚖️ Progresso (2 tabelas)
```
peso_progresso
├─ id
├─ paciente_id
├─ peso
├─ data
├─ foto_frontal_url
├─ foto_lateral_url
└─ foto_costas_url

peso_historico
├─ id
├─ paciente_id
├─ peso_anterior
├─ peso_novo
├─ variacao
└─ created_at
```

### 📔 Bem-Estar (1 tabela)
```
diario_entradas
├─ id
├─ paciente_id
├─ data
├─ humor (😔 😐 🙂 😊 😄)
├─ energia (1-10)
├─ saciedade (1-10)
├─ sono (1-10)
├─ anotacoes
└─ created_at
```

### 💬 Comunicação (1 tabela)
```
mensagens
├─ id
├─ paciente_id
├─ nutricionista_id
├─ sender_id (quem enviou)
├─ conteudo
├─ lida (true/false)
└─ created_at
```

### 👥 Comunidade (2 tabelas)
```
posts_comunidade
├─ id
├─ user_id
├─ conteudo
├─ categoria (dica/receita/motivação)
├─ imagem_url
└─ created_at

comentarios_comunidade
├─ id
├─ post_id
├─ user_id
├─ conteudo
└─ created_at
```

### 📝 Questionários (1 tabela)
```
questionarios
├─ id
├─ nutricionista_id
├─ titulo
├─ perguntas (JSON)
├─ respostas (JSON)
└─ created_at
```

---

## 🔄 Fluxo de Dados

### 1️⃣ USUÁRIO NOVO (Sign Up)
```
HTML Form
    ↓
MEBAuth.signUp()
    ↓
Supabase Auth (cria JWT)
    ↓
INSERT profiles (email, nome, role)
    ↓
localStorage.setItem('token', jwt)
    ↓
Redireciona para dashboard
```

### 2️⃣ LOGIN EXISTENTE (Sign In)
```
HTML Form
    ↓
MEBAuth.signIn()
    ↓
Supabase Auth (valida)
    ↓
Retorna JWT
    ↓
localStorage.setItem('token', jwt)
    ↓
Carrega user data
    ↓
Redireciona para dashboard
```

### 3️⃣ REGISTRAR REFEIÇÃO (Paciente)
```
HTML Form (tipo, alimentos, foto)
    ↓
MEBClient.registrarRefeicao()
    ↓
Storage: Upload foto
    ↓
INSERT refeicoes (paciente_id, foto_url...)
    ↓
MEBNotificacoes.sucesso()
    ↓
Atualiza UI com novo registro
```

### 4️⃣ MARCAR HÁBITO (Paciente)
```
Clica em hábito
    ↓
MEBClient.marcarHabitoCompleto()
    ↓
INSERT habito_completadas (habito_id, data, hoje)
    ↓
Calcula streak (dias seguidos)
    ↓
MEBBadges.streak(7) 🔥
    ↓
Atualiza UI com novo streak
```

### 5️⃣ VER PROGRESSO (Nutricionista)
```
Abre painel nutricionista
    ↓
MEBClient.listarPacientes()
    ↓
SELECT pacientes WHERE nutricionista_id = auth.user.id
    ↓
Para cada paciente:
  - calcularProgresso() → %
  - obterHistoricoPeso() → dados gráfico
  - obterStats() → KPIs
    ↓
MEBGraficos.criarGraficoProgressoPeso()
    ↓
Mostra gráficos e dados
```

---

## 🔐 Segurança - RLS (Row Level Security)

### Como Funciona?

```
Paciente A tenta ver dados do Paciente B
    ↓
SELECT * FROM refeicoes WHERE user_id = paciente_b_id
    ↓
RLS Policy valida:
  "user_id == auth.user.id?"
    ↓
❌ NÃO
    ↓
Erro: "Unauthorized"
    ↓
Dados NÃO aparecem
```

**Resultado:** Cada usuário SÓ vê seus próprios dados! 🔒

---

## 📚 Arquivos JavaScript - Responsabilidades

| Arquivo | Responsabilidade | Métodos |
|---------|------------------|---------|
| `meb-auth-sistema.js` | Autenticação | signUp, signIn, logout, resetPassword |
| `meb-client-corrigido.js` | CRUD completo | 30+ métodos |
| `meb-graficos.js` | Visualizações | criarGrafico*, criarCardKPI |
| `meb-storage.js` | Upload/Download | uploadFoto, deletarArquivo |
| `meb-relatorios.js` | PDF/CSV/TXT | gerarRelatório* |
| `meb-notificacoes.js` | UI Feedback | sucesso, erro, aviso, badges |
| `meb-testes.js` | Validação | executarTodos, exportarJSON |

---

## ✅ Próximo Passo

→ **ETAPA 6: INTEGRAR EM SEUS 18 HTMLs**

Você vai copiar um template e adicionar em cada arquivo.

