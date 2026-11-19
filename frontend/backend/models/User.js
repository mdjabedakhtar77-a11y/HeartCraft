/**
 * User Model & Repository
 * Encapsulates data access and persistence for User accounts.
 */

const { getDatabase } = require('../config/database');

class User {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password_hash = data.password_hash;
    this.role = data.role || 'customer';
    this.created_at = data.created_at;
  }

  static findById(id) {
    const db = getDatabase();
    const row = db.findById('users', id);
    return row ? new User(row) : null;
  }

  static findByEmail(email) {
    const db = getDatabase();
    const normalized = (email || '').toLowerCase().trim();
    const row = db.findOne('users', u => (u.email || '').toLowerCase() === normalized);
    return row ? new User(row) : null;
  }

  static create(userData) {
    const db = getDatabase();
    const record = db.insert('users', {
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password_hash: userData.password_hash,
      role: userData.role || 'customer'
    });
    return new User(record);
  }

  static getAllCustomers() {
    const db = getDatabase();
    return db.find('users', u => u.role === 'customer').map(u => {
      const sanitized = { ...u };
      delete sanitized.password_hash;
      return sanitized;
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      created_at: this.created_at
    };
  }
}

module.exports = User;
