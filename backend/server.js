/**
 * HeartCraft Backend API Server (Free & Open Platform)
 * All payment services removed. Cards are created, previewed, and published for free.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbManager } = require('./config/database');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const templateRoutes = require('./routes/templateRoutes');
const cardRoutes = require('./routes/cardRoutes');
const publicCardRoutes = require('./routes/publicCardRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Middlewares
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'HeartCraft Digital Surprise Platform (Free & Instant)',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/public/cards', publicCardRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Centralized Error Handler
app.use(errorMiddleware);

// Initialize DB and Start Server
async function startServer() {
  try {
    await dbManager.initialize();
    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`✨ HeartCraft API is running on port ${PORT}`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`💖 Free instant publishing enabled (No payments required)`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('Failed to initialize server:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
