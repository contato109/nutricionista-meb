/**
 * MEB (Método Estruturado de Bem-estar)
 * Supabase Client Library
 *
 * Abstração para conectar aplicações frontend ao banco de dados PostgreSQL
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

  /**
   * Método genérico para fazer requisições REST ao Supabase
   */
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

    // Select fields
    params.set('select', select);

    // Filters (e.g., { column: 'status', operator: 'eq', value: 'ativa' })
    filters.forEach(filter => {
      const op = filter.operator || 'eq';
      params.append(`${filter.column}=${op}`, filter.value);
    });

    // Order
    if (order) {
      params.set('order', order.column);
      params.set('order.asc', order.ascending !== false ? 'true' : 'false');
    }

    // Pagination
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
      throw new Error(`Supabase Error [${response.status}]: ${response.statusText}`);
    }

    const data = await response.json();
    return single ? data[0] : data;
  }

  // ====================================================================
  // AUTH & PERFIL
  // ====================================================================

  /**
   * Sign up novo usuário
   */
  async signup(email, password, userData) {
    const authUrl = `${this.supabaseUrl}/auth/v1/signup`;
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        email,
        password,
        data: userData
      })
    });

    if (!response.ok) {
      throw new Error(`Signup failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Sign in usuário
   */
  async signin(email, password) {
    const authUrl = `${this.supabaseUrl}/auth/v1/token?grant_type=password`;
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error(`Signin failed: ${response.statusText}`);
    }

    const data = await response.json();
    // Store token
    localStorage.setItem('meb_token', data.access_token);
    return data;
  }

  /**
   * Obter perfil atual
   */
  async getProfile(userId) {
    return this.request('GET', 'profiles', {
      filters: [{ column: 'id', operator: 'eq', value: userId }],
      single: true
    });
  }

  /**
   * Atualizar perfil
   */
  async updateProfile(userId, updates) {
    return this.request('PATCH', 'profiles', {
      filters: [{ column: 'id', operator: 'eq', value: userId }],
      body: updates,
      single: true
    });
  }

  // ====================================================================
  // PACIENTES
  // ====================================================================

  /**
   * Listar pacientes de um nutricionista
   */
  async listarPacientes(nutricionistaId, filtros = {}) {
    const filters = [
      { column: 'nutricionista_id', operator: 'eq', value: nutricionistaId }
    ];

    if (filtros.status) {
      filters.push({ column: 'status', operator: 'eq', value: filtros.status });
    }

    if (filtros.plano) {
      filters.push({ column: 'plano_id', operator: 'eq', value: filtros.plano });
    }

    return this.request('GET', 'pacientes', {
      filters,
      order: { column: 'created_at', ascending: false }
    });
  }

  /**
   * Obter dados completos de um paciente
   */
  async obterPaciente(pacienteId) {
    const paciente = await this.request('GET', 'pacientes', {
      filters: [{ column: 'id', operator: 'eq', value: pacienteId }],
      single: true,
      select: '*,profiles(*),planos(*)'
    });

    // Calculate additional info
    if (paciente) {
      paciente.progresso = await this.calcularProgresso(pacienteId);
      paciente.diasRestantes = await this.diasRestantes(pacienteId);
      paciente.stats = await this.obterStats(pacienteId);
    }

    return paciente;
  }

  /**
   * Criar novo paciente (após signup)
   */
  async criarPaciente(dados) {
    const { userId, nutricionistaId, planoNome, meta, altura, pesoAtual, pesoMeta } = dados;

    // Chamar função SQL: criar_paciente()
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

  /**
   * Atualizar status do paciente
   */
  async atualizarStatusPaciente(pacienteId, status) {
    return this.request('PATCH', 'pacientes', {
      filters: [{ column: 'id', operator: 'eq', value: pacienteId }],
      body: { status }
    });
  }

  // ====================================================================
  // MENSAGENS
  // ====================================================================

  /**
   * Enviar mensagem
   */
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

  /**
   * Obter histórico de mensagens
   */
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

  /**
   * Marcar mensagens como lidas
   */
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

  /**
   * Contar não-lidas
   */
  async contarNaoLidas(nutricionistaId) {
    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/rpc/contar_nao_lidas_totais?p_nutricionista_id=${nutricionistaId}`,
      {
        method: 'GET',
        headers: this.headers
      }
    );

    if (!response.ok) throw new Error('Erro ao contar não-lidas');
    return await response.json();
  }

  // ====================================================================
  // REFEIÇÕES
  // ====================================================================

  /**
   * Registrar refeição do paciente
   */
  async registrarRefeicao(pacienteId, dados) {
    return this.request('POST', 'refeicoes', {
      body: {
        paciente_id: pacienteId,
        tipo_refeicao: dados.tipo,
        data: dados.data || new Date().toISOString().split('T')[0],
        hora: dados.hora,
        descricao: dados.descricao,
        alimentos: dados.alimentos,
        quantidades: dados.quantidades,
        calorias_estimadas: dados.calorias,
        foto_url: dados.fotoUrl
      }
    });
  }

  /**
   * Obter refeições do dia
   */
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

  /**
   * Obter histórico de refeições
   */
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

  /**
   * Obter cardápio da semana atual
   */
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

  /**
   * Criar novo cardápio
   */
  async criarCardapio(dados) {
    return this.request('POST', 'cardapios', {
      body: {
        paciente_id: dados.pacienteId,
        nutricionista_id: dados.nutricionistaId,
        titulo: dados.titulo,
        descricao: dados.descricao,
        data_inicio: dados.dataInicio,
        data_fim: dados.dataFim,
        objetivo: dados.objetivo,
        calorias_diarias: dados.calorias,
        macros_carboidratos: dados.macrosCarbos,
        macros_proteinas: dados.macrosProteinas,
        macros_gorduras: dados.macrosGorduras
      }
    });
  }

  // ====================================================================
  // DIÁRIO
  // ====================================================================

  /**
   * Registrar entrada diária
   */
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

  /**
   * Obter entrada diária
   */
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

  /**
   * Registrar peso
   */
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

  /**
   * Obter histórico de peso
   */
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

  /**
   * Calcular progresso (%)
   */
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

  /**
   * Obter dias restantes do plano
   */
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

  /**
   * Obter estatísticas do paciente
   */
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

  // ====================================================================
  // HÁBITOS
  // ====================================================================

  /**
   * Criar hábito
   */
  async criarHabito(pacienteId, dados) {
    return this.request('POST', 'habitos', {
      body: {
        paciente_id: pacienteId,
        nome: dados.nome,
        descricao: dados.descricao,
        categoria: dados.categoria,
        data_criacao: new Date().toISOString().split('T')[0],
        data_inicio: dados.dataInicio,
        data_fim: dados.dataFim,
        frequencia_semanal: dados.frequenciaSemanall,
        meta_diaria: dados.metaDiaria,
        ativo: true
      }
    });
  }

  /**
   * Marcar hábito como completo no dia
   */
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

  /**
   * Listar hábitos ativos
   */
  async listarHabitos(pacienteId) {
    return this.request('GET', 'habitos', {
      filters: [
        { column: 'paciente_id', operator: 'eq', value: pacienteId },
        { column: 'ativo', operator: 'eq', value: true }
      ]
    });
  }

  // ====================================================================
  // COMUNIDADE
  // ====================================================================

  /**
   * Listar posts (feed)
   */
  async obterFeedComunidade(limite = 20, pagina = 0) {
    const offset = pagina * limite;

    return this.request('GET', 'posts_comunidade', {
      limit: limite,
      offset: offset,
      order: { column: 'criado_em', ascending: false }
    });
  }

  /**
   * Criar post
   */
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

  /**
   * Comentar em post
   */
  async comentarPost(postId, pacienteId, conteudo) {
    return this.request('POST', 'comentarios_comunidade', {
      body: {
        post_id: postId,
        paciente_id: pacienteId,
        conteudo
      }
    });
  }

  /**
   * Obter comentários de post
   */
  async obterComentarios(postId) {
    return this.request('GET', 'comentarios_comunidade', {
      filters: [
        { column: 'post_id', operator: 'eq', value: postId }
      ],
      order: { column: 'criado_em', ascending: false }
    });
  }
}

// Export para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MEBClient;
}
