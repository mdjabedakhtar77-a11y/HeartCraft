/**
 * Vercel Serverless Function Dynamic Handler (Frontend Root Directory mode)
 */

const app = require('../backend/server');
const { dbManager } = require('../backend/config/database');

let initialized = false;

module.exports = async (req, res) => {
  if (!initialized) {
    try {
      await dbManager.initialize();
      initialized = true;
    } catch (err) {
      console.error('[Vercel Serverless] DB initialization error:', err);
    }
  }

  // Normalize req.url so Express routes match
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }

  return app(req, res);
};
