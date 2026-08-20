/**
 * MEB RELATÓRIOS
 * Sistema de geração de relatórios em PDF
 * Usando jsPDF + html2canvas (via CDN)
 */

class MEBRelatorios {
  constructor() {
    this.cores = {
      primary: '#5C6B3A',
      secondary: '#3D2314',
      light: '#F5EFE6',
      text: '#333'
    };
  }

  /**
   * Gerar relatório de progresso do paciente (PDF)
   */
  async gerarRelatorioPaciente(pacienteData, stats, historicoPeso) {
    // Carregar bibliotecas
    await this.carregarBibliotecas();

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 10;

    // Logo e título
    doc.setFontSize(24);
    doc.setTextColor(92, 107, 58);
    doc.text('MEB', 20, yPos);

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Método Estruturado de Bem-Estar', 20, yPos + 7);

    yPos += 20;

    // Dados do paciente
    doc.setFontSize(14);
    doc.setTextColor(92, 107, 58);
    doc.text(`Relatório de ${pacienteData.nome}`, 20, yPos);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    yPos += 8;
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, yPos);

    yPos += 10;

    // Seção 1: Dados Pessoais
    this.adicionarSecao(doc, 'Dados Pessoais', 20, yPos);
    yPos += 8;

    const dadosPessoais = [
      ['Nome:', pacienteData.nome],
      ['Email:', pacienteData.email],
      ['Plano:', pacienteData.plano_id?.toUpperCase()],
      ['Status:', pacienteData.status?.toUpperCase()],
      ['Altura:', `${pacienteData.altura} cm`],
      ['Meta de Peso:', `${pacienteData.peso_meta} kg`]
    ];

    yPos = this.adicionarTabela(doc, dadosPessoais, 20, yPos);
    yPos += 10;

    // Seção 2: Progresso
    this.adicionarSecao(doc, 'Progresso no Plano', 20, yPos);
    yPos += 8;

    const progresso = stats?.progresso || 0;
    const diasRestantes = stats?.dias_restantes || 0;

    doc.setFontSize(12);
    doc.setTextColor(76, 175, 80);
    doc.text(`${Math.round(progresso)}% Completo`, 20, yPos);

    yPos += 8;

    // Barra de progresso
    const progressoBarraWidth = 150;
    const progressoBarraFill = (progresso / 100) * progressoBarraWidth;

    doc.setDrawColor(229, 217, 201);
    doc.rect(20, yPos, progressoBarraWidth, 5);

    doc.setFillColor(92, 107, 58);
    doc.rect(20, yPos, progressoBarraFill, 5, 'F');

    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`${diasRestantes} dias restantes no plano`, 20, yPos);

    yPos += 15;

    // Seção 3: Peso
    if (historicoPeso && historicoPeso.length > 0) {
      this.adicionarSecao(doc, 'Progresso de Peso', 20, yPos);
      yPos += 8;

      const pesoInicial = historicoPeso[0].peso;
      const pesofinal = historicoPeso[historicoPeso.length - 1].peso;
      const diferenca = (pesofinal - pesoInicial).toFixed(1);
      const percentual = ((diferenca / pesoInicial) * 100).toFixed(1);

      const tabelaPeso = [
        ['Peso Inicial:', `${pesoInicial} kg`],
        ['Peso Atual:', `${pesofinal} kg`],
        ['Diferença:', `${diferenca} kg (${percentual}%)`],
        ['Meta:', `${pacienteData.peso_meta} kg`]
      ];

      yPos = this.adicionarTabela(doc, tabelaPeso, 20, yPos);
      yPos += 10;
    }

    // Seção 4: Hábitos
    this.adicionarSecao(doc, 'Resumo de Hábitos', 20, yPos);
    yPos += 8;

    const habitosCompletados = stats?.habitos_semana || 0;
    doc.setFontSize(12);
    doc.setTextColor(244, 67, 54);
    doc.text(`${habitosCompletados} hábitos completados esta semana`, 20, yPos);

    // Novo página se necessário
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = 10;
    }

    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text(
      `Relatório gerado em ${new Date().toLocaleString('pt-BR')}`,
      20,
      pageHeight - 10
    );

    return doc;
  }

  /**
   * Gerar relatório nutritionist overview
   */
  async gerarRelatorioNutricionista(pacientes) {
    await this.carregarBibliotecas();
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF('landscape');
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 10;

    // Título
    doc.setFontSize(20);
    doc.setTextColor(92, 107, 58);
    doc.text('Painel do Nutricionista - Resumo de Pacientes', 20, yPos);

    yPos += 15;

    // Tabela de pacientes
    const tabelaPacientes = pacientes.map(p => [
      p.nome,
      p.plano_id,
      `${p.peso_atual} kg`,
      `${p.peso_meta} kg`,
      p.status
    ]);

    const headers = ['Nome', 'Plano', 'Peso Atual', 'Meta', 'Status'];

    doc.autoTable({
      head: [headers],
      body: tabelaPacientes,
      startY: yPos,
      margin: 20,
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [92, 107, 58],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 239, 230]
      }
    });

    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text(
      `Relatório gerado em ${new Date().toLocaleString('pt-BR')}`,
      20,
      pageHeight - 10
    );

    return doc;
  }

  /**
   * Gerar planilha de refeições (CSV/Excel)
   */
  gerarCSVRefeicoes(refeicoes, nomeArquivo = 'refeicoes.csv') {
    let csv = 'Data,Tipo,Alimentos,Descrição,Foto\n';

    refeicoes.forEach(r => {
      const alimentos = (r.alimentos || []).join('; ');
      csv += `"${new Date(r.criado_em).toLocaleDateString('pt-BR')}","${r.tipo}","${alimentos}","${r.descricao || ''}","${r.foto_url || ''}"\n`;
    });

    this.downloadArquivo(csv, nomeArquivo, 'text/csv');
  }

  /**
   * Gerar resumo de progresso em texto
   */
  gerarResumoProgresso(pacienteData, stats) {
    const agora = new Date();

    let relatorio = `
╔════════════════════════════════════════════════════════════╗
║          RELATÓRIO DE PROGRESSO - MEB                      ║
╚════════════════════════════════════════════════════════════╝

PACIENTE
───────────────────────────────────────────────────────────
Nome:              ${pacienteData.nome}
Email:             ${pacienteData.email}
Plano:             ${pacienteData.plano_id?.toUpperCase()}
Status:            ${pacienteData.status?.toUpperCase()}
Data do Relatório: ${agora.toLocaleDateString('pt-BR')} ${agora.toLocaleTimeString('pt-BR')}

PROGRESSO NO PLANO
───────────────────────────────────────────────────────────
Percentual:        ${Math.round(stats?.progresso || 0)}%
Dias Restantes:    ${stats?.dias_restantes || 0} dias
Hábitos Semana:    ${stats?.habitos_semana || 0} completados

PESO
───────────────────────────────────────────────────────────
Peso Atual:        ${pacienteData.peso_atual} kg
Peso Meta:         ${pacienteData.peso_meta} kg
Altura:            ${pacienteData.altura} cm

OBSERVAÇÕES
───────────────────────────────────────────────────────────
Este relatório foi gerado automaticamente pelo sistema MEB.
Para mais detalhes, acesse o painel completo.

${this.rodape()}
`;

    return relatorio;
  }

  // ==================== HELPERS ====================

  async carregarBibliotecas() {
    // jsPDF
    if (typeof jsPDF === 'undefined') {
      await this.carregarScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    }

    // html2canvas
    if (typeof html2canvas === 'undefined') {
      await this.carregarScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    }
  }

  carregarScript(src) {
    return new Promise((resolve, reject) => {
      if (typeof jsPDF !== 'undefined' && src.includes('jspdf')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  adicionarSecao(doc, titulo, x, y) {
    doc.setFontSize(12);
    doc.setTextColor(92, 107, 58);
    doc.text(titulo, x, y);

    doc.setDrawColor(229, 217, 201);
    doc.line(x, y + 2, x + 170, y + 2);
  }

  adicionarTabela(doc, dados, x, y) {
    const lineHeight = 6;

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    let yAtual = y;

    dados.forEach(([chave, valor]) => {
      doc.setTextColor(100, 100, 100);
      doc.text(chave, x, yAtual);

      doc.setTextColor(50, 50, 50);
      doc.text(String(valor), x + 60, yAtual);

      yAtual += lineHeight;
    });

    return yAtual;
  }

  downloadArquivo(conteudo, nomeArquivo, tipo = 'text/plain') {
    const blob = new Blob([conteudo], { type: tipo });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    link.click();
    URL.revokeObjectURL(url);
  }

  rodape() {
    return `
Gerado por MEB - Método Estruturado de Bem-Estar
${new Date().toLocaleDateString('pt-BR')}
`;
  }
}

// ==================== EXPORTAR FUNCIONALIDADES ====================

/**
 * Botão de download
 */
function criarBotaoDownload(textoInterno, onclick) {
  return `
    <button onclick="${onclick}" style="
      background: #5C6B3A;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      margin: 5px;
    " onmouseover="this.style.background='#3D2314'" onmouseout="this.style.background='#5C6B3A'">
      ${textoInterno}
    </button>
  `;
}
