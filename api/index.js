/**
 * Vercel Serverless Function Entrypoint
 * Bridges incoming Vercel /api requests to the Express backend app.
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
  return app(req, res);
};
