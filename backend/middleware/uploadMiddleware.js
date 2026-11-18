/**
 * Upload Middleware
 * Handles multipart/form-data uploads for images and audio files using Multer.
 */

const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedImageMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedAudioMimes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'];

  if (allowedImageMimes.includes(file.mimetype) || allowedAudioMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: JPEG, PNG, GIF, WEBP, MP3, WAV.`), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter
});

module.exports = upload;
