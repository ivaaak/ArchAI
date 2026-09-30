import { GenerationSettings, PromptParameters } from '../types';
import { getPreferences } from './storage';

export const EMPTY_PARAMETERS: PromptParameters = {
  sketchType: '',
  color: '',
  artStyle: '',
  perspective: '',
  dimension: '',
  structure: '',
  location: '',
};

// Parameters that define the image get double emphasis, the rest single emphasis
const STRONG: (keyof PromptParameters)[] = ['sketchType', 'artStyle', 'perspective', 'structure'];
const WEAK: (keyof PromptParameters)[] = ['dimension', 'location', 'color'];

export function combinePromptParameters(parameters: PromptParameters): string {
  const strong = STRONG.map((key) => parameters[key].trim()).filter(Boolean).map((value) => `((${value}))`);
  const weak = WEAK.map((key) => parameters[key].trim()).filter(Boolean).map((value) => `(${value})`);
  return [...strong, ...weak].join(', ');
}

// The final prompt sent to the model: parameters, the user's description, then style keywords
export function buildPrompt(settings: Pick<GenerationSettings, 'text' | 'styles' | 'parameters'>): string {
  const text = settings.text.trim();
  return [
    combinePromptParameters(settings.parameters),
    text && `((${text}))`,
    settings.styles.join(', '),
  ].filter(Boolean).join(', ');
}

export function hasPromptContent(settings: Pick<GenerationSettings, 'text' | 'styles' | 'parameters'>) {
  return buildPrompt(settings).length > 0;
}

export function createDefaultSettings(text = ''): GenerationSettings {
  const preferences = getPreferences();
  return {
    text,
    styles: [],
    parameters: { ...EMPTY_PARAMETERS },
    options: { count: preferences.imageCount, size: '1024x1024' },
    negativePrompt: preferences.negativePrompt,
  };
}
