/**
 * MEB STORAGE
 * Sistema de upload de arquivos para Supabase Storage
 * Fotos de refeições, progresso e avatares
 */

class MEBStorage {
  constructor(supabaseUrl, supabaseAnonKey) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseAnonKey = supabaseAnonKey;
    this.buckets = {
      refeicoes: 'refeicoes',
      progresso: 'fotos-progresso',
      avatares: 'avatares',
      documentos: 'documentos'
    };
  }

  /**
   * Upload de foto para storage
   */
  async uploadFoto(arquivo, tipo = 'refeicoes', nomeCustomizado = null) {
    try {
      // Validar arquivo
      if (!arquivo) throw new Error('Arquivo não selecionado');

      if (arquivo.size > 5 * 1024 * 1024) {
        throw new Error('Arquivo muito grande (máximo 5MB)');
      }

      const tiposValidos = ['image/jpeg', 'image/png', 'image/webp'];
      if (!tiposValidos.includes(arquivo.type)) {
        throw new Error('Formato não permitido (JPEG, PNG, WebP apenas)');
      }

      // Validar bucket
      if (!this.buckets[tipo]) {
        throw new Error(`Tipo de armazenamento inválido: ${tipo}`);
      }

      // Gerar nome único
      const bucket = this.buckets[tipo];
      const timestamp = Date.now();
      const extensao = arquivo.name.split('.').pop();
      const nomeArquivo = nomeCustomizado
        ? `${nomeCustomizado}_${timestamp}.${extensao}`
        : `${timestamp}_${Math.random().toString(36).substr(2, 9)}.${extensao}`;

      // Upload
      const formData = new FormData();
      formData.append('file', arquivo);

      const response = await fetch(
        `${this.supabaseUrl}/storage/v1/object/${bucket}/${nomeArquivo}`,
        {
          method: 'POST',
          headers: {
            'apikey': this.supabaseAnonKey,
          },
          body: arquivo
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro no upload');
      }

      // Retornar URL pública
      const urlPublica = `${this.supabaseUrl}/storage/v1/object/public/${bucket}/${nomeArquivo}`;

      return {
        success: true,
        url: urlPublica,
        nomeArquivo,
        tamanho: arquivo.size,
        tipo: arquivo.type
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Upload múltiplo de fotos de progresso
   */
  async uploadFotosProgresso(pacienteId, fotos) {
    /**
     * fotos = {
     *   frontal: File,
     *   lateral: File,
     *   costas: File
     * }
     */
    try {
      const urls = {};

      for (const [posicao, arquivo] of Object.entries(fotos)) {
        if (!arquivo) continue;

        const result = await this.uploadFoto(
          arquivo,
          'progresso',
          `${pacienteId}_${posicao}`
        );

        if (!result.success) {
          throw new Error(`Erro ao fazer upload ${posicao}: ${result.error}`);
        }

        urls[posicao] = result.url;
      }

      return {
        success: true,
        urls
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Deletar arquivo
   */
  async deletarArquivo(tipo, nomeArquivo) {
    try {
      const bucket = this.buckets[tipo];
      if (!bucket) throw new Error('Bucket inválido');

      const response = await fetch(
        `${this.supabaseUrl}/storage/v1/object/${bucket}/${nomeArquivo}`,
        {
          method: 'DELETE',
          headers: {
            'apikey': this.supabaseAnonKey,
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao deletar arquivo');
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Listar arquivos em um bucket
   */
  async listarArquivos(tipo, prefixo = '') {
    try {
      const bucket = this.buckets[tipo];
      if (!bucket) throw new Error('Bucket inválido');

      const response = await fetch(
        `${this.supabaseUrl}/storage/v1/object/list/${bucket}?prefix=${prefixo}`,
        {
          method: 'GET',
          headers: {
            'apikey': this.supabaseAnonKey,
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao listar arquivos');
      }

      const data = await response.json();
      return {
        success: true,
        arquivos: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obter URL de download
   */
  obterUrlDownload(tipo, nomeArquivo) {
    const bucket = this.buckets[tipo];
    if (!bucket) return null;
    return `${this.supabaseUrl}/storage/v1/object/public/${bucket}/${nomeArquivo}`;
  }

  /**
   * Obter URL de visualização
   */
  obterUrlVisualizacao(tipo, nomeArquivo) {
    const bucket = this.buckets[tipo];
    if (!bucket) return null;
    return `${this.supabaseUrl}/storage/v1/object/public/${bucket}/${nomeArquivo}`;
  }

  /**
   * Validar imagem
   */
  validarImagem(arquivo) {
    if (!arquivo) return { valid: false, erro: 'Nenhum arquivo selecionado' };

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (arquivo.size > maxSize) {
      return { valid: false, erro: 'Arquivo maior que 5MB' };
    }

    const tiposValidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tiposValidos.includes(arquivo.type)) {
      return { valid: false, erro: 'Formato não suportado' };
    }

    return { valid: true };
  }

  /**
   * Gerar thumbnail
   */
  async gerarThumbnail(arquivo, largura = 200, altura = 200) {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = largura;
          canvas.height = altura;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, largura, altura);

          canvas.toBlob((blob) => {
            resolve(new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' }));
          }, 'image/jpeg', 0.8);
        };
        img.src = e.target.result;
      };

      reader.readAsDataURL(arquivo);
    });
  }

  /**
   * Compactar imagem antes de upload
   */
  async compactarImagem(arquivo, qualidade = 0.8) {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            const novoArquivo = new File([blob], arquivo.name, { type: 'image/jpeg' });
            resolve(novoArquivo);
          }, 'image/jpeg', qualidade);
        };
        img.src = e.target.result;
      };

      reader.readAsDataURL(arquivo);
    });
  }
}

// ==================== HELPER UI ====================

/**
 * Componente de upload com drag-drop
 */
function criarUploadInput(id = 'upload-input') {
  const html = `
    <div id="${id}" style="
      border: 2px dashed #E5D9C9;
      border-radius: 10px;
      padding: 30px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #F9F7F3;
    " onmouseover="this.style.background='#F0EBE5'" onmouseout="this.style.background='#F9F7F3'">
      <div style="font-size: 40px; margin-bottom: 10px;">📸</div>
      <p style="margin: 0; font-weight: 600; color: #5C6B3A;">Clique ou arraste uma foto</p>
      <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">
        Máximo 5MB • JPEG, PNG ou WebP
      </p>
      <input type="file" id="${id}-input" accept="image/*" style="display: none;">
    </div>
  `;

  return html;
}

/**
 * Preview de imagem
 */
function criarPreviewImagem(urlOuFile) {
  let src = urlOuFile;

  if (urlOuFile instanceof File) {
    src = URL.createObjectURL(urlOuFile);
  }

  return `
    <div style="
      border-radius: 10px;
      overflow: hidden;
      max-width: 300px;
      margin: 15px 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    ">
      <img src="${src}" alt="preview" style="
        width: 100%;
        height: auto;
        display: block;
      ">
    </div>
  `;
}

/**
 * Galeria de fotos
 */
function criarGaleria(fotos) {
  let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">';

  fotos.forEach(foto => {
    html += `
      <div style="
        border-radius: 8px;
        overflow: hidden;
        aspect-ratio: 1;
        background: #F0F0F0;
      ">
        <img src="${foto.url}" alt="${foto.nome}" style="
          width: 100%;
          height: 100%;
          object-fit: cover;
        ">
      </div>
    `;
  });

  html += '</div>';
  return html;
}

/**
 * Progress bar para upload
 */
function criarProgressBar(id = 'upload-progress') {
  return `
    <div id="${id}" style="
      width: 100%;
      height: 6px;
      background: #E5D9C9;
      border-radius: 3px;
      overflow: hidden;
      margin: 10px 0;
      display: none;
    ">
      <div style="
        height: 100%;
        background: #5C6B3A;
        width: 0%;
        transition: width 0.3s ease;
      "></div>
    </div>
  `;
}
