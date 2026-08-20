/**
 * MEB NOTIFICAÇÕES
 * Sistema de notificações em tempo real
 * Toast, badges e alertas
 */

class MEBNotificacoes {
  constructor() {
    this.notificacoes = [];
    this.container = null;
    this.inicializar();
  }

  inicializar() {
    // Criar container se não existir
    if (!document.getElementById('meb-notificacoes-container')) {
      const container = document.createElement('div');
      container.id = 'meb-notificacoes-container';
      container.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 9999;
        max-width: 400px;
      `;
      document.body.appendChild(container);
      this.container = container;
    } else {
      this.container = document.getElementById('meb-notificacoes-container');
    }

    this.adicionarEstilos();
  }

  adicionarEstilos() {
    if (document.getElementById('meb-notificacoes-styles')) return;

    const style = document.createElement('style');
    style.id = 'meb-notificacoes-styles';
    style.textContent = `
      .meb-notificacao {
        background: white;
        padding: 16px;
        margin-bottom: 10px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-left: 4px solid #5C6B3A;
        animation: slideInRight 0.3s ease;
        min-width: 300px;
      }

      .meb-notificacao.success {
        border-left-color: #4CAF50;
      }

      .meb-notificacao.error {
        border-left-color: #F44336;
      }

      .meb-notificacao.warning {
        border-left-color: #FFC107;
      }

      .meb-notificacao.info {
        border-left-color: #2196F3;
      }

      .meb-notificacao-titulo {
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
        font-size: 14px;
      }

      .meb-notificacao-mensagem {
        color: #666;
        font-size: 13px;
        line-height: 1.4;
      }

      .meb-notificacao-fechar {
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #999;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .meb-notificacao-fechar:hover {
        color: #333;
      }

      .meb-notificacao-progress {
        height: 2px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 1px;
        margin-top: 8px;
        overflow: hidden;
      }

      .meb-notificacao-progress-bar {
        height: 100%;
        background: #5C6B3A;
        animation: progress linear;
      }

      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }

      @keyframes progress {
        0% { width: 100%; }
        100% { width: 0%; }
      }

      .meb-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .meb-badge-primary {
        background: #5C6B3A;
        color: white;
      }

      .meb-badge-success {
        background: #4CAF50;
        color: white;
      }

      .meb-badge-error {
        background: #F44336;
        color: white;
      }

      .meb-badge-warning {
        background: #FFC107;
        color: #333;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Mostrar notificação
   */
  mostrar(mensagem, tipo = 'info', duracao = 4000, titulo = null) {
    const icones = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    const id = Date.now();

    const notif = document.createElement('div');
    notif.className = `meb-notificacao ${tipo}`;
    notif.id = `notif-${id}`;
    notif.style.position = 'relative';

    let html = '';

    if (titulo) {
      html += `<div class="meb-notificacao-titulo">${icones[tipo]} ${titulo}</div>`;
    }

    html += `<div class="meb-notificacao-mensagem">${mensagem}</div>`;

    if (duracao) {
      html += `<div class="meb-notificacao-progress">
        <div class="meb-notificacao-progress-bar" style="animation-duration: ${duracao}ms;"></div>
      </div>`;
    }

    html += `<button class="meb-notificacao-fechar" onclick="document.getElementById('notif-${id}').remove();">×</button>`;

    notif.innerHTML = html;
    this.container.appendChild(notif);

    this.notificacoes.push({
      id,
      elemento: notif,
      tipo,
      mensagem
    });

    if (duracao) {
      setTimeout(() => {
        if (notif.parentElement) {
          notif.style.animation = 'slideOutRight 0.3s ease';
          setTimeout(() => notif.remove(), 300);
        }
        this.notificacoes = this.notificacoes.filter(n => n.id !== id);
      }, duracao);
    }

    return id;
  }

  /**
   * Sucesso
   */
  sucesso(mensagem, titulo = 'Sucesso!') {
    return this.mostrar(mensagem, 'success', 3000, titulo);
  }

  /**
   * Erro
   */
  erro(mensagem, titulo = 'Erro') {
    return this.mostrar(mensagem, 'error', 5000, titulo);
  }

  /**
   * Aviso
   */
  aviso(mensagem, titulo = 'Atenção') {
    return this.mostrar(mensagem, 'warning', 4000, titulo);
  }

  /**
   * Informação
   */
  info(mensagem, titulo = 'Informação') {
    return this.mostrar(mensagem, 'info', 3000, titulo);
  }

  /**
   * Fechar notificação
   */
  fechar(id) {
    const notif = document.getElementById(`notif-${id}`);
    if (notif) {
      notif.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notif.remove(), 300);
    }
    this.notificacoes = this.notificacoes.filter(n => n.id !== id);
  }

  /**
   * Limpar todas
   */
  limparTodas() {
    this.notificacoes.forEach(n => {
      if (n.elemento.parentElement) {
        n.elemento.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => n.elemento.remove(), 300);
      }
    });
    this.notificacoes = [];
  }
}

// ==================== BADGES E INDICADORES ====================

class MEBBadges {
  /**
   * Badge de notificações não lidas
   */
  static mensagensNaoLidas(quantidade) {
    if (quantidade === 0) return '';

    return `
      <span style="
        position: absolute;
        top: -8px;
        right: -8px;
        background: #F44336;
        color: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        border: 2px solid white;
      ">
        ${quantidade}
      </span>
    `;
  }

  /**
   * Indicador de status
   */
  static status(status) {
    const cores = {
      'ativa': '#4CAF50',
      'pausada': '#FFC107',
      'finalizada': '#9E9E9E',
      'aguardando': '#2196F3'
    };

    const nomes = {
      'ativa': 'Ativa',
      'pausada': 'Pausada',
      'finalizada': 'Finalizada',
      'aguardando': 'Aguardando'
    };

    return `
      <span class="meb-badge" style="background: ${cores[status] || '#999'}; color: white;">
        ${nomes[status] || status}
      </span>
    `;
  }

  /**
   * Streak de hábito
   */
  static streak(dias) {
    return `
      <span style="
        background: linear-gradient(135deg, #FF6B6B 0%, #FF8E72 100%);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-weight: bold;
        font-size: 12px;
        display: inline-block;
      ">
        🔥 ${dias} dias
      </span>
    `;
  }

  /**
   * Progresso em percentual
   */
  static progresso(percentual) {
    const cores = ['#F44336', '#FFC107', '#8BC34A', '#4CAF50'];
    const cor = percentual < 25 ? cores[0] : percentual < 50 ? cores[1] : percentual < 75 ? cores[2] : cores[3];

    return `
      <div style="
        display: flex;
        align-items: center;
        gap: 8px;
      ">
        <div style="
          width: 100px;
          height: 6px;
          background: #E5D9C9;
          border-radius: 3px;
          overflow: hidden;
        ">
          <div style="
            width: ${percentual}%;
            height: 100%;
            background: ${cor};
            transition: width 0.3s ease;
          "></div>
        </div>
        <span style="font-weight: bold; color: ${cor}; font-size: 12px;">
          ${Math.round(percentual)}%
        </span>
      </div>
    `;
  }
}

// ==================== MODAL DE CONFIRMAÇÃO ====================

class MEBConfirm {
  static criar(titulo, mensagem, onConfirmar, onCancelar) {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      `;

      const content = document.createElement('div');
      content.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 400px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      `;

      content.innerHTML = `
        <h2 style="
          color: #5C6B3A;
          margin: 0 0 10px 0;
          font-size: 20px;
        ">${titulo}</h2>

        <p style="
          color: #666;
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 20px 0;
        ">${mensagem}</p>

        <div style="
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        ">
          <button onclick="document.body.removeChild(document.body.querySelector('[data-confirm-modal]'))" style="
            background: #E5D9C9;
            color: #5C6B3A;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
          ">Cancelar</button>

          <button onclick="this.onclick = null; document.body.removeChild(document.body.querySelector('[data-confirm-modal]'))" style="
            background: #5C6B3A;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
          ">Confirmar</button>
        </div>
      `;

      modal.setAttribute('data-confirm-modal', 'true');
      modal.appendChild(content);
      document.body.appendChild(modal);

      resolve();
    });
  }
}

// ==================== HELPER: INICIALIZAR ====================

function inicializarNotificacoes() {
  window.notificacoes = new MEBNotificacoes();
  return window.notificacoes;
}
