/** Browser-side helpers for uploading images straight to Cloudinary with a server-signed request. */

/** Downscale big images (max 2400px, WebP) before upload. Returns the original file if anything fails. */
export async function shrinkImage(file: File): Promise<File> {
  const MAX_BYTES = 1.5 * 1024 * 1024;
  const MAX_EDGE = 2400;
  if (!file.type.startsWith('image/') || file.size <= MAX_BYTES) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.86));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
  } catch {
    return file;
  }
}

/** Uploads one image and returns its Cloudinary URL. Throws an Error with a readable message on failure. */
export async function uploadImage(original: File): Promise<string> {
  const sigRes = await fetch('/api/admin/upload', { method: 'POST' });
  const sigJson = await sigRes.json();
  if (!sigRes.ok || !sigJson.success) {
    throw new Error(sigJson.error ?? 'Failed to prepare image upload');
  }
  const { signature, timestamp, cloudName, apiKey, folder } = sigJson.data;

  const file = await shrinkImage(original);
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);
  formData.append('folder', folder);

  let res: Response;
  try {
    res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: formData });
  } catch {
    throw new Error('Connection to the image server failed. Please try again.');
  }
  const json = await res.json();
  if (!res.ok || !json.secure_url) {
    throw new Error(json.error?.message ?? 'Upload was rejected');
  }
  return json.secure_url as string;
}
