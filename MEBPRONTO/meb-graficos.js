/**
 * MEB GRÁFICOS
 * Biblioteca de gráficos e visualizações com Chart.js
 * Sem dependências externas - Chart.js via CDN
 */

class MEBGraficos {
  constructor() {
    this.charts = {};
    this.cores = {
      primary: '#5C6B3A',
      secondary: '#3D2314',
      success: '#4CAF50',
      warning: '#FFC107',
      danger: '#F44336',
      light: '#F5EFE6',
      dark: '#333',
      grid: '#E5D9C9'
    };
  }

  /**
   * Gráfico de evolução de peso
   */
  criarGraficoProgressoPeso(canvasId, historico) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    // Preparar dados
    const labels = historico.map(h => this.formatarData(h.data_medicao));
    const pesos = historico.map(h => h.peso);

    // Calcular tendência
    const primeiroRegistro = pesos[0];
    const ultimoRegistro = pesos[pesos.length - 1];
    const diferenca = (ultimoRegistro - primeiroRegistro).toFixed(1);
    const percentual = ((diferenca / primeiroRegistro) * 100).toFixed(1);

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Peso (kg)',
            data: pesos,
            borderColor: this.cores.primary,
            backgroundColor: `rgba(92, 107, 58, 0.1)`,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: this.cores.primary,
            pointBorderColor: 'white',
            pointBorderWidth: 2,
            pointHoverRadius: 7,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleColor: 'white',
            bodyColor: 'white',
            callbacks: {
              label: (context) => `Peso: ${context.parsed.y} kg`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: this.cores.grid,
              drawBorder: false
            },
            ticks: {
              callback: (value) => `${value} kg`
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });

    this.charts[canvasId] = chart;

    return {
      chart,
      stats: {
        diferenca,
        percentual,
        primeiroRegistro,
        ultimoRegistro,
        media: (pesos.reduce((a, b) => a + b) / pesos.length).toFixed(1)
      }
    };
  }

  /**
   * Gráfico de hábitos - semana
   */
  criarGraficoHabitosSemana(canvasId, habitos) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    const labels = habitos.map(h => h.nome);
    const completados = habitos.map(h => h.completados_semana || 0);
    const meta = habitos.map(h => h.frequencia_semanal || 7);

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Completados',
            data: completados,
            backgroundColor: this.cores.success,
            borderRadius: 5,
          },
          {
            label: 'Meta',
            data: meta,
            backgroundColor: this.cores.light,
            borderColor: this.cores.grid,
            borderWidth: 1,
            borderRadius: 5,
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 10,
            titleColor: 'white',
            bodyColor: 'white'
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: this.cores.grid
            },
            ticks: {
              stepSize: 1
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        }
      }
    });

    this.charts[canvasId] = chart;
    return chart;
  }

  /**
   * Gráfico de progresso plano (donut)
   */
  criarGraficoProgresoPlano(canvasId, percentualProgresso, diasRestantes, diasTotal) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    const diasPassados = diasTotal - diasRestantes;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completado', 'Restante'],
        datasets: [
          {
            data: [diasPassados, diasRestantes],
            backgroundColor: [
              this.cores.primary,
              this.cores.light
            ],
            borderColor: 'white',
            borderWidth: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b);
                const percentual = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} dias (${percentual}%)`;
              }
            }
          }
        }
      }
    });

    this.charts[canvasId] = chart;
    return chart;
  }

  /**
   * Gráfico de humor/energia ao longo do tempo
   */
  criarGraficoBemEstar(canvasId, diarioEntradas) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    const labels = diarioEntradas.map(d => this.formatarData(d.data));
    const energia = diarioEntradas.map(d => d.energia || 0);
    const saciedade = diarioEntradas.map(d => d.saciedade || 0);
    const sono = diarioEntradas.map(d => d.qualidade_sono || 0);

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: '⚡ Energia',
            data: energia,
            borderColor: '#FFC107',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#FFC107'
          },
          {
            label: '🍽️ Saciedade',
            data: saciedade,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#4CAF50'
          },
          {
            label: '😴 Sono',
            data: sono,
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#2196F3'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleColor: 'white',
            bodyColor: 'white'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
            ticks: {
              callback: (value) => value
            }
          }
        }
      }
    });

    this.charts[canvasId] = chart;
    return chart;
  }

  /**
   * Gráfico de refeições registradas
   */
  criarGraficoRefeicoes(canvasId, refeicoesPorDia) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    const labels = refeicoesPorDia.map(r => this.formatarData(r.data));
    const cafe = refeicoesPorDia.map(r => r.cafe || 0);
    const almoco = refeicoesPorDia.map(r => r.almoco || 0);
    const lanche = refeicoesPorDia.map(r => r.lanche || 0);
    const jantar = refeicoesPorDia.map(r => r.jantar || 0);

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: '☕ Café',
            data: cafe,
            backgroundColor: '#8B4513'
          },
          {
            label: '🥗 Almoço',
            data: almoco,
            backgroundColor: '#4CAF50'
          },
          {
            label: '🥐 Lanche',
            data: lanche,
            backgroundColor: '#FFC107'
          },
          {
            label: '🍽️ Jantar',
            data: jantar,
            backgroundColor: '#2196F3'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        indexAxis: 'x',
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          x: {
            stacked: false,
            grid: {
              color: this.cores.grid
            }
          },
          y: {
            stacked: false,
            beginAtZero: true,
            grid: {
              color: this.cores.grid
            }
          }
        }
      }
    });

    this.charts[canvasId] = chart;
    return chart;
  }

  /**
   * KPIs em cards
   */
  criarCardKPI(titulo, valor, unidade, icone, cor = 'primary') {
    const corHex = this.cores[cor] || this.cores.primary;

    return `
      <div style="
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
        border-left: 4px solid ${corHex};
      ">
        <div style="
          font-size: 28px;
          margin-bottom: 10px;
        ">${icone}</div>
        <div style="
          color: #666;
          font-size: 13px;
          margin-bottom: 8px;
          font-weight: 600;
        ">${titulo}</div>
        <div style="
          font-size: 28px;
          font-weight: bold;
          color: ${corHex};
        ">${valor}</div>
        <div style="
          color: #999;
          font-size: 12px;
          margin-top: 5px;
        ">${unidade}</div>
      </div>
    `;
  }

  /**
   * Utilitários
   */
  formatarData(data) {
    if (!data) return '';
    const d = new Date(data);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  }

  destruirGrafico(canvasId) {
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
      delete this.charts[canvasId];
    }
  }

  destruirTodos() {
    Object.keys(this.charts).forEach(id => {
      this.charts[id].destroy();
    });
    this.charts = {};
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Carregar Chart.js dinamicamente
 */
function carregarChartJS() {
  return new Promise((resolve, reject) => {
    if (typeof Chart !== 'undefined') {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Criar grid de gráficos responsivo
 */
function criarGridGraficos(htmlString) {
  const container = document.createElement('div');
  container.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin: 20px 0;
  `;
  container.innerHTML = htmlString;
  return container;
}

/**
 * Estilo para containers de gráfico
 */
function criarContainerGrafico(titulo, canvasHTML) {
  return `
    <div style="
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    ">
      <h3 style="
        color: #5C6B3A;
        margin: 0 0 15px 0;
        font-size: 16px;
        font-weight: 600;
      ">${titulo}</h3>
      ${canvasHTML}
    </div>
  `;
}
