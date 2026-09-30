export type ImageMode = 'text-to-image' | 'image-to-image' | 'sketch-to-image' | 'inpaint' | 'upload';

export interface StoredImage {
  _id?: string;
  ownerId?: string;
  name?: string;
  imageUrl?: string;
  // Legacy server file path
  imageData?: string;
  mode?: ImageMode;
  prompt?: string;
  negativePrompt?: string;
  parameters?: Record<string, unknown>;
  sourceImageUrl?: string;
  createdAt?: string;
}

export interface PromptParameters {
  sketchType: string;
  color: string;
  artStyle: string;
  perspective: string;
  dimension: string;
  structure: string;
  location: string;
}

export interface ImageOptionsValue {
  count: number;
  size: string;
}

// Everything the user can set on the generation form
export interface GenerationSettings {
  text: string;
  styles: string[];
  parameters: PromptParameters;
  options: ImageOptionsValue;
  negativePrompt: string;
}
