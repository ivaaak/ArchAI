import multer from 'multer';
import { HttpError } from './http';

// Files are kept in memory and handed to the storage service / Replicate as buffers.
export const imageUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024,
        fieldSize: 20 * 1024 * 1024, // prompts and data-URI masks can be long
        fields: 20,
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new HttpError(400, 'Only image files are allowed'));
        }
    },
});
