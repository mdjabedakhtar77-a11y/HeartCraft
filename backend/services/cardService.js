/**
 * Card Service
 * Encapsulates card creation, customization, preview, security, and delivery logic.
 */

const Card = require('../models/Card');
const CryptoUtils = require('../utils/crypto');

class CardService {
  async createCardDraft(userId, data) {
    const slug = CryptoUtils.generateSecureSlug(10);
    let passcode_hash = null;

    if (data.passcode) {
      passcode_hash = await CryptoUtils.hashPasscode(data.passcode);
    }

    const card = Card.createDraft({
      user_id: userId || null,
      template_id: data.template_id,
      recipient_name: data.recipient_name,
      slug,
      message: data.message,
      relationship: data.relationship,
      birthday_date: data.birthday_date,
      question: data.question,
      ending_message: data.ending_message,
      extra_data: data.extra_data,
      music: data.music,
      countdown: data.countdown,
      passcode_hash,
      media: data.media
    });

    return card;
  }

  async updateCard(cardId, data) {
    let passcode_hash;
    if (data.passcode !== undefined) {
      passcode_hash = data.passcode ? await CryptoUtils.hashPasscode(data.passcode) : null;
    }

    const card = Card.updateCard(cardId, {
      ...data,
      ...(passcode_hash !== undefined ? { passcode_hash } : {})
    });

    if (!card) {
      throw new Error(`Card with ID ${cardId} not found.`);
    }

    return card;
  }

  async getCardForCreator(cardId) {
    const card = Card.findById(cardId);
    if (!card) {
      throw new Error(`Card with ID ${cardId} not found.`);
    }
    return card;
  }

  async getCardPreview(cardId) {
    const card = Card.findById(cardId);
    if (!card) {
      throw new Error(`Card with ID ${cardId} not found.`);
    }
    // Preview returns unredacted card data with isPreview=true flag
    return {
      ...card,
      isPreview: true
    };
  }

  async getPublicCard(slug, userAgent = '') {
    const card = Card.findBySlug(slug);
    if (!card) {
      throw new Error('Experience not found or invalid URL.');
    }

    if (card.status !== 'published') {
      throw new Error('This surprise card is still a draft and has not been published yet.');
    }

    // Record view count
    Card.recordView(card.id, userAgent);

    // If protected by passcode, mask the sensitive content until passcode is verified
    if (card.settings && card.settings.has_passcode) {
      return {
        id: card.id,
        slug: card.slug,
        recipient_name: card.recipient_name,
        template: card.template,
        is_passcode_protected: true,
        settings: {
          countdown: card.settings.countdown,
          birthday_date: card.content ? card.content.birthday_date : null
        }
      };
    }

    return {
      ...card,
      is_passcode_protected: false
    };
  }

  async verifyCardPasscode(slug, enteredPasscode) {
    const card = Card.findBySlug(slug);
    if (!card) {
      throw new Error('Experience not found.');
    }

    const dbCardSettings = require('../config/database').getDatabase().findOne('card_settings', s => Number(s.card_id) === Number(card.id));
    const storedHash = dbCardSettings ? dbCardSettings.passcode_hash : null;

    if (!storedHash) {
      return { verified: true, card };
    }

    const isValid = await CryptoUtils.verifyPasscode(enteredPasscode, storedHash);
    if (!isValid) {
      return { verified: false, message: 'Incorrect passcode. Please try again.' };
    }

    return {
      verified: true,
      card: {
        ...card,
        is_passcode_protected: false
      }
    };
  }

  async publishCard(cardId) {
    const card = Card.findById(cardId);
    if (!card) {
      throw new Error(`Card with ID ${cardId} not found.`);
    }
    const published = Card.publish(cardId);
    return published;
  }
}

module.exports = new CardService();
