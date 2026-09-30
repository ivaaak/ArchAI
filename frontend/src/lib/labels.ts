import { ImageMode, StoredImage } from '../types';

export const MODE_LABELS: Record<ImageMode, string> = {
  'text-to-image': 'Text to Image',
  'image-to-image': 'Image to Image',
  'sketch-to-image': 'Sketch to Image',
  'inpaint': 'In-Painting',
  'upload': 'Upload',
};

export function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export const COLLECTION_ROUTES = [
  { route: '/browse', label: 'Generated Images' },
  { route: '/examples', label: 'Example Prompts' },
];

// Human readable prompt: the user's own text if recorded, otherwise the model prompt without emphasis brackets
export function displayPrompt(image: StoredImage) {
  const text = image.parameters?.text;
  if (typeof text === 'string' && text.trim()) return text.trim();
  return (image.prompt || image.name || '').replace(/[()]/g, '').trim();
}
