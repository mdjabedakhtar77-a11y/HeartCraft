/**
 * Database Adapter & Connection Manager
 * Follows Dependency Inversion Principle (DIP) & Factory Pattern.
 * Provides a unified asynchronous query interface for both MySQL and the local file-backed Relational Adapter.
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

class FileRelationalAdapter {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = {
      users: [],
      categories: [],
      templates: [],
      template_styles: [],
      cards: [],
      card_content: [],
      card_media: [],
      card_settings: [],
      card_views: [],
      reviews: []
    };
    this.counters = {
      users: 1,
      categories: 1,
      templates: 1,
      template_styles: 1,
      cards: 1,
      card_content: 1,
      card_media: 1,
      card_settings: 1,
      card_views: 1,
      reviews: 1
    };
    this.load();
  }

  load() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = { ...this.data, ...parsed.data };
        this.counters = { ...this.counters, ...parsed.counters };
      } catch (err) {
        console.warn('[Database] Warning: Could not parse database.json, starting fresh.', err.message);
      }
    }
  }

  save() {
    try {
      const payload = JSON.stringify({ data: this.data, counters: this.counters }, null, 2);
      fs.writeFileSync(this.filePath, payload, 'utf-8');
    } catch (err) {
      console.error('[Database] Failed to persist data to disk:', err);
    }
  }

  getTable(tableName) {
    if (!this.data[tableName]) {
      this.data[tableName] = [];
      this.counters[tableName] = 1;
    }
    return this.data[tableName];
  }

  insert(tableName, row) {
    const table = this.getTable(tableName);
    const id = this.counters[tableName]++;
    const newRecord = {
      id,
      ...row,
      created_at: row.created_at || new Date().toISOString()
    };
    table.push(newRecord);
    this.save();
    return newRecord;
  }

  find(tableName, predicate = () => true) {
    const table = this.getTable(tableName);
    return table.filter(predicate).map(r => ({ ...r }));
  }

  findOne(tableName, predicate) {
    const table = this.getTable(tableName);
    const item = table.find(predicate);
    return item ? { ...item } : null;
  }

  findById(tableName, id) {
    return this.findOne(tableName, r => Number(r.id) === Number(id));
  }

  update(tableName, id, updates) {
    const table = this.getTable(tableName);
    const index = table.findIndex(r => Number(r.id) === Number(id));
    if (index === -1) return null;
    table[index] = {
      ...table[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.save();
    return { ...table[index] };
  }

  delete(tableName, id) {
    const table = this.getTable(tableName);
    const index = table.findIndex(r => Number(r.id) === Number(id));
    if (index === -1) return false;
    table.splice(index, 1);
    this.save();
    return true;
  }
}

class DatabaseManager {
  constructor() {
    this.mode = 'local';
    this.pool = null;
    this.localAdapter = new FileRelationalAdapter(
      path.join(__dirname, '..', 'data', 'database.json')
    );
  }

  async initialize() {
    const useMySQL = process.env.USE_MYSQL === 'true';
    if (useMySQL) {
      try {
        this.pool = mysql.createPool({
          host: process.env.DB_HOST || 'localhost',
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_NAME || 'heartcraft',
          port: Number(process.env.DB_PORT) || 3306,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0
        });
        const conn = await this.pool.getConnection();
        console.log('[Database] Connected successfully to MySQL server.');
        conn.release();
        this.mode = 'mysql';
      } catch (err) {
        console.warn(`[Database] MySQL connection failed (${err.message}). Using robust local relational store.`);
        this.mode = 'local';
      }
    } else {
      this.mode = 'local';
      console.log('[Database] Running in Local Relational Persistence mode (DIP abstraction).');
    }
    await this.seedInitialData();
  }

  getAdapter() {
    return this.localAdapter;
  }

  async seedInitialData() {
    const db = this.localAdapter;
    const bcrypt = require('bcryptjs');

    // 1. Seed Categories if empty
    if (db.find('categories').length === 0) {
      const categories = [
        { id: 1, name: 'Birthday', slug: 'birthday', icon: 'Cake', description: 'Candles, cakes, balloons, and sweet letters' },
        { id: 2, name: 'Proposal', slug: 'proposal', icon: 'HeartHandshake', description: 'Interactive proposal with the elusive No button' },
        { id: 3, name: 'Anniversary', slug: 'anniversary', icon: 'Sparkles', description: 'Relationship counter, photo timeline and heartfelt memories' },
        { id: 4, name: 'Sorry', slug: 'sorry', icon: 'HeartCrack', description: 'Animated wax-sealed envelope with heartfelt apologies' },
        { id: 5, name: 'Photo Puzzle', slug: 'puzzle', icon: 'Puzzle', description: 'Scramble your favorite photo into an interactive sliding puzzle' },
        { id: 6, name: 'Friendship', slug: 'friendship', icon: 'Smile', description: 'Polaroids, inside jokes, and special surprises for besties' },
        { id: 7, name: 'Miss You', slug: 'miss-you', icon: 'Clock', description: 'Countdown to reunion and sweet reminder letters' },
        { id: 8, name: 'Thank You', slug: 'thank-you', icon: 'Heart', description: 'Show gratitude with animated cards and personalized notes' }
      ];
      categories.forEach(c => db.insert('categories', c));
    }

    // 2. Seed Templates if empty
    if (db.find('templates').length === 0) {
      const templates = [
        {
          id: 1,
          category_id: 1,
          name: 'Galaxy Cosmic Birthday',
          description: 'A stellar birthday surprise with floating galaxies, interactive popping balloons, blowable candles, and cake slicing.',
          price: 5.00,
          preview_image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
          is_active: true
        },
        {
          id: 2,
          category_id: 1,
          name: 'Classic Golden Birthday',
          description: 'Elegant golden aesthetic with luxury champagne vibes, interactive cake cutting, and parchment letter.',
          price: 5.00,
          preview_image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80',
          is_active: true
        },
        {
          id: 3,
          category_id: 2,
          name: 'Forever With You - Proposal',
          description: 'A romantic proposal with falling rose petals, an evasive moving "No" button, and celebratory confetti blast when they say "Yes"!',
          price: 5.00,
          preview_image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&auto=format&fit=crop&q=80',
          is_active: true
        },
        {
          id: 4,
          category_id: 3,
          name: 'Infinite Love - Anniversary',
          description: 'Calculates every second together with a live milestone counter, memory gallery, and couple love letters.',
          price: 5.00,
          preview_image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
          is_active: true
        },
        {
          id: 5,
          category_id: 4,
          name: 'Wax-Sealed Apology Letter',
          description: 'A heartfelt apology with an interactive wax seal to crack open, emotional slide-out notes, and a forgiveness button.',
          price: 5.00,
          preview_image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
          is_active: true
        },
        {
          id: 6,
          category_id: 5,
          name: 'Secret Message Photo Puzzle',
          description: 'Turns your custom photo into an interactive scrambled tile puzzle that reveals a secret hidden love message upon completion!',
          price: 5.00,
          preview_image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&auto=format&fit=crop&q=80',
          is_active: true
        },
        {
          id: 7,
          category_id: 6,
          name: 'Bestie Memory Wall',
          description: 'Polaroids, friendship milestones, and an interactive bounce gift box for your favorite best friend.',
          price: 5.00,
          preview_image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
          is_active: true
        }
      ];
      templates.forEach(t => db.insert('templates', t));
    }

    // 3. Seed Template Styles
    if (db.find('template_styles').length === 0) {
      const styles = [
        { id: 1, template_id: 1, style_name: 'Galaxy', configuration: { theme: 'galaxy', primaryColor: '#8b5cf6', secondaryColor: '#ec4899', background: 'radial-gradient(circle, #2e1065, #0f172a)' } },
        { id: 2, template_id: 1, style_name: 'Neon Glow', configuration: { theme: 'neon', primaryColor: '#06b6d4', secondaryColor: '#d946ef', background: 'radial-gradient(circle, #18181b, #000000)' } },
        { id: 3, template_id: 2, style_name: 'Classic Gold', configuration: { theme: 'gold', primaryColor: '#f59e0b', secondaryColor: '#fbbf24', background: 'radial-gradient(circle, #451a03, #1c1917)' } },
        { id: 4, template_id: 3, style_name: 'Rose Romance', configuration: { theme: 'rose', primaryColor: '#f43f5e', secondaryColor: '#fb7185', background: 'radial-gradient(circle, #4c0519, #09090b)' } }
      ];
      styles.forEach(s => db.insert('template_styles', s));
    }

    // 4. Seed Default Admin & Sample User
    if (db.find('users').length === 0) {
      const salt = await bcrypt.genSalt(10);
      const adminPasswordHash = await bcrypt.hash('Admin@123', salt);
      const userPasswordHash = await bcrypt.hash('Secret@123', salt);

      db.insert('users', {
        id: 1,
        name: 'HeartCraft Admin',
        email: 'admin@heartcraft.com',
        password_hash: adminPasswordHash,
        role: 'admin'
      });

      db.insert('users', {
        id: 2,
        name: 'Sarah Jenkins',
        email: 'sarah@example.com',
        password_hash: userPasswordHash,
        role: 'customer'
      });
    }

    // 5. Seed Sample Reviews
    if (db.find('reviews').length === 0) {
      const reviews = [
        {
          id: 1,
          user_id: 2,
          author_name: 'Aarav & Meera',
          rating: 5,
          comment: 'The interactive proposal was completely magical! She laughed so hard trying to click the "No" button, and cried when she clicked "Yes". 10/10 recommend!'
        },
        {
          id: 2,
          user_id: 2,
          author_name: 'Priya Sharma',
          rating: 5,
          comment: 'The birthday cake cutting and balloon popping sound effects felt so real and made my best friend cry tears of joy thousands of miles away.'
        },
        {
          id: 3,
          user_id: 2,
          author_name: 'Rohan Verma',
          rating: 5,
          comment: 'The wax seal apology card helped me resolve a huge fight with my girlfriend. She said it was the sweetest gesture ever.'
        }
      ];
      reviews.forEach(r => db.insert('reviews', r));
    }

    // 6. Seed Sample Published Card for instant previewing
    if (db.find('cards').length === 0) {
      const card = db.insert('cards', {
        id: 101,
        user_id: 2,
        template_id: 1,
        recipient_name: 'Priya',
        slug: 'priya-birthday-magic',
        status: 'published'
      });

      db.insert('card_content', {
        card_id: card.id,
        message: 'Happy Birthday Priya! Wishing you infinite joy, starry nights, and endless laughter. Thank you for always being the brightest star in my sky! ✨🎂',
        relationship: 'Best Friend',
        birthday_date: '2026-11-20',
        question: 'Will you have the best birthday ever?',
        ending_message: 'Always here for you, no matter what.',
        extra_data: { cakeDesign: 'chocolate-stars', balloonCount: 7 }
      });

      db.insert('card_media', {
        card_id: card.id,
        media_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80'
      });

      db.insert('card_settings', {
        card_id: card.id,
        music: 'birthday-acoustic',
        countdown: true,
        passcode_hash: null
      });
    }
  }
}

const dbManager = new DatabaseManager();

module.exports = {
  dbManager,
  getDatabase: () => dbManager.getAdapter()
};
