// localStorage can be unavailable (private mode, blocked storage) - never let that break the app.
export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export interface Preferences {
  negativePrompt: string;
  imageCount: number;
  customStyles: string[];
}

const PREFERENCES_KEY = 'preferences';
const SAVED_PROMPTS_KEY = 'savedPrompts';

export const DEFAULT_PREFERENCES: Preferences = {
  negativePrompt: '',
  imageCount: 1,
  customStyles: [],
};

export function getPreferences(): Preferences {
  return { ...DEFAULT_PREFERENCES, ...readJson<Partial<Preferences>>(PREFERENCES_KEY, {}) };
}

export function setPreferences(preferences: Preferences) {
  writeJson(PREFERENCES_KEY, preferences);
}

export function getSavedPrompts(): string[] {
  return readJson<string[]>(SAVED_PROMPTS_KEY, []);
}

export function setSavedPrompts(prompts: string[]) {
  writeJson(SAVED_PROMPTS_KEY, prompts);
}

export function savePrompt(prompt: string) {
  const trimmed = prompt.trim();
  if (!trimmed) return;
  const prompts = getSavedPrompts().filter((p) => p !== trimmed);
  setSavedPrompts([trimmed, ...prompts].slice(0, 50));
}
