import axios from 'axios';
import { API_URL } from '../config';
import { GenerationSettings, StoredImage } from '../types';
import { buildPrompt } from './prompt';

export const apiClient = axios.create({
  baseURL: API_URL,
});

export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Could not reach the server. Is the backend running?';
    }
    const data = error.response.data;
    if (data && typeof data === 'object' && 'error' in data) return String(data.error);
    if (data && typeof data === 'object' && 'message' in data) return String(data.message);
    if (typeof data === 'string' && data.length < 200) return data;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export type GenerationEndpoint = '/stableDiffusion/' | '/stableDiffusion/imageToImage' | '/stableDiffusion/sketchToImage' | '/stableDiffusion/inpaint';

interface GenerationExtras {
  ownerId?: string;
  image?: Blob;
  mask?: Blob;
  promptStrength?: number;
  includeSize?: boolean;
}

export async function requestGeneration(
  endpoint: GenerationEndpoint,
  settings: GenerationSettings,
  { ownerId, image, mask, promptStrength, includeSize = false }: GenerationExtras = {}
): Promise<StoredImage[]> {
  const fields: Record<string, string | number | undefined> = {
    prompt: buildPrompt(settings),
    negativePrompt: settings.negativePrompt.trim() || undefined,
    numOutputs: settings.options.count,
    size: includeSize ? settings.options.size : undefined,
    promptStrength,
    ownerId,
    parameters: JSON.stringify({
      text: settings.text.trim(),
      styles: settings.styles,
      ...Object.fromEntries(Object.entries(settings.parameters).filter(([, value]) => value)),
    }),
  };

  let body: FormData | Record<string, unknown>;
  if (image) {
    const form = new FormData();
    form.append('image', image, 'image.png');
    if (mask) form.append('mask', mask, 'mask.png');
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) form.append(key, String(value));
    });
    body = form;
  } else {
    body = Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined));
  }

  const response = await apiClient.post<{ images: StoredImage[] }>(endpoint, body);
  return response.data.images;
}
