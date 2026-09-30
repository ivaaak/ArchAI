// In development the Vite dev server proxies /api and /uploads to the backend (see vite.config.ts).
// Set VITE_API_URL (e.g. https://api.example.com/api) when the backend lives on another host.
export const API_URL = import.meta.env.VITE_API_URL || '/api';

const API_ORIGIN = /^https?:\/\//.test(API_URL) ? new URL(API_URL).origin : '';

// Public identifiers of the Auth0 SPA application (not secrets)
export const AUTH0_DOMAIN =
  import.meta.env.VITE_AUTH0_DOMAIN || import.meta.env.REACT_APP_AUTH0_DOMAIN || 'dev-25vz0fnjmni3ejjp.us.auth0.com';
export const AUTH0_CLIENT_ID =
  import.meta.env.VITE_AUTH0_CLIENT_ID || import.meta.env.REACT_APP_AUTH0_CLIENT_ID || 'XmJ69rQmUTsn7dagLO2YfhY9hMnvl7rh';

/**
 * Turns a stored image reference into a URL the browser can load.
 * Handles absolute URLs (Cloudinary/Replicate), server paths (/uploads/x.png)
 * and legacy records that stored a file path (src\uploads\x.png).
 */
export function resolveImageUrl(image: { imageUrl?: string; imageData?: string } | string | undefined): string {
  const ref = typeof image === 'string' ? image : image?.imageUrl || image?.imageData;
  if (!ref) return '';
  if (/^(https?:|data:|blob:)/.test(ref)) return ref;

  let path = ref.replace(/\\/g, '/');
  path = path.replace(/^\/?src\/uploads\//, '/uploads/');
  if (!path.startsWith('/')) path = `/${path}`;
  return `${API_ORIGIN}${path}`;
}
