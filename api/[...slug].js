/**
 * Vercel Serverless Function Dynamic Catch-all Handler
 * Handles all /api/* requests and passes them to Express.
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
      console.error('[Vercel API] DB initialization error:', err);
    }
  }

  // Normalize req.url so Express routes match regardless of Vercel path rewriting
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }

  return app(req, res);
};
