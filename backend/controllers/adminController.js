/**
 * Admin Controller (Free & Open Platform)
 * Provides platform metrics, analytics, customer overview, and template management.
 */

const { getDatabase } = require('../config/database');
const User = require('../models/User');
const Template = require('../models/Template');
const Card = require('../models/Card');

exports.getDashboardStats = (req, res, next) => {
  try {
    const db = getDatabase();
    const users = db.find('users');
    const cards = db.find('cards');
    const views = db.find('card_views');
    const reviews = db.find('reviews');

    const totalCustomers = users.filter(u => u.role === 'customer').length;
    const publishedCards = cards.filter(c => c.status === 'published').length;
    const totalDrafts = cards.length - publishedCards;
    const totalViews = views.length;

    const recentCards = cards.slice(-10).reverse();

    return res.json({
      success: true,
      stats: {
        totalSurprises: cards.length,
        publishedCards,
        totalDrafts,
        totalCustomers,
        totalViews,
        completionRate: cards.length > 0 ? ((publishedCards / cards.length) * 100).toFixed(1) : '100.0',
        averageRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '5.0'
      },
      recentCards
    });
  } catch (err) {
    next(err);
  }
};

exports.getCustomers = (req, res, next) => {
  try {
    const customers = User.getAllCustomers();
    const cards = Card.getAllCards();

    const enriched = customers.map(c => {
      const userCards = cards.filter(cd => Number(cd.user_id) === Number(c.id));
      return {
        ...c,
        surprisesCount: userCards.length
      };
    });

    return res.json({ success: true, customers: enriched });
  } catch (err) {
    next(err);
  }
};

exports.getReviews = (req, res, next) => {
  try {
    const db = getDatabase();
    const reviews = db.find('reviews');
    return res.json({ success: true, reviews });
  } catch (err) {
    next(err);
  }
};

exports.toggleTemplateStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const template = Template.getById(id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found.' });
    }

    const updated = Template.update(id, { is_active: !template.is_active });
    return res.json({
      success: true,
      message: `Template is now ${updated.is_active ? 'active' : 'disabled'}.`,
      template: updated
    });
  } catch (err) {
    next(err);
  }
};
