/**
 * MEB AUTH SYSTEM
 * Sistema de autenticação e gerenciamento de sessão
 * Integração com Supabase Auth
 */

class MEBAuth {
  constructor(supabaseUrl, supabaseAnonKey) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseAnonKey = supabaseAnonKey;
    this.accessToken = localStorage.getItem('meb_access_token');
    this.user = this.loadUserFromStorage();
    this.listeners = [];
  }

  // ==================== SIGN UP ====================

  async signUp(email, password, nome, role = 'paciente') {
    try {
      // 1. Criar usuário no Supabase Auth
      const signUpResponse = await fetch(
        `${this.supabaseUrl}/auth/v1/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.supabaseAnonKey,
          },
          body: JSON.stringify({
            email,
            password,
            data: {
              nome,
              role,
            },
          }),
        }
      );

      if (!signUpResponse.ok) {
        const error = await signUpResponse.json();
        throw new Error(error.message || 'Erro no cadastro');
      }

      const data = await signUpResponse.json();
      const userId = data.user.id;

      // 2. Criar profile no banco de dados
      await this.createProfile(userId, email, nome, role);

      // 3. Se nutricionista, criar record em nutritionists
      if (role === 'nutricionista') {
        await this.createNutritionistRecord(userId);
      }

      // 4. Auto-login (opcional - comentado para exigir confirmação de email)
      // this.setAuthToken(data.session.access_token, data.user);

      return {
        success: true,
        userId,
        message: 'Cadastro realizado! Verifique seu email para confirmar.',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // ==================== SIGN IN ====================

  async signIn(email, password) {
    try {
      const response = await fetch(
        `${this.supabaseUrl}/auth/v1/token?grant_type=password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.supabaseAnonKey,
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || 'Email ou senha inválidos');
      }

      const data = await response.json();

      // Salvar sessão
      this.setAuthToken(data.access_token, {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role || 'paciente',
        nome: data.user.user_metadata?.nome || email.split('@')[0],
      });

      return {
        success: true,
        user: this.user,
        message: 'Login realizado com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // ==================== LOGOUT ====================

  async logout() {
    try {
      if (this.accessToken) {
        await fetch(`${this.supabaseUrl}/auth/v1/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'apikey': this.supabaseAnonKey,
          },
        });
      }

      localStorage.removeItem('meb_access_token');
      localStorage.removeItem('meb_user');
      this.accessToken = null;
      this.user = null;

      this.notifyListeners('logout');

      return {
        success: true,
        message: 'Logout realizado.',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // ==================== SESSION MANAGEMENT ====================

  setAuthToken(token, user) {
    this.accessToken = token;
    this.user = user;

    localStorage.setItem('meb_access_token', token);
    localStorage.setItem('meb_user', JSON.stringify(user));

    this.notifyListeners('login', user);
  }

  loadUserFromStorage() {
    const userStr = localStorage.getItem('meb_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getCurrentUser() {
    return this.user;
  }

  isAuthenticated() {
    return !!this.accessToken && !!this.user;
  }

  isNutricionista() {
    return this.user?.role === 'nutricionista';
  }

  isPaciente() {
    return this.user?.role === 'paciente';
  }

  getAccessToken() {
    return this.accessToken;
  }

  // ==================== PASSWORD MANAGEMENT ====================

  async requestPasswordReset(email) {
    try {
      const response = await fetch(
        `${this.supabaseUrl}/auth/v1/recovery`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.supabaseAnonKey,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao solicitar redefinição de senha');
      }

      return {
        success: true,
        message: 'Instruções enviadas para seu email',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async resetPassword(accessToken, newPassword) {
    try {
      const response = await fetch(
        `${this.supabaseUrl}/auth/v1/user`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.supabaseAnonKey,
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            password: newPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao atualizar senha');
      }

      return {
        success: true,
        message: 'Senha atualizada com sucesso',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // ==================== PROFILE MANAGEMENT ====================

  async createProfile(userId, email, nome, role) {
    try {
      const response = await fetch(
        `${this.supabaseUrl}/rest/v1/profiles`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.supabaseAnonKey,
            'Authorization': `Bearer ${this.accessToken || ''}`,
          },
          body: JSON.stringify({
            id: userId,
            email,
            name: nome,
            role,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar perfil');
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao criar profile:', error);
      return { success: false, error: error.message };
    }
  }

  async createNutritionistRecord(userId) {
    try {
      const response = await fetch(
        `${this.supabaseUrl}/rest/v1/nutritionists`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.supabaseAnonKey,
            'Authorization': `Bearer ${this.accessToken || ''}`,
          },
          body: JSON.stringify({
            id: userId,
            crn: '', // Será preenchido depois
            is_active: true,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar registro nutricionista');
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao criar nutritionist record:', error);
      return { success: false, error: error.message };
    }
  }

  async updateProfile(updates) {
    if (!this.isAuthenticated()) {
      return { success: false, error: 'Não autenticado' };
    }

    try {
      const response = await fetch(
        `${this.supabaseUrl}/rest/v1/profiles?id=eq.${this.user.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.supabaseAnonKey,
            'Authorization': `Bearer ${this.accessToken}`,
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao atualizar perfil');
      }

      // Atualizar user local
      this.user = { ...this.user, ...updates };
      localStorage.setItem('meb_user', JSON.stringify(this.user));

      return { success: true, user: this.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== EVENT LISTENERS ====================

  onAuthStateChange(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners(eventType, data = null) {
    this.listeners.forEach(callback => {
      callback(eventType, data);
    });
  }

  // ==================== REFRESH TOKEN ====================

  async refreshSession() {
    if (!this.user) {
      return { success: false, error: 'Nenhuma sessão ativa' };
    }

    try {
      // Nota: Supabase auto-refresh requer implementação com refresh_token
      // Por enquanto, verificar se token ainda é válido
      const response = await fetch(
        `${this.supabaseUrl}/rest/v1/profiles?id=eq.${this.user.id}&select=id`,
        {
          headers: {
            'apikey': this.supabaseAnonKey,
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      if (response.status === 401) {
        // Token expirou
        await this.logout();
        return { success: false, error: 'Sessão expirada' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// ==================== INTEGRAÇÃO COM MEBClient ====================

// Estender MEBClient com métodos de autenticação
MEBClient.prototype.auth = null;

MEBClient.prototype.initializeAuth = function(auth) {
  this.auth = auth;
  // Adicionar token aos headers automaticamente
  this.getAuthHeaders = function() {
    return {
      'Authorization': `Bearer ${auth.getAccessToken()}`,
      'apikey': this.supabaseAnonKey,
    };
  };
};

MEBClient.prototype.requireAuth = function() {
  if (!this.auth?.isAuthenticated()) {
    throw new Error('Autenticação necessária. Faça login primeiro.');
  }
};

// ==================== UTIL: VERIFICAR SESSÃO ====================

function verificarSessaoAtiva() {
  return !!localStorage.getItem('meb_access_token');
}

function redirecionarSeNaoAutenticado(urlLogin = '/login.html') {
  if (!verificarSessaoAtiva()) {
    window.location.href = urlLogin;
  }
}

function redirecionarSeAutenticado(urlDashboard = '/dashboard.html') {
  if (verificarSessaoAtiva()) {
    window.location.href = urlDashboard;
  }
}
