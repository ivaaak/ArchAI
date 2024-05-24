import express from "express";
import multer from "multer";
import axios from 'axios';
import { ObjectId } from 'mongodb';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });


const cloudinaryController = express.Router();
cloudinaryController.use('/uploads', express.static('uploads'));

cloudinaryController.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file was uploaded.' });
  }
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'uploads'
    });

    // Call the imageController.post('/') endpoint
    const imageUploadResponse = await axios.post('http://localhost:3000/api/image/', {
      userId: new ObjectId(),
      originalName: req.file.originalname,
      filePath: req.file.path
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Handle the response from the imageController.post('/')
    if (imageUploadResponse.data.message === "Image uploaded successfully") {
      res.status(200).json({
        message: 'Image uploaded successfully',
        imageUrl: result.secure_url,
        imageId: imageUploadResponse.data.imageId
      });
    } else {
      res.status(500).json({
        message: 'Error uploading image',
        error: imageUploadResponse.data.error
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during the upload.' });
  }
});

// Endpoint to retrieve an image's URL by its ID
cloudinaryController.get('/get-image-url/:id', async (req, res) => {
  try {
    const cloudinaryPublicId = req.params.id;
    if (!cloudinaryPublicId) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Retrieve the image URL from Cloudinary
    const imageUrl = await cloudinary.url(cloudinaryPublicId, {
      format: 'jpg',
      quality: 'auto',
    });

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the image URL' });
  }
});

export default cloudinaryController;
