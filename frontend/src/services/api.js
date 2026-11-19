/**
 * Frontend API Service
 * Centralizes all communication with the HeartCraft REST API backend.
 * Single Responsibility: Network communication and HTTP abstraction.
 */

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('heartcraft_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('heartcraft_token', token);
    } else {
      localStorage.removeItem('heartcraft_token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('heartcraft_token');
  }

  async request(endpoint, options = {}) {
    const headers = {
      ...(options.headers || {})
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json().catch(() => ({
      success: false,
      message: 'Failed to parse JSON response from server'
    }));

    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  }

  // --- Auth APIs ---
  async register(name, email, password) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    if (data.token) this.setToken(data.token);
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) this.setToken(data.token);
    return data;
  }

  async logout() {
    this.setToken(null);
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // --- Templates APIs ---
  async getTemplates() {
    return this.request('/templates');
  }

  async getTemplateById(id) {
    return this.request(`/templates/${id}`);
  }

  async getTemplatesByCategory(type) {
    return this.request(`/templates/category/${type}`);
  }

  // --- Cards APIs ---
  async createCardDraft(cardData) {
    return this.request('/cards', {
      method: 'POST',
      body: JSON.stringify(cardData)
    });
  }

  async getCard(id) {
    return this.request(`/cards/${id}`);
  }

  async updateCard(id, updates) {
    return this.request(`/cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async getPreview(id) {
    return this.request(`/cards/${id}/preview`, { method: 'POST' });
  }

  async getPublicCard(slug) {
    return this.request(`/public/cards/${slug}`);
  }

  async verifyPasscode(slug, passcode) {
    return this.request(`/public/cards/${slug}/verify`, {
      method: 'POST',
      body: JSON.stringify({ passcode })
    });
  }

  async getShareDetails(id) {
    return this.request(`/cards/${id}/share`, { method: 'POST' });
  }

  async getQrCode(id) {
    return this.request(`/cards/${id}/qr`);
  }

  // --- Publish Card (Free & Instant Flow) ---
  async publishCard(id) {
    return this.request(`/cards/${id}/publish`, { method: 'POST' });
  }

  // --- Media Upload APIs ---
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    return this.request('/uploads/image', {
      method: 'POST',
      body: formData
    });
  }

  async uploadAudio(file) {
    const formData = new FormData();
    formData.append('audio', file);
    return this.request('/uploads/audio', {
      method: 'POST',
      body: formData
    });
  }

  // --- Admin APIs ---
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAdminCustomers() {
    return this.request('/admin/customers');
  }

  async getAdminReviews() {
    return this.request('/admin/reviews');
  }

  async toggleTemplate(id) {
    return this.request(`/admin/templates/${id}/toggle`, { method: 'PATCH' });
  }

  async updateTemplate(id, data) {
    return this.request(`/admin/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
}

export const api = new ApiService();
export default api;
