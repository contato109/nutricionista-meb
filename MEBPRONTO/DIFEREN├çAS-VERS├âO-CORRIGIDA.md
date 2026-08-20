# ✅ DIFERENÇAS - Versão Corrigida do MEB (Sem Calorias)

## 🎯 Filosofia da Versão Corrigida

**MEB não é sobre contar calorias.** É sobre construir **hábitos sustentáveis** através de:
- ✅ Registro qualitativo de refeições (quais alimentos, não quantos)
- ✅ Acompanhamento de hábitos diários (água, sono, movimento)
- ✅ Evolução de peso + fotos de progresso
- ✅ Rastreamento de humor, energia e sintomas
- ✅ Comunidade de apoio e motivação

---

## 📊 TABELAS REMOVIDAS / ALTERADAS

### ❌ Removido: Campos de Calorias

**Antes:**
```sql
refeicoes:
  - calorias_estimadas DECIMAL(7, 1)
  - modo_preparo TEXT

cardapios:
  - calorias_diarias INTEGER
  - macros_carboidratos DECIMAL(5, 2)
  - macros_proteinas DECIMAL(5, 2)
  - macros_gorduras DECIMAL(5, 2)
```

**Depois:**
```sql
refeicoes:
  -- SEM calorias
  + anotacoes TEXT

cardapios:
  -- SEM macros
  + objetivo TEXT
```

### ✅ Mantido: Core do MEB

```sql
habitos          -- Hábitos diários (água, sono, movimento, etc)
habito_completadas -- Rastreamento diário
diario_entradas  -- Humor, energia, sintomas
peso_progresso   -- Peso + fotos (frontal, lateral, costas)
refeicoes        -- Alimentos registrados
cardapios        -- Sugestões de refeições
posts_comunidade -- Motivação e resultados
```

---

## 📱 APLICATIVO DO PACIENTE - Fluxos Principais

### 1️⃣ Registrar Refeição (simplificado)
```
Paciente abre app
  ↓
Clica em "Registrar Refeição"
  ↓
Seleciona tipo (café, lanche, almoço, etc)
  ↓
REMOVE: Cálculo de calorias
ADICIONA: Foto + descrição dos alimentos
  ↓
Pressiona "Registrado! ✓"
```

**Antes:**
```javascript
// Calcular calorias automaticamente
const calorias = estimarCalorias(alimentos, quantidades);
```

**Depois:**
```javascript
// Apenas registrar alimentos
await meb.registrarRefeicao(pacienteId, {
  tipo: 'almoco',
  alimentos: ['frango', 'arroz', 'salada'],
  descricao: 'Almoço no trabalho',
  fotoUrl: urlDaFoto,
  anotacoes: 'Sem sal' // Opcional
});
```

---

### 2️⃣ Registrar Hábitos (CORE)
```
Paciente começa o dia
  ↓
Vê lista de hábitos (com emojis)
  ✓ 💧 Beber 2L de água
  ○ 🚴 Caminhar 30min
  ○ 😴 Dormir 8h
  ✓ 🧘 Meditação 10min
  ↓
Marca conforme completa
  ↓
Ganha badges/streaks
```

**Código:**
```javascript
// Carregar hábitos com progresso da semana
const habitos = await meb.obterHabitosSemana(pacienteId);
// Retorna: [{id, nome, emoji, completadosSemana: []}, ...]

// Marcar como completo
await meb.marcarHabitoCompleto(habitoId);

// Ver streak (dias consecutivos)
const streak = await meb.obterStreakHabito(habitoId);
```

---

### 3️⃣ Registrar Diário (Humor + Energia)
```
Fim do dia, paciente abre diário
  ↓
Seleciona:
  - Humor: 😊 Feliz
  - Energia: 7/10
  - Saciedade: 8/10
  - Sono: 7/10
  - Sintomas: [energia alta, sem inchaço]
  ↓
REMOVE: Cálculo de calorias do dia
MANTÉM: Insights sobre padrões
```

**Código:**
```javascript
await meb.registrarDiario(pacienteId, {
  humor: 'feliz',
  energia: 7.5,
  saciedade: 8,
  qualidadeSono: 7,
  notas: 'Dia muito bom!',
  sintomas: ['energia_alta', 'sem_inchaço']
});
```

---

### 4️⃣ Peso + Fotos (Progress)
```
1x por semana, paciente pesa
  ↓
Tira 3 fotos:
  - Frontal
  - Lateral
  - Costas
  ↓
Carrega peso + fotos
  ↓
Sistema calcula progresso %
  ↓
Ver antes/depois visualmente
```

**Código:**
```javascript
// Registrar peso
await meb.registrarPeso(pacienteId, 74.2);

// Registrar fotos de progresso
await meb.registrarFotosPeso(pacienteId, {
  frontal: urlFotoFrontal,
  lateral: urlFotoLateral,
  costas: urlFotoCostas
});

// Ver progresso (sem calorias!)
const historico = await meb.obterHistoricoPeso(pacienteId, 90); // Últimos 90 dias
```

---

## 🔍 PAINEL DO NUTRICIONISTA - Mudanças

### Antes (com calorias)
```
Paciente: Ana
├─ Peso: 74.2 kg → 65 kg (45% progresso)
├─ Calorias ontem: 1800 kcal
├─ Macros: C-45% P-30% G-25%
└─ Refeições: 4 (cada com kcal estimadas)
```

### Depois (foco em hábitos)
```
Paciente: Ana
├─ Peso: 74.2 kg → 65 kg (45% progresso)
├─ Hábitos semana: 5/7 completos
├─ Streak água: 12 dias 🔥
├─ Humor essa semana: Feliz/Neutro
├─ Refeições ontem: 4 (café, lanche, almoço, janta)
│  └─ Cada uma com: tipo + alimentos + foto
└─ Último diário: Energia 7.5/10, Sono 7/10
```

### KPIs Do Nutricionista
```
❌ Remover: Calorias totais consumidas
❌ Remover: Taxa de deficiência calórica
✅ Manter: Pacientes ativos
✅ Manter: Dias no plano
✅ ADICIONAR: Taxa de conclusão de hábitos
✅ ADICIONAR: Streaks ativos
✅ ADICIONAR: Satisfação (baseado em humor/energia)
```

---

## 📊 Exemplo de Dashboard Paciente (Novo)

```
┌─────────────────────────────────────┐
│   🏠 MEB - Seu Acompanhamento       │
├─────────────────────────────────────┤
│                                     │
│  📊 Progresso                       │
│  ├─ Peso: 74.2 kg (9.8 kg perdidos) │
│  ├─ Meta: 65 kg                     │
│  └─ % Progresso: ████░░ 45%         │
│                                     │
│  🎯 Hábitos Hoje                    │
│  ├─ ✓ 💧 Beber 2L água              │
│  ├─ ✗ 🚴 Caminhar 30min             │
│  ├─ ✓ 😴 Dormir 8h                  │
│  └─ 2/3 completados                 │
│                                     │
│  💬 Humor Hoje                      │
│  ├─ Mood: 😊 Feliz                  │
│  ├─ Energia: 7.5/10                 │
│  └─ Sono: 7/10                      │
│                                     │
│  🍽️ Refeições (Hoje)                │
│  ├─ 🌅 Café: Pão, queijo, suco     │
│  ├─ 🥗 Almoço: Frango c/ salada    │
│  └─ 🌙 Janta: (Ainda não)           │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔄 Estrutura de Dados Alterada

### `refeicoes` (Alterado)
```javascript
// ANTES
{
  id: 'uuid',
  paciente_id: 'uuid',
  tipo_refeicao: 'almoco',
  descricao: 'Arroz, frango e salada',
  alimentos: ['arroz', 'frango', 'alface'],
  quantidades: ['150g', '150g', '100g'],
  calorias_estimadas: 450,  // ❌ REMOVIDO
  foto_url: 'url'
}

// DEPOIS
{
  id: 'uuid',
  paciente_id: 'uuid',
  tipo_refeicao: 'almoco',
  descricao: 'Arroz, frango e salada',
  alimentos: ['arroz', 'frango', 'alface'],
  // quantidades: REMOVIDO
  // calorias_estimadas: REMOVIDO
  foto_url: 'url',
  anotacoes: 'Sem sal'  // ✅ ADICIONADO
}
```

### `habitos` (NOVO - Core do MEB)
```javascript
{
  id: 'uuid',
  paciente_id: 'uuid',
  nome: 'Beber 2 litros de água',
  descricao: 'Essencial para hidratação',
  categoria: 'hidratacao',
  data_criacao: '2026-08-20',
  frequencia_semanal: 7, // Todos os dias
  meta_diaria: '2 litros',
  emoji: '💧',
  ativo: true
}
```

### `diario_entradas` (Expandido)
```javascript
{
  id: 'uuid',
  paciente_id: 'uuid',
  data: '2026-08-20',
  humor: 'feliz',           // 'muito_feliz', 'feliz', 'neutro', 'triste'
  energia: 7.5,             // 1-10
  saciedade: 8,             // 1-10 (quantas horas saciado)
  qualidade_sono: 7,        // 1-10
  notas: 'Dia muito bom!',
  sintomas: ['energia_alta', 'sem_inchaço'],  // Array de strings
  foto_do_dia_url: 'url'
}
```

---

## 💻 Método JavaScript - Mudanças na API

### ❌ Removidos
```javascript
meb.registrarRefeicao() 
  // antes: calculava calorias
  // depois: apenas registra alimentos

meb.obterStats()
  // antes: retornava calorias
  // depois: retorna hábitos completados
```

### ✅ Adicionados
```javascript
meb.criarHabito(pacienteId, dados)
meb.marcarHabitoCompleto(habitoId)
meb.desmarcarHabito(habitoId)
meb.obterHabitosSemana(pacienteId)
meb.obterStreakHabito(habitoId)
meb.registrarFotosPeso(pacienteId, {frontal, lateral, costas})
```

---

## 🎓 Exemplo de Onboarding (Novo)

```
1. Criar account
   ↓
2. Selecionar plano
   ↓
3. Dados básicos (altura, peso, meta)
   ↓
4. **Criar primeiros hábitos** ← NOVO!
   ├─ Sugestões: Água, Movimento, Sono
   ├─ Paciente ativa os que faz
   └─ Define frequência
   ↓
5. Responder questionário inicial
   ↓
6. Pronto para começar!
```

---

## 🚀 Começar com Versão Corrigida

1. Usar `schema-meb-corrigido.sql` (NÃO o schema-meb.sql antigo)
2. Usar `meb-client-corrigido.js`
3. Focar em:
   - **Hábitos** (new core)
   - **Peso + fotos** (visual progress)
   - **Diário** (auto-conhecimento)
   - **Comunidade** (motivação)
4. **NÃO implementar** cálculos de calorias

---

## ✨ Benefícios da Nova Abordagem

✅ **Mais simples** - Pacientes não contam calorias  
✅ **Mais sustentável** - Foco em hábitos de longo prazo  
✅ **Mais motivador** - Gamificação (streaks, badges)  
✅ **Mais humanizado** - Rastreia humor e bem-estar  
✅ **Menos drop-off** - Menos fricção nas ações diárias  

---

**Versão corrigida pronta para produção! 🚀**
