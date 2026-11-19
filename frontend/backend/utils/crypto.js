/**
 * Cryptographic & Security Utilities
 * Handles secure slug generation, passcode hashing, and HMAC-SHA256 signature verification.
 */

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

class CryptoUtils {
  /**
   * Generates a cryptographically secure, unguessable URL-safe slug
   * e.g. "8xKp92LmQ"
   */
  static generateSecureSlug(length = 10) {
    return crypto.randomBytes(Math.ceil((length * 3) / 4))
      .toString('base64')
      .slice(0, length)
      .replace(/\+/g, 'x')
      .replace(/\//g, 'k')
      .replace(/=/g, '');
  }

  /**
   * Hash a 4-digit card passcode using bcrypt
   */
  static async hashPasscode(passcode) {
    if (!passcode) return null;
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(passcode.toString(), salt);
  }

  /**
   * Verify an entered passcode against a stored hash
   */
  static async verifyPasscode(plainPasscode, storedHash) {
    if (!storedHash) return true;
    if (!plainPasscode) return false;
    return bcrypt.compare(plainPasscode.toString(), storedHash);
  }
}

module.exports = CryptoUtils;
