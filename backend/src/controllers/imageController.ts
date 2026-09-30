import express from 'express';
import { Filter } from 'mongodb';
import { Image, ImageMode } from '../models/image';
import { collections } from '../database';
import { persistImage, removeLocalImage } from '../services/storageService';
import { HttpError, asyncHandler, parseObjectId, requireCollection } from '../utils/http';
import { imageUpload } from '../utils/upload';

const imageController = express.Router();

const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/image?ownerId=&mode=&q=&limit=&skip=
imageController.get('/', asyncHandler(async (req, res) => {
    const images = requireCollection(collections.images);
    const { ownerId, mode, q } = req.query;
    const limit = Math.min(Number(req.query.limit) || 60, 200);
    const skip = Math.max(Number(req.query.skip) || 0, 0);

    const filter: Filter<Image> = {};
    if (typeof ownerId === 'string' && ownerId) filter.ownerId = ownerId;
    if (typeof mode === 'string' && mode) filter.mode = mode as ImageMode;
    if (typeof q === 'string' && q.trim()) filter.prompt = { $regex: escapeRegex(q.trim()), $options: 'i' };

    const [results, total] = await Promise.all([
        // _id embeds the creation time, so this also orders legacy records without createdAt
        images.find(filter).sort({ _id: -1 }).skip(skip).limit(limit).toArray(),
        images.countDocuments(filter),
    ]);
    res.status(200).json({ images: results, total });
}));

// GET /api/image/:id
imageController.get('/:id', asyncHandler(async (req, res) => {
    const images = requireCollection(collections.images);
    const result = await images.findOne({ _id: parseObjectId(req.params.id) });
    if (!result) {
        throw new HttpError(404, 'Image not found');
    }
    res.status(200).json(result);
}));

// POST /api/image (multipart: image, ownerId?, description?)
imageController.post('/', imageUpload.single('image'), asyncHandler(async (req, res) => {
    const images = requireCollection(collections.images);
    if (!req.file) {
        throw new HttpError(400, 'No file uploaded');
    }

    const imageUrl = await persistImage({ buffer: req.file.buffer, mimetype: req.file.mimetype }, 'upload');
    const image: Image = {
        ownerId: req.body.ownerId || undefined,
        name: req.file.originalname,
        imageUrl,
        mode: 'upload',
        prompt: req.body.description || undefined,
        createdAt: new Date(),
    };
    const result = await images.insertOne(image);
    res.status(201).json({
        message: 'Image uploaded successfully',
        imageId: result.insertedId,
        image: { ...image, _id: result.insertedId },
    });
}));

// DELETE /api/image/:id?ownerId=
imageController.delete('/:id', asyncHandler(async (req, res) => {
    const images = requireCollection(collections.images);
    const _id = parseObjectId(req.params.id);
    const image = await images.findOne({ _id });
    if (!image) {
        throw new HttpError(404, 'Image not found');
    }
    if (image.ownerId && image.ownerId !== req.query.ownerId) {
        throw new HttpError(403, 'You can only delete your own images');
    }

    await images.deleteOne({ _id });
    await removeLocalImage(image.imageUrl).catch((error) => console.error('Could not remove image file:', error));
    res.status(204).send();
}));

export default imageController;
