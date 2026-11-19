/**
 * Media Model & Repository
 */

const { getDatabase } = require('../config/database');

class Media {
  constructor(data = {}) {
    this.id = data.id;
    this.card_id = data.card_id;
    this.media_type = data.media_type || 'image';
    this.media_url = data.media_url;
    this.created_at = data.created_at;
  }

  static findByCardId(cardId) {
    const db = getDatabase();
    const rows = db.find('card_media', m => Number(m.card_id) === Number(cardId));
    return rows.map(r => new Media(r));
  }

  static create(data) {
    const db = getDatabase();
    const row = db.insert('card_media', {
      card_id: Number(data.card_id),
      media_type: data.media_type || 'image',
      media_url: data.media_url
    });
    return new Media(row);
  }
}

module.exports = Media;
