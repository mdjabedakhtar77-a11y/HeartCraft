/**
 * Card Controller
 * Handles customer card creation, previewing, and public recipient access.
 */

const cardService = require('../services/cardService');
const qrService = require('../services/qrService');
const Card = require('../models/Card');

exports.createCardDraft = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { template_id, recipient_name, message, relationship, birthday_date, question, ending_message, extra_data, music, countdown, passcode, media } = req.body;

    if (!template_id) {
      return res.status(400).json({ success: false, message: 'template_id is required.' });
    }

    const card = await cardService.createCardDraft(userId, {
      template_id,
      recipient_name: recipient_name || 'Someone Special',
      message: message || '',
      relationship: relationship || 'Friend',
      birthday_date,
      question,
      ending_message,
      extra_data,
      music,
      countdown,
      passcode,
      media
    });

    return res.status(201).json({
      success: true,
      message: 'Card draft created successfully.',
      card
    });
  } catch (err) {
    next(err);
  }
};

exports.getCardDetails = async (req, res, next) => {
  try {
    const card = await cardService.getCardForCreator(req.params.id);
    return res.json({ success: true, card });
  } catch (err) {
    next(err);
  }
};

exports.updateCard = async (req, res, next) => {
  try {
    const card = await cardService.updateCard(req.params.id, req.body);
    return res.json({
      success: true,
      message: 'Card draft updated successfully.',
      card
    });
  } catch (err) {
    next(err);
  }
};

exports.generatePreview = async (req, res, next) => {
  try {
    const preview = await cardService.getCardPreview(req.params.id);
    return res.json({ success: true, preview });
  } catch (err) {
    next(err);
  }
};

function resolveFrontendUrl(req) {
  if (req && req.query && req.query.frontendUrl) {
    return req.query.frontendUrl.replace(/\/$/, '');
  }
  const origin = req.headers?.origin || (req.headers?.referer ? new URL(req.headers.referer).origin : null);
  if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
    return origin.replace(/\/$/, '');
  }
  if (process.env.FRONTEND_URL && !process.env.FRONTEND_URL.includes('localhost')) {
    return process.env.FRONTEND_URL.replace(/\/$/, '');
  }
  return 'https://heartcraft-ashy.vercel.app';
}

exports.getUserCards = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const db = require('../config/database').getDatabase();
    const cardRows = db.find('cards', c => Number(c.user_id) === Number(userId));
    const frontendUrl = resolveFrontendUrl(req);
    const cards = cardRows.map(row => {
      const hydrated = Card.hydrate(row);
      return {
        ...hydrated,
        cardUrl: `${frontendUrl}/card/${hydrated.slug}`
      };
    });
    return res.json({ success: true, cards });
  } catch (err) {
    next(err);
  }
};

exports.publishCard = async (req, res, next) => {
  try {
    const card = await cardService.publishCard(req.params.id);
    const frontendUrl = resolveFrontendUrl(req);
    const cardUrl = `${frontendUrl}/card/${card.slug}`;

    return res.json({
      success: true,
      message: 'Card published successfully!',
      card,
      shareUrl: cardUrl
    });
  } catch (err) {
    next(err);
  }
};

exports.getPublicCard = async (req, res, next) => {
  try {
    const userAgent = req.headers['user-agent'] || '';
    const card = await cardService.getPublicCard(req.params.slug, userAgent);
    return res.json({ success: true, card });
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
};

exports.verifyPasscode = async (req, res, next) => {
  try {
    const { passcode } = req.body;
    const result = await cardService.verifyCardPasscode(req.params.slug, passcode);

    if (!result.verified) {
      return res.status(401).json({ success: false, message: result.message });
    }

    return res.json({
      success: true,
      message: 'Passcode verified successfully!',
      card: result.card
    });
  } catch (err) {
    next(err);
  }
};

exports.generateShare = async (req, res, next) => {
  try {
    const card = Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card not found.' });
    }

    const frontendUrl = resolveFrontendUrl(req);
    const cardUrl = `${frontendUrl}/card/${card.slug}`;
    const whatsappMessage = encodeURIComponent(
      `✨ Hey ${card.recipient_name}! I made a special digital surprise just for you on HeartCraft ❤️ Open it here:\n${cardUrl}`
    );
    const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

    return res.json({
      success: true,
      share: {
        cardUrl,
        slug: card.slug,
        recipient_name: card.recipient_name,
        whatsappUrl,
        emailSubject: encodeURIComponent(`A special surprise for you, ${card.recipient_name}! ❤️`),
        emailBody: encodeURIComponent(`Hey ${card.recipient_name},\n\nI created something memorable for you. Click the link below to experience your digital surprise:\n${cardUrl}\n\nWith love!`)
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getQrCode = async (req, res, next) => {
  try {
    const card = Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card not found.' });
    }

    const frontendUrl = resolveFrontendUrl(req);
    const cardUrl = `${frontendUrl}/card/${card.slug}`;
    const qrDataUrl = await qrService.generateQrDataUrl(cardUrl);

    return res.json({
      success: true,
      qrDataUrl,
      cardUrl
    });
  } catch (err) {
    next(err);
  }
};
