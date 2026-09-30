import axios from 'axios';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { UPLOADS_DIR, UPLOADS_ROUTE, isCloudinaryConfigured } from '../config';
import cloudinary from './cloudinaryConfig';

export type ImageSource =
    | { url: string }
    | { buffer: Buffer; mimetype: string };

const EXTENSIONS: Record<string, string> = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/webp': '.webp',
    'image/gif': '.gif',
};

export function bufferToDataUri(buffer: Buffer, mimetype: string) {
    return `data:${mimetype};base64,${buffer.toString('base64')}`;
}

async function loadSource(source: ImageSource): Promise<{ buffer: Buffer; mimetype: string }> {
    if ('buffer' in source) {
        return source;
    }
    const response = await axios.get<ArrayBuffer>(source.url, { responseType: 'arraybuffer', timeout: 60_000 });
    const mimetype = String(response.headers['content-type'] || 'image/png').split(';')[0];
    return { buffer: Buffer.from(response.data), mimetype };
}

async function saveLocally(source: ImageSource, prefix: string): Promise<string> {
    const { buffer, mimetype } = await loadSource(source);
    const fileName = `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${EXTENSIONS[mimetype] || '.png'}`;
    await fs.writeFile(path.join(UPLOADS_DIR, fileName), buffer);
    // Always a forward-slash URL path, regardless of the host OS
    return `${UPLOADS_ROUTE}/${fileName}`;
}

async function saveToCloudinary(source: ImageSource): Promise<string> {
    const file = 'url' in source ? source.url : bufferToDataUri(source.buffer, source.mimetype);
    const result = await cloudinary.uploader.upload(file, { folder: 'archai', resource_type: 'image' });
    return result.secure_url;
}

/**
 * Stores an image permanently and returns the URL to reference it by.
 * Uses Cloudinary when configured, otherwise the server's uploads folder.
 * Replicate output URLs expire after about an hour, so generated images must go through here.
 */
export async function persistImage(source: ImageSource, prefix = 'image'): Promise<string> {
    if (isCloudinaryConfigured) {
        try {
            return await saveToCloudinary(source);
        } catch (error) {
            console.error('Cloudinary upload failed, falling back to local storage:', error);
        }
    }
    return saveLocally(source, prefix);
}

// Deletes a locally stored image. Remote (Cloudinary) images are left alone.
export async function removeLocalImage(imageUrl?: string) {
    if (!imageUrl?.startsWith(`${UPLOADS_ROUTE}/`)) {
        return;
    }
    const fileName = path.basename(imageUrl);
    await fs.rm(path.join(UPLOADS_DIR, fileName), { force: true });
}
