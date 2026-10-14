/**
 * Client-side image compression and resizing using HTML Canvas.
 * Produces lightweight WebP or PNG data URLs for local storage.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  targetWidth?: number;
  targetHeight?: number;
  quality?: number;
  format?: 'image/webp' | 'image/png' | 'image/jpeg';
  crop?: 'cover' | 'contain' | 'none';
}

export async function compressImage(
  file: File | Blob,
  options: CompressOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        const {
          maxWidth,
          maxHeight,
          targetWidth,
          targetHeight,
          quality = 0.65,
          format = 'image/webp',
          crop = 'none',
        } = options;

        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (targetWidth && targetHeight && crop === 'cover') {
          // Exact fixed crop (e.g. 9:16 TikTok 360x640)
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const targetRatio = targetWidth / targetHeight;
          const imgRatio = width / height;

          let renderW = targetWidth;
          let renderH = targetHeight;
          let offsetX = 0;
          let offsetY = 0;

          if (imgRatio > targetRatio) {
            renderH = targetHeight;
            renderW = width * (targetHeight / height);
            offsetX = (targetWidth - renderW) / 2;
          } else {
            renderW = targetWidth;
            renderH = height * (targetWidth / width);
            offsetY = (targetHeight - renderH) / 2;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
        } else {
          // Proportional scaling within maxWidth / maxHeight bounds
          if (maxWidth && width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          if (maxHeight && height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
        }

        try {
          const dataUrl = canvas.toDataURL(format, quality);
          resolve(dataUrl);
        } catch {
          // Fallback to jpeg or png if format not supported
          try {
            resolve(canvas.toDataURL('image/jpeg', quality));
          } catch (err) {
            reject(err);
          }
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
