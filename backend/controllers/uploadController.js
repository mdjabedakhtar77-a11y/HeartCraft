/**
 * Upload Controller
 * Open/Closed Principle: delegating upload handling to StorageFactory.
 */

const { StorageFactory } = require('../config/cloudinary');

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    const storage = StorageFactory.getProvider();
    const result = await storage.upload(req.file, 'images');

    return res.json({
      success: true,
      url: result.url,
      dataUrl: result.dataUrl,
      public_id: result.public_id
    });
  } catch (err) {
    next(err);
  }
};

exports.uploadAudio = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No audio file uploaded.' });
    }

    const storage = StorageFactory.getProvider();
    const result = await storage.upload(req.file, 'audio');

    return res.json({
      success: true,
      url: result.url,
      dataUrl: result.dataUrl,
      public_id: result.public_id
    });
  } catch (err) {
    next(err);
  }
};
