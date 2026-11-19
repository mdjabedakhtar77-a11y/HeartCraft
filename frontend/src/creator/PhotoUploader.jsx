import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import api from '../services/api';
import { compressImageToDataUrl, getSafeImageUrl, DEFAULT_FALLBACK_IMAGE } from '../utils/imageUtils';

export default function PhotoUploader({ media = [], onChangeMedia, maxPhotos = 4 }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    setError(null);

    try {
      const uploadedMedia = [...media];

      for (const file of files) {
        if (uploadedMedia.length >= maxPhotos) break;

        // 1. Immediately create compressed Base64 Data URL (immune to server reboots/network loss)
        const base64Url = await compressImageToDataUrl(file);

        // 2. Also attempt upload to backend
        let finalUrl = base64Url;
        try {
          const res = await api.uploadImage(file);
          if (res.success && res.url) {
            // If backend returned a valid public URL that is not localhost, prefer it; otherwise use base64
            if (!res.url.includes('localhost:5000')) {
              finalUrl = res.url;
            }
          }
        } catch (uploadErr) {
          console.warn('Backend file upload had issue, using self-contained base64 image:', uploadErr);
        }

        uploadedMedia.push({
          media_type: 'image',
          media_url: finalUrl
        });
      }

      onChangeMedia(uploadedMedia);
    } catch (err) {
      setError(err.message || 'Failed to upload photo.');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index) => {
    const updated = media.filter((_, idx) => idx !== index);
    onChangeMedia(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-pink-400" />
          Upload Special Photos ({media.length}/{maxPhotos})
        </label>
        <p className="text-xs text-slate-400">
          Add personal photos to display inside the memory gallery, polaroids, or puzzle.
        </p>
      </div>

      {/* Grid of uploaded images */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {media.map((item, idx) => (
          <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-square border border-purple-800/40 bg-purple-950/40">
            <img
              src={getSafeImageUrl(item.media_url)}
              alt={`Upload ${idx + 1}`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
              }}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removePhoto(idx)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-rose-600 text-white transition-colors"
              title="Remove photo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {/* Upload Button Box */}
        {media.length < maxPhotos && (
          <label className="border-2 border-dashed border-purple-800/60 hover:border-pink-500/80 rounded-2xl flex flex-col items-center justify-center p-4 cursor-pointer transition-colors bg-white/5 hover:bg-white/10 aspect-square text-center">
            {uploading ? (
              <Loader2 className="w-6 h-6 text-pink-400 animate-spin" />
            ) : (
              <>
                <UploadCloud className="w-6 h-6 text-pink-400 mb-1" />
                <span className="text-xs font-semibold text-slate-200">Upload Photo</span>
                <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>

      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}
