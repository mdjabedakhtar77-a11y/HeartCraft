/**
 * Image Utilities & Resilient Loading
 * Ensures photos display reliably across all devices, mobile networks, and cloud deployments.
 */

export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80';

export function getSafeImageUrl(url) {
  if (!url || typeof url !== 'string') {
    return DEFAULT_FALLBACK_IMAGE;
  }

  // Self-contained Base64 Data URL (immune to server reboots and network blocks)
  if (url.startsWith('data:image/')) {
    return url;
  }

  // Rewrite legacy or local server URLs to live cloud backend
  if (url.includes('localhost:5000') || url.includes('127.0.0.1:5000')) {
    return url.replace(/^http:\/\/(localhost|127\.0\.0\.1):5000/, 'https://heartcraft-backend01.onrender.com');
  }

  // Relative upload paths
  if (url.startsWith('/uploads/')) {
    return `https://heartcraft-backend01.onrender.com${url}`;
  }

  return url;
}

/**
 * Compresses an image file on the client using HTML5 Canvas
 * Produces a lightweight, portable Base64 Data URL (<100KB)
 */
export function compressImageToDataUrl(file, maxWidth = 1000, quality = 0.8) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        // Fallback to raw data url if canvas fails
        resolve(e.target.result);
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      resolve(DEFAULT_FALLBACK_IMAGE);
    };

    reader.readAsDataURL(file);
  });
}
