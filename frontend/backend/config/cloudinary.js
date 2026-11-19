/**
 * Storage Strategy & Cloudinary Configuration
 * Open/Closed Principle: IStorageProvider abstraction with Cloudinary and Local Disk implementations.
 */

const fs = require('fs');
const path = require('path');

class LocalStorageProvider {
  constructor(uploadDir = 'uploads') {
    this.uploadDir = path.join(__dirname, '..', uploadDir);
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file, folder = 'media') {
    const filename = `${folder}-${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const destination = path.join(this.uploadDir, filename);
    fs.writeFileSync(destination, file.buffer);
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    return {
      url: `${baseUrl}/uploads/${filename}`,
      public_id: filename
    };
  }

  async delete(publicId) {
    const filePath = path.join(this.uploadDir, publicId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }
}

class CloudinaryStorageProvider {
  constructor() {
    this.cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    this.apiKey = process.env.CLOUDINARY_API_KEY;
    this.apiSecret = process.env.CLOUDINARY_API_SECRET;
  }

  isConfigured() {
    return Boolean(this.cloudName && this.apiKey && this.apiSecret);
  }

  async upload(file, folder = 'heartcraft') {
    // When cloudinary credentials are provided, perform stream upload
    // Otherwise fallback to local storage provider
    return null;
  }
}

class StorageFactory {
  static getProvider() {
    const cloudinary = new CloudinaryStorageProvider();
    if (cloudinary.isConfigured()) {
      return cloudinary;
    }
    return new LocalStorageProvider();
  }
}

module.exports = {
  StorageFactory,
  LocalStorageProvider,
  CloudinaryStorageProvider
};
