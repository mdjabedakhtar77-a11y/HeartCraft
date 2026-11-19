/**
 * QR Code Generation Service
 */

const QRCode = require('qrcode');

class QrService {
  /**
   * Generates a Data URL (base64 image) for any card URL
   */
  static async generateQrDataUrl(text) {
    try {
      const dataUrl = await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        color: {
          dark: '#241242',
          light: '#ffffff'
        }
      });
      return dataUrl;
    } catch (err) {
      console.error('[QrService] QR Generation failed:', err);
      throw new Error('Failed to generate QR code.');
    }
  }

  /**
   * Generates raw SVG string for crisp vector display
   */
  static async generateQrSvg(text) {
    try {
      const svg = await QRCode.toString(text, {
        type: 'svg',
        color: {
          dark: '#241242',
          light: '#ffffff'
        }
      });
      return svg;
    } catch (err) {
      console.error('[QrService] SVG QR Generation failed:', err);
      throw new Error('Failed to generate QR SVG.');
    }
  }
}

module.exports = QrService;
