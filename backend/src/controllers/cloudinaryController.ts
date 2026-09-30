import express from "express";
import { collections } from '../database';
import { isCloudinaryConfigured } from '../config';
import cloudinary from '../services/cloudinaryConfig';
import { bufferToDataUri } from '../services/storageService';
import { HttpError, asyncHandler, requireCollection } from '../utils/http';
import { imageUpload } from '../utils/upload';

const cloudinaryController = express.Router();

cloudinaryController.use((_req, _res, next) => {
  if (!isCloudinaryConfigured) {
    return next(new HttpError(503, 'Cloudinary is not configured on the server'));
  }
  next();
});

async function uploadFile(file: Express.Multer.File) {
  return cloudinary.uploader.upload(bufferToDataUri(file.buffer, file.mimetype), {
    folder: 'uploads',
    resource_type: 'image',
  });
}

// POST /api/cloudinary/upload - multipart: image
cloudinaryController.post("/upload", imageUpload.single("image"), asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new HttpError(400, 'No file was uploaded.');
  }
  const result = await uploadFile(req.file);
  res.json({ imageUrl: result.secure_url, publicId: result.public_id });
}));

// POST /api/cloudinary/uploadToCloudAndDB - multipart: image, ownerId?, description?
cloudinaryController.post('/uploadToCloudAndDB', imageUpload.single('image'), asyncHandler(async (req, res) => {
  const images = requireCollection(collections.images);
  if (!req.file) {
    throw new HttpError(400, 'No file was uploaded.');
  }
  const result = await uploadFile(req.file);
  const insertResult = await images.insertOne({
    ownerId: req.body.ownerId || undefined,
    name: req.file.originalname,
    imageUrl: result.secure_url,
    mode: 'upload',
    prompt: req.body.description || undefined,
    createdAt: new Date(),
  });

  res.status(200).json({
    message: 'Image uploaded successfully',
    imageUrl: result.secure_url,
    imageId: insertResult.insertedId,
  });
}));

// GET /api/cloudinary/get-image-url/:id - retrieve an image's URL by its Cloudinary public id
cloudinaryController.get('/get-image-url/:id', (req, res) => {
  const imageUrl = cloudinary.url(req.params.id, {
    format: 'jpg',
    quality: 'auto',
    secure: true,
  });
  res.status(200).json({ imageUrl });
});

export default cloudinaryController;
