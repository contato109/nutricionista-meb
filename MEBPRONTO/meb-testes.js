/**
 * MEB TESTES
 * Suite de testes automatizados
 * Validação de funcionalidades principais
 */

class MEBTestes {
  constructor(supabaseUrl, supabaseAnonKey) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseAnonKey = supabaseAnonKey;
    this.resultados = [];
    this.auth = null;
    this.meb = null;
  }

  async inicializar() {
    this.auth = new MEBAuth(this.supabaseUrl, this.supabaseAnonKey);
    this.meb = new MEBClient(this.supabaseUrl, this.supabaseAnonKey);
    this.meb.initializeAuth(this.auth);
  }

  /**
   * Executar suite de testes
   */
  async executarTodos() {
    console.log('🧪 Iniciando suite de testes...\n');

    await this.inicializar();

    const testes = [
      this.testarConectividade.bind(this),
      this.testarAutenticacao.bind(this),
      this.testarPacientes.bind(this),
      this.testarRefeicoes.bind(this),
      this.testarHabitos.bind(this),
      this.testarPeso.bind(this),
      this.testarDiario.bind(this),
      this.testarMensagens.bind(this),
      this.testarComunidade.bind(this),
    ];

    for (const teste of testes) {
      try {
        await teste();
      } catch (error) {
        console.error('Erro ao executar teste:', error);
      }
    }

    this.gerarRelatorio();
  }

  /**
   * TESTE 1: Conectividade com Supabase
   */
  async testarConectividade() {
    const nomeTeste = 'Conectividade com Supabase';
    console.log(`\n📡 ${nomeTeste}...`);

    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/planos?select=*&limit=1`, {
        headers: {
          'apikey': this.supabaseAnonKey
        }
      });

      if (response.ok) {
        console.log('✅ Conectividade OK');
        this.adicionarResultado(nomeTeste, true, 'Conexão estabelecida com sucesso');
      } else {
        throw new Error(`Status ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Erro:', error.message);
      this.adicionarResultado(nomeTeste, false, error.message);
    }
  }

  /**
   * TESTE 2: Autenticação
   */
  async testarAutenticacao() {
    const nomeTeste = 'Autenticação (Sign up / Sign in)';
    console.log(`\n🔐 ${nomeTeste}...`);

    try {
      // Criar usuário de teste
      const email = `teste${Date.now()}@test.com`;
      const password = 'SenhaForte123';

      const signUpResult = await this.auth.signUp(email, password, 'Teste Automatizado', 'paciente');

      if (!signUpResult.success) {
        throw new Error(`Sign up falhou: ${signUpResult.error}`);
      }

      console.log('✅ Sign up OK');

      // Sign in
      const signInResult = await this.auth.signIn(email, password);

      if (!signInResult.success) {
        throw new Error(`Sign in falhou: ${signInResult.error}`);
      }

      console.log('✅ Sign in OK');

      this.adicionarResultado(nomeTeste, true, 'Autenticação funcionando');
    } catch (error) {
      console.error('❌ Erro:', error.message);
      this.adicionarResultado(nomeTeste, false, error.message);
    }
  }

  /**
   * TESTE 3: Pacientes
   */
  async testarPacientes() {
    const nomeTeste = 'Operações com Pacientes';
    console.log(`\n👥 ${nomeTeste}...`);

    try {
      if (!this.auth.isAuthenticated()) {
        throw new Error('Não autenticado');
      }

      // Listar (pode estar vazio)
      const pacientes = await this.meb.listarPacientes(this.auth.user.id);
      console.log(`✅ Listar pacientes (${pacientes?.length || 0} encontrados)`);

      this.adicionarResultado(nomeTeste, true, 'Pacientes funcionando');
    } catch (error) {
      console.error('❌ Erro:', error.message);
      this.adicionarResultado(nomeTeste, false, error.message);
    }
  }

  /**
   * TESTE 4: Refeições
   */
  async testarRefeicoes() {
    const nomeTeste = 'Operações com Refeições';
    console.log(`\n🥗 ${nomeTeste}...`);

    try {
      if (!this.auth.isAuthenticated()) {
        throw new Error('Não autenticado');
      }

      // Registrar refeição
      await this.meb.registrarRefeicao(this.auth.user.id, {
        tipo: 'almoco',
        alimentos: ['arroz', 'feijão', 'salada'],
        descricao: 'Teste automatizado',
        fotoUrl: null
      });

      console.log('✅ Registrar refeição OK');

      // Obter do dia
      const refeicoes = await this.meb.obterRefeicoesDia(this.auth.user.id);
      console.log(`✅ Obter refeições (${refeicoes?.length || 0} encontradas)`);

      this.adicionarResultado(nomeTeste, true, 'Refeições funcionando');
    } catch (error) {
      console.error('❌ Erro:', error.message);
      this.adicionarResultado(nomeTeste, false, error.message);
    }
  }

  /**
   * TESTE 5: Hábitos
   */
  async testarHabitos() {
    const nomeTeste = 'Operações com Hábitos';
    console.log(`\n🔥 ${nomeTeste}...`);

    try {
      if (!this.auth.isAuthenticated()) {
        throw new Error('Não autenticado');
      }

      // Criar hábito
      const habito = await this.meb.criarHabito(this.auth.user.id, {
        nome: 'Beber água',
        categoria: 'hidratacao',
        emoji: '💧',
        frequencia_semanal: 7,
        meta_diaria: '2 litros'
      });

      console.log('✅ Criar hábito OK');

      if (habito?.id) {
        // Marcar como completo
        await this.meb.marcarHabitoCompleto(habito.id);
        console.log('✅ Marcar hábito OK');

        // Obter streak
        const streak = await this.meb.obterStreakHabito(habito.id);
        console.log(`✅ Streak: ${streak} dias`);
      }

      this.adicionarResultado(nomeTeste, true, 'Hábitos funcionando');
    } catch (error) {
      console.error('❌ Erro:', error.message);
      this.adicionarResultado(nomeTeste, false, error.message);
    }
  }

  /**
   * TESTE 6: Peso
   */
  async testarPeso() {
    const nomeTeste = 'Operações com Peso';
    console.log(`\n⚖️ ${nomeTeste}...`);

    try {
      if (!this.auth.isAuthenticated()) {
        throw new Error('Não autenticado');
      }

      // Registrar peso
      await this.meb.registrarPeso(this.auth.user.id, 75.5);
      console.log('✅ Registrar peso OK');

      // Obter histórico
      const historico = await this.meb.obterHistoricoPeso(this.auth.user.id, 30);
      console.log(`✅ Histórico (${historico?.length || 0} registros)`);

      this.adicionarResultado(nomeTeste, true, 'Peso funcionando');
    } catch (error) {
      console.error('❌ Erro:', error.message);
      this.adicionarResultado(nomeTeste, false, error.message);
    }
  }

  /**
   * TESTE 7: Diário
   */
  async testarDiario() {
    const nomeTeste = 'Operações com Diário';
    console.log(`\n📔 ${nomeTeste}...`);

    try {
      if (!this.auth.isAuthenticated()) {
        throw new Error('Não autenticado');
      }

      // Registrar entrada
      await this.meb.registrarDiario(this.auth.user.id, {
        humor: 'feliz',
        energia: 8,
        saciedade: 7,
        qualidade_sono: 7,
        sintomas: ['cansaco']
      });

      console.log('✅ Registrar entrada OK');

      // Obter diário
      const diario = await this.meb.obterDiario(this.auth.user.id);
      console.log(`✅ Diário (${diario?.length || 0} entradas)`);

      this.adicionarResultado(nomeTeste, true, 'Diário funcionando');
    } catch (error) {
      console.error('❌ Erro:', error.message);
      this.adicionarResultado(nomeTeste, false, error.message);
    }
  }

  /**
   * TESTE 8: Mensagens
   */
  async testarMensagens() {
    const nomeTeste = 'Operações com Mensagens';
    console.log(`\n💬 ${nomeTeste}...`);

    try {
      if (!this.auth.isAuthenticated()) {
        throw new Error('Não autenticado');
      }

      // Enviar mensagem (teste com IDs de exemplo)
      await this.meb.enviarMensagem(
        this.auth.user.id,
        'nutricionista-teste-uuid',
        this.auth.user.id,
        'Teste de mensagem'
      );

      console.log('✅ Enviar mensagem OK');

      this.adicionarResultado(nomeTeste, true, 'Mensagens funcionando');
    } catch (error) {
      console.error('❌ Erro:', error.message);
      this.adicionarResultado(nomeTeste, false, error.message);
    }
  }

  /**
   * TESTE 9: Comunidade
   */
  async testarComunidade() {
    const nomeTeste = 'Operações com Comunidade';
    console.log(`\n👥 ${nomeTeste}...`);

    try {
      if (!this.auth.isAuthenticated()) {
        throw new Error('Não autenticado');
      }

      // Criar post
      const post = await this.meb.criarPost(this.auth.user.id, {
        conteudo: 'Teste de post da comunidade',
        categoria: 'dica',
        imagem_url: null
      });

      console.log('✅ Criar post OK');

      // Obter feed
      const feed = await this.meb.obterFeedComunidade(0, 10);
      console.log(`✅ Feed (${feed?.length || 0} posts)`);

      this.adicionarResultado(nomeTeste, true, 'Comunidade funcionando');
    } catch (error) {
      console.error('❌ Erro:', error.message);
      this.adicionarResultado(nomeTeste, false, error.message);
    }
  }

  /**
   * Adicionar resultado
   */
  adicionarResultado(nome, sucesso, detalhes = '') {
    this.resultados.push({
      nome,
      sucesso,
      detalhes,
      timestamp: new Date()
    });
  }

  /**
   * Gerar relatório
   */
  gerarRelatorio() {
    console.log('\n\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    RELATÓRIO DE TESTES                       ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const sucessos = this.resultados.filter(r => r.sucesso).length;
    const falhas = this.resultados.filter(r => !r.sucesso).length;
    const total = this.resultados.length;

    console.log(`Total:   ${total} testes`);
    console.log(`✅ Sucessos: ${sucessos}`);
    console.log(`❌ Falhas:   ${falhas}\n`);

    this.resultados.forEach(r => {
      const icon = r.sucesso ? '✅' : '❌';
      console.log(`${icon} ${r.nome}`);
      if (r.detalhes && !r.sucesso) {
        console.log(`   └─ ${r.detalhes}`);
      }
    });

    console.log('\n');

    // Retornar objeto para uso programático
    return {
      total,
      sucessos,
      falhas,
      percentual: Math.round((sucessos / total) * 100),
      resultados: this.resultados
    };
  }

  /**
   * Exportar como JSON
   */
  exportarJSON() {
    const relatorio = this.gerarRelatorio();
    const json = JSON.stringify(relatorio, null, 2);

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meb-testes-${Date.now()}.json`;
    a.click();
  }
}

// ==================== USAR NO CONSOLE ====================

/**
 * Executar testes:
 *
 * const testes = new MEBTestes('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');
 * await testes.executarTodos();
 */
