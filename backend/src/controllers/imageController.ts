import express from 'express';
import multer from 'multer';
import { ObjectId } from 'mongodb';
import { Image } from '../models/image';
import { collections } from '../database';
import { Request, Response } from 'express';
import path from 'path';

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
// Use multer.memoryStorage to store files in the server's uploads folder
const uploadToStorage = multer({ storage: storage });
// Use multer.memoryStorage to store files in memory as Buffer objects
const uploadToDB = multer({ storage: multer.memoryStorage() });

const imageController = express.Router();

// Add getById endpoint
imageController.get('/:id', async (req: Request, res: Response) => {
    console.log("Get image by ID endpoint called");
    const id = req.params.id;

    try {
        const result = await collections.images?.findOne({ _id: new ObjectId(id) });

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Image not found" });
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: "Error retrieving image", error: err.message });
    }
});

// Add getAll endpoint
imageController.get('/', async (req: Request, res: Response) => {
    console.log("Get all images endpoint called");

    try {
        const results = await collections.images?.find().toArray();

        if (results) {
            res.status(200).json(results);
        } else {
            res.status(404).json({ message: "No images found" });
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: "Error retrieving images", error: err.message });
    }
});

// Upload base64 to DB
imageController.post('/uploadToDB', uploadToDB.single('image'), async (req, res) => {
    console.log("Image upload endpoint called");
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        const imageData: Image = {
            userId: new ObjectId(req.body?.userId),
            name: req.file.originalname,
            //imageData: req.file.buffer 
            // Save the file data (Buffer) directly - very slow
        };
        if (!req.body.userId) {
            imageData.userId = new ObjectId();
        }

        const result = await collections.images?.insertOne(imageData);

        if (result) {
            res.status(201).json({ message: "Image uploaded successfully", imageId: result.insertedId });
        } else {
            res.status(500).json({ message: "Error uploading image" });
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: "Error uploading image", error: err.message });
    }
});

// Upload file to server /src/uploads
imageController.post('/', uploadToStorage.single('image'), async (req, res) => {
    console.log("Image upload endpoint called");
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        const imageData: Image = {
            userId: new ObjectId(req.body?.userId),
            name: req.file.originalname,
            imageData: req.file.path
        };
        if (!req.body.userId) { imageData.userId = new ObjectId(); }
        const result = await collections.images?.insertOne(imageData);
        if (result) {
            res.status(201).json({ message: "Image uploaded successfully", imageId: result.insertedId });
        } else {
            res.status(500).json({ message: "Error uploading image" });
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: "Error uploading image", error: err.message });
    }
});

// Export the router
export default imageController;
