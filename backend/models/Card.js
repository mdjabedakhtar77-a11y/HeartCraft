/**
 * Card Model & Repository
 * Coordinates aggregate card entities across cards, card_content, card_media, card_settings, and card_views.
 */

const { getDatabase } = require('../config/database');
const Template = require('./Template');

class Card {
  constructor(data = {}) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.template_id = data.template_id;
    this.recipient_name = data.recipient_name;
    this.slug = data.slug;
    this.status = data.status || 'draft';
    this.published_at = data.published_at || null;
    this.expires_at = data.expires_at || null;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;

    // Aggregates
    this.content = data.content || null;
    this.media = data.media || [];
    this.settings = data.settings || null;
    this.template = data.template || null;
    this.views_count = data.views_count || 0;
  }

  isExpired() {
    const expiryTime = this.expires_at 
      ? new Date(this.expires_at).getTime()
      : (this.published_at 
          ? new Date(this.published_at).getTime() + 24 * 60 * 60 * 1000
          : (this.created_at ? new Date(this.created_at).getTime() + 24 * 60 * 60 * 1000 : null));
    if (!expiryTime) return false;
    return Date.now() > expiryTime;
  }

  getExpiresAt() {
    if (this.expires_at) return this.expires_at;
    const base = new Date(this.published_at || this.created_at || Date.now());
    return new Date(base.getTime() + 24 * 60 * 60 * 1000).toISOString();
  }

  static findById(id) {
    const db = getDatabase();
    const cardRow = db.findById('cards', id);
    if (!cardRow) return null;
    return this.hydrate(cardRow);
  }

  static findBySlug(slug) {
    const db = getDatabase();
    const cardRow = db.findOne('cards', c => c.slug === slug);
    if (!cardRow) return null;
    return this.hydrate(cardRow);
  }

  static hydrate(cardRow) {
    const db = getDatabase();
    const content = db.findOne('card_content', c => Number(c.card_id) === Number(cardRow.id)) || {};
    const mediaRows = db.find('card_media', m => Number(m.card_id) === Number(cardRow.id));
    const media = mediaRows.map(item => {
      let url = item.media_url || '';
      if (url.startsWith('http://localhost:5000')) {
        url = url.replace('http://localhost:5000', 'https://heartcraft-backend01.onrender.com');
      }
      return {
        ...item,
        media_url: url
      };
    });
    const settings = db.findOne('card_settings', s => Number(s.card_id) === Number(cardRow.id)) || {};
    const views = db.find('card_views', v => Number(v.card_id) === Number(cardRow.id));
    const template = Template.getById(cardRow.template_id);
    const baseDate = cardRow.published_at || cardRow.created_at || new Date().toISOString();
    const expiresAt = cardRow.expires_at || new Date(new Date(baseDate).getTime() + 24 * 60 * 60 * 1000).toISOString();

    return new Card({
      ...cardRow,
      expires_at: expiresAt,
      content,
      media,
      settings: {
        ...settings,
        has_passcode: Boolean(settings.passcode_hash)
      },
      template,
      views_count: views.length
    });
  }

  static createDraft(data) {
    const db = getDatabase();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
    const card = db.insert('cards', {
      user_id: data.user_id || null,
      template_id: Number(data.template_id),
      recipient_name: data.recipient_name || 'My Love',
      slug: data.slug,
      status: 'draft',
      expires_at: expiresAt.toISOString()
    });

    // Insert Content
    const content = db.insert('card_content', {
      card_id: card.id,
      message: data.message || '',
      relationship: data.relationship || 'Friend',
      birthday_date: data.birthday_date || null,
      question: data.question || null,
      ending_message: data.ending_message || null,
      extra_data: data.extra_data || {}
    });

    // Insert Settings
    const settings = db.insert('card_settings', {
      card_id: card.id,
      music: data.music || 'default-melody',
      countdown: Boolean(data.countdown),
      passcode_hash: data.passcode_hash || null
    });

    // Insert Media if any
    const mediaList = [];
    if (Array.isArray(data.media)) {
      data.media.forEach(m => {
        const item = db.insert('card_media', {
          card_id: card.id,
          media_type: m.media_type || 'image',
          media_url: m.media_url
        });
        mediaList.push(item);
      });
    }

    return this.findById(card.id);
  }

  static updateCard(id, updates) {
    const db = getDatabase();
    const card = db.findById('cards', id);
    if (!card) return null;

    if (updates.recipient_name) {
      db.update('cards', id, { recipient_name: updates.recipient_name });
    }
    if (updates.template_id) {
      db.update('cards', id, { template_id: Number(updates.template_id) });
    }

    // Content updates
    const existingContent = db.findOne('card_content', c => Number(c.card_id) === Number(id));
    if (existingContent) {
      db.update('card_content', existingContent.id, {
        message: updates.message !== undefined ? updates.message : existingContent.message,
        relationship: updates.relationship !== undefined ? updates.relationship : existingContent.relationship,
        birthday_date: updates.birthday_date !== undefined ? updates.birthday_date : existingContent.birthday_date,
        question: updates.question !== undefined ? updates.question : existingContent.question,
        ending_message: updates.ending_message !== undefined ? updates.ending_message : existingContent.ending_message,
        extra_data: updates.extra_data !== undefined ? updates.extra_data : existingContent.extra_data
      });
    }

    // Settings updates
    const existingSettings = db.findOne('card_settings', s => Number(s.card_id) === Number(id));
    if (existingSettings) {
      db.update('card_settings', existingSettings.id, {
        music: updates.music !== undefined ? updates.music : existingSettings.music,
        countdown: updates.countdown !== undefined ? Boolean(updates.countdown) : existingSettings.countdown,
        passcode_hash: updates.passcode_hash !== undefined ? updates.passcode_hash : existingSettings.passcode_hash
      });
    }

    // Media updates if provided
    if (Array.isArray(updates.media)) {
      // Remove old and insert new
      const currentMedia = db.find('card_media', m => Number(m.card_id) === Number(id));
      currentMedia.forEach(m => db.delete('card_media', m.id));
      updates.media.forEach(m => {
        db.insert('card_media', {
          card_id: id,
          media_type: m.media_type || 'image',
          media_url: m.media_url
        });
      });
    }

    return this.findById(id);
  }

  static publish(id) {
    const db = getDatabase();
    const publishedAt = new Date();
    const expiresAt = new Date(publishedAt.getTime() + 24 * 60 * 60 * 1000);
    db.update('cards', id, { 
      status: 'published',
      published_at: publishedAt.toISOString(),
      expires_at: expiresAt.toISOString()
    });
    return this.findById(id);
  }

  static recordView(cardId, userAgent = '') {
    const db = getDatabase();
    db.insert('card_views', {
      card_id: Number(cardId),
      viewed_at: new Date().toISOString(),
      user_agent: userAgent
    });
  }

  static getAllCards() {
    const db = getDatabase();
    const rows = db.find('cards');
    return rows.map(r => this.hydrate(r));
  }
}

module.exports = Card;
