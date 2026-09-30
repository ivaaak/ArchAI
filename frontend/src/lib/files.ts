import { resolveImageUrl } from '../config';

export function readFileAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load the image'));
    img.src = src;
  });
}

// Fetches a stored image as a File so it can be used as input for another generation
export async function urlToFile(url: string, name = 'image.png'): Promise<File> {
  const response = await fetch(resolveImageUrl(url));
  if (!response.ok) throw new Error('Could not load the image');
  const blob = await response.blob();
  return new File([blob], name, { type: blob.type || 'image/png' });
}

// The download attribute is ignored for cross-origin URLs, so download via a blob when possible
export async function downloadImage(url: string, fileName = 'archai-image.png') {
  const src = resolveImageUrl(url);
  try {
    const response = await fetch(src);
    if (!response.ok) throw new Error();
    const blobUrl = URL.createObjectURL(await response.blob());
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a); // Required for Firefox
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  } catch {
    window.open(src, '_blank', 'noopener');
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
