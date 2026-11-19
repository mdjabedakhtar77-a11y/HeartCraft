/**
 * Upload Routes
 */

const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../middleware/uploadMiddleware');

router.post('/image', upload.single('image'), uploadController.uploadImage);
router.post('/audio', upload.single('audio'), uploadController.uploadAudio);

module.exports = router;
