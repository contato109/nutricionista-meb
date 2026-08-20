/**
 * MEB (Método Estruturado de Bem-estar)
 * Supabase Client - VERSÃO SEM CALORIAS (Foco em Hábitos)
 */

class MEBClient {
  constructor(supabaseUrl, anonKey) {
    this.supabaseUrl = supabaseUrl;
    this.anonKey = anonKey;
    this.headers = {
      'apikey': anonKey,
      'Content-Type': 'application/json'
    };
  }

  async request(method, table, options = {}) {
    const {
      select = '*',
      filters = [],
      order = null,
      limit = null,
      offset = null,
      body = null,
      single = false
    } = options;

    let url = `${this.supabaseUrl}/rest/v1/${table}`;
    const params = new URLSearchParams();

    params.set('select', select);

    filters.forEach(filter => {
      const op = filter.operator || 'eq';
      params.append(`${filter.column}=${op}`, filter.value);
    });

    if (order) {
      params.set('order', order.column);
      params.set('order.asc', order.ascending !== false ? 'true' : 'false');
    }

    if (limit) params.set('limit', limit);
    if (offset) params.set('offset', offset);

    if (params.toString()) {
      url += '?' + params.toString();
    }

    const response = await fetch(url, {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      throw new Error(`Supabase [${response.status}]: ${response.statusText}`);
    }

    const data = await response.json();
    return single ? data[0] : data;
  }

  // ====================================================================
  // PACIENTES
  // ====================================================================

  async listarPacientes(nutricionistaId, filtros = {}) {
    const filters = [
      { column: 'nutricionista_id', operator: 'eq', value: nutricionistaId }
    ];

    if (filtros.status) {
      filters.push({ column: 'status', operator: 'eq', value: filtros.status });
    }

    return this.request('GET', 'pacientes', {
      filters,
      order: { column: 'created_at', ascending: false }
    });
  }

  async obterPaciente(pacienteId) {
    return this.request('GET', 'pacientes', {
      filters: [{ column: 'id', operator: 'eq', value: pacienteId }],
      single: true,
      select: '*,profiles(*),planos(*)'
    });
  }

  async criarPaciente(dados) {
    const { userId, nutricionistaId, planoNome, meta, altura, pesoAtual, pesoMeta } = dados;

    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/rpc/criar_paciente`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          p_user_id: userId,
          p_nutricionista_id: nutricionistaId,
          p_plano_nome: planoNome,
          p_meta: meta,
          p_altura_cm: altura,
          p_peso_kg: pesoAtual,
          p_peso_meta_kg: pesoMeta
        })
      }
    );

    if (!response.ok) throw new Error('Erro ao criar paciente');
    return await response.json();
  }

  async atualizarStatusPaciente(pacienteId, status) {
    return this.request('PATCH', 'pacientes', {
      filters: [{ column: 'id', operator: 'eq', value: pacienteId }],
      body: { status }
    });
  }

  // ====================================================================
  // MENSAGENS
  // ====================================================================

  async enviarMensagem(pacienteId, nutricionistaId, remetenteId, texto, tipo = 'texto', mediaUrl = null) {
    return this.request('POST', 'mensagens', {
      body: {
        paciente_id: pacienteId,
        nutricionista_id: nutricionistaId,
        remetente_id: remetenteId,
        texto,
        tipo,
        media_url: mediaUrl
      }
    });
  }

  async obterMensagens(pacienteId, nutricionistaId, limite = 50, pagina = 0) {
    const offset = pagina * limite;

    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/rpc/obter_mensagens_pagina?p_paciente_id=${pacienteId}&p_nutricionista_id=${nutricionistaId}&p_limit=${limite}&p_offset=${offset}`,
      {
        method: 'GET',
        headers: this.headers
      }
    );

    if (!response.ok) throw new Error('Erro ao obter mensagens');
    return await response.json();
  }

  async marcarMensagensLidas(pacienteId, nutricionistaId) {
    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/rpc/marcar_mensagens_lidas`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          p_paciente_id: pacienteId,
          p_nutricionista_id: nutricionistaId
        })
      }
    );

    if (!response.ok) throw new Error('Erro ao marcar como lidas');
    return await response.json();
  }

  // ====================================================================
  // REFEIÇÕES (SEM CALORIAS)
  // ====================================================================

  async registrarRefeicao(pacienteId, dados) {
    return this.request('POST', 'refeicoes', {
      body: {
        paciente_id: pacienteId,
        tipo_refeicao: dados.tipo,
        data: dados.data || new Date().toISOString().split('T')[0],
        hora: dados.hora,
        descricao: dados.descricao,
        alimentos: dados.alimentos || [],
        foto_url: dados.fotoUrl,
        anotacoes: dados.anotacoes
      }
    });
  }

  async obterRefeicoesDia(pacienteId, data = null) {
    data = data || new Date().toISOString().split('T')[0];

    return this.request('GET', 'refeicoes', {
      filters: [
        { column: 'paciente_id', operator: 'eq', value: pacienteId },
        { column: 'data', operator: 'eq', value: data }
      ],
      order: { column: 'hora', ascending: true }
    });
  }

  async obterHistoricoRefeicoes(pacienteId, dias = 30) {
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);
    const dataInicioStr = dataInicio.toISOString().split('T')[0];

    return this.request('GET', 'refeicoes', {
      filters: [
        { column: 'paciente_id', operator: 'eq', value: pacienteId },
        { column: 'data', operator: 'gte', value: dataInicioStr }
      ],
      order: { column: 'data', ascending: false }
    });
  }

  // ====================================================================
  // CARDÁPIOS
  // ====================================================================

  async obterCardapioSemana(pacienteId, data = null) {
    data = data || new Date().toISOString().split('T')[0];

    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/rpc/obter_cardapio_semana?p_paciente_id=${pacienteId}&p_data_inicio=${data}`,
      {
        method: 'GET',
        headers: this.headers
      }
    );

    if (!response.ok) throw new Error('Erro ao obter cardápio');
    return await response.json();
  }

  async criarCardapio(dados) {
    return this.request('POST', 'cardapios', {
      body: {
        paciente_id: dados.pacienteId,
        nutricionista_id: dados.nutricionistaId,
        titulo: dados.titulo,
        descricao: dados.descricao,
        data_inicio: dados.dataInicio,
        data_fim: dados.dataFim,
        objetivo: dados.objetivo
      }
    });
  }

  // ====================================================================
  // DIÁRIO (Humor, Energia, Sintomas)
  // ====================================================================

  async registrarDiario(pacienteId, dados) {
    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/rpc/registrar_diario`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          p_paciente_id: pacienteId,
          p_humor: dados.humor,
          p_energia: dados.energia,
          p_saciedade: dados.saciedade,
          p_qualidade_sono: dados.qualidadeSono,
          p_notas: dados.notas,
          p_sintomas: dados.sintomas,
          p_data: dados.data || new Date().toISOString().split('T')[0]
        })
      }
    );

    if (!response.ok) throw new Error('Erro ao registrar diário');
    return await response.json();
  }

  async obterDiario(pacienteId, data = null) {
    data = data || new Date().toISOString().split('T')[0];

    return this.request('GET', 'diario_entradas', {
      filters: [
        { column: 'paciente_id', operator: 'eq', value: pacienteId },
        { column: 'data', operator: 'eq', value: data }
      ],
      single: true
    });
  }

  // ====================================================================
  // PESO & PROGRESSO
  // ====================================================================

  async registrarPeso(pacienteId, pesoKg, data = null) {
    data = data || new Date().toISOString().split('T')[0];

    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/rpc/registrar_peso?p_paciente_id=${pacienteId}&p_peso_kg=${pesoKg}&p_data=${data}`,
      {
        method: 'POST',
        headers: this.headers
      }
    );

    if (!response.ok) throw new Error('Erro ao registrar peso');
    return await response.json();
  }

  async registrarFotosPeso(pacienteId, fotosFrontLateral, data = null) {
    data = data || new Date().toISOString().split('T')[0];

    return this.request('POST', 'peso_progresso', {
      body: {
        paciente_id: pacienteId,
        data_medicao: data,
        foto_frontal_url: fotosFrontLateral.frontal,
        foto_lateral_url: fotosFrontLateral.lateral,
        foto_costas_url: fotosFrontLateral.costas
      }
    });
  }

  async obterHistoricoPeso(pacienteId, dias = 90) {
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);
    const dataInicioStr = dataInicio.toISOString().split('T')[0];

    return this.request('GET', 'peso_progresso', {
      filters: [
        { column: 'paciente_id', operator: 'eq', value: pacienteId },
        { column: 'data_medicao', operator: 'gte', value: dataInicioStr }
      ],
      order: { column: 'data_medicao', ascending: true }
    });
  }

  // ====================================================================
  // HÁBITOS (CORE do MEB)
  // ====================================================================

  async criarHabito(pacienteId, dados) {
    return this.request('POST', 'habitos', {
      body: {
        paciente_id: pacienteId,
        nome: dados.nome,
        descricao: dados.descricao,
        categoria: dados.categoria, // 'hidratacao', 'movimento', 'dormir', etc
        data_criacao: new Date().toISOString().split('T')[0],
        data_inicio: dados.dataInicio,
        data_fim: dados.dataFim,
        frequencia_semanal: dados.frequenciaSemanall,
        meta_diaria: dados.metaDiaria,
        emoji: dados.emoji,
        ativo: true
      }
    });
  }

  async listarHabitos(pacienteId) {
    return this.request('GET', 'habitos', {
      filters: [
        { column: 'paciente_id', operator: 'eq', value: pacienteId },
        { column: 'ativo', operator: 'eq', value: true }
      ]
    });
  }

  async marcarHabitoCompleto(habitoId, data = null) {
    data = data || new Date().toISOString().split('T')[0];

    return this.request('POST', 'habito_completadas', {
      body: {
        habito_id: habitoId,
        data,
        completado: true
      }
    });
  }

  async desmarcarHabito(habitoId, data = null) {
    data = data || new Date().toISOString().split('T')[0];

    return this.request('POST', 'habito_completadas', {
      body: {
        habito_id: habitoId,
        data,
        completado: false
      }
    });
  }

  async obterHabitosSemana(pacienteId, dataInicio = null) {
    if (!dataInicio) {
      const d = new Date();
      d.setDate(d.getDate() - d.getDay() + 1); // Começa na segunda
      dataInicio = d.toISOString().split('T')[0];
    }

    const dataFim = new Date(new Date(dataInicio).getTime() + 6 * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];

    // Buscar hábitos ativos
    const habitos = await this.listarHabitos(pacienteId);

    // Buscar completadas da semana
    const url = `${this.supabaseUrl}/rest/v1/habito_completadas?` +
      `habito_id=in.(${habitos.map(h => `"${h.id}"`).join(',')})&` +
      `data=gte.${dataInicio}&data=lte.${dataFim}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers
    });

    if (!response.ok) throw new Error('Erro ao obter hábitos da semana');
    const completadas = await response.json();

    // Mapear para resultado com array de dias
    return habitos.map(h => ({
      ...h,
      completadosSemana: completadas.filter(c => c.habito_id === h.id)
    }));
  }

  async obterStreakHabito(habitoId, dataFinal = null) {
    dataFinal = dataFinal || new Date().toISOString().split('T')[0];

    const completadas = await this.request('GET', 'habito_completadas', {
      filters: [
        { column: 'habito_id', operator: 'eq', value: habitoId },
        { column: 'completado', operator: 'eq', value: true }
      ],
      order: { column: 'data', ascending: false }
    });

    if (!completadas.length) return 0;

    let streak = 0;
    const dataFinalObj = new Date(dataFinal);

    for (let i = 0; i < 365; i++) {
      const dataVerificacao = new Date(dataFinalObj);
      dataVerificacao.setDate(dataVerificacao.getDate() - i);
      const dataStr = dataVerificacao.toISOString().split('T')[0];

      const encontrou = completadas.find(c => c.data === dataStr);
      if (encontrou) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // ====================================================================
  // COMUNIDADE
  // ====================================================================

  async obterFeedComunidade(limite = 20, pagina = 0) {
    const offset = pagina * limite;

    return this.request('GET', 'posts_comunidade', {
      limit: limite,
      offset: offset,
      order: { column: 'criado_em', ascending: false }
    });
  }

  async criarPost(pacienteId, conteudo, categoria = 'motivacao', imagemUrl = null) {
    return this.request('POST', 'posts_comunidade', {
      body: {
        paciente_id: pacienteId,
        conteudo,
        categoria,
        imagem_url: imagemUrl
      }
    });
  }

  async comentarPost(postId, pacienteId, conteudo) {
    return this.request('POST', 'comentarios_comunidade', {
      body: {
        post_id: postId,
        paciente_id: pacienteId,
        conteudo
      }
    });
  }

  async obterComentarios(postId) {
    return this.request('GET', 'comentarios_comunidade', {
      filters: [
        { column: 'post_id', operator: 'eq', value: postId }
      ],
      order: { column: 'criado_em', ascending: false }
    });
  }

  // ====================================================================
  // STATS
  // ====================================================================

  async obterStats(pacienteId) {
    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/rpc/obter_stats_paciente?p_paciente_id=${pacienteId}`,
      {
        method: 'GET',
        headers: this.headers
      }
    );

    if (!response.ok) throw new Error('Erro ao obter stats');
    const result = await response.json();
    return result[0] || null;
  }

  async calcularProgresso(pacienteId) {
    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/rpc/calcular_progresso_plano?p_paciente_id=${pacienteId}`,
      {
        method: 'GET',
        headers: this.headers
      }
    );

    if (!response.ok) throw new Error('Erro ao calcular progresso');
    const result = await response.json();
    return result;
  }

  async diasRestantes(pacienteId) {
    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/rpc/dias_restantes_plano?p_paciente_id=${pacienteId}`,
      {
        method: 'GET',
        headers: this.headers
      }
    );

    if (!response.ok) throw new Error('Erro ao obter dias restantes');
    const result = await response.json();
    return result;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MEBClient;
}
