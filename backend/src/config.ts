import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

export const PORT = Number(process.env.PORT) || 3000;

// Where the frontend lives - used for CORS and Stripe redirect URLs
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Local image storage. Resolved from the working directory so ts-node (src/) and the compiled build (dist/) share it.
export const UPLOADS_DIR = process.env.UPLOADS_DIR || path.resolve(process.cwd(), 'src', 'uploads');
export const UPLOADS_ROUTE = '/uploads';

fs.mkdirSync(UPLOADS_DIR, { recursive: true });

export const isCloudinaryConfigured = Boolean(
    process.env.CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
);
