import express from 'express';
import { generateImage, imageToImage } from '../services/STDLService';
import { regenerateImageFromUrl } from '../services/controlNetService';
const stableDiffusionController = express.Router();
const multer = require('multer');

// Configure multer storage
const storage = multer.memoryStorage(); // Use memory storage for simplicity
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024, // Increase the file size limit to 50MB
        fieldNameSize: 256, // Increase the field name size limit
        fieldSize: 512, // Increase the field value size limit
        fields: 10 // Increase the number of fields allowed
    }
});
type CustomFilesType = {
    [fieldname: string]: Express.Multer.File[];
};


// POST /api/stableDiffusion/
stableDiffusionController.post('/', async (req, res) => {
    const prompt = req.body.prompt;
    console.log("prompt", prompt);
    const negativePrompt = req.body.negativePrompt
    console.log("stableDiffusionController / POST /api/stableDiffusion/ called");
    try {
        const result = await generateImage(prompt, negativePrompt, 1);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving image');
    }
});


// POST /api/stableDiffusion/imageUrlToImage/
stableDiffusionController.post('/imageUrlToImage', async (req, res) => {
    const { inputImageUrl, prompt, outputImageCount = 1 } = req.body;

    console.log("Received request:", { inputImageUrl, prompt, outputImageCount });

    try {
        const result = await imageToImage(inputImageUrl, prompt, outputImageCount);
        res.status(200).json(result); // Send the result back to the client
    } catch (error) {
        console.error("Error processing image generation request:", error);
        res.status(500).send('Error generating image');
    }
});


// POST /api/stableDiffusion/imageToImage/
stableDiffusionController.post(
    '/imageToImage',
    upload.fields([
        { name: 'inputImageUrl', maxCount: 1 },
        { name: 'prompt', maxCount: 1 }
    ]),
    async (req, res) => {
        // Access the uploaded image and prompt from req.files and req.body
        const files = req.files as CustomFilesType | undefined;

        if (!files || !files['inputImageUrl']) {
            return res.status(400).send('Missing inputImageUrl field in the request.');
        }

        // Now safely access the uploaded image and prompt
        const inputImage = files['inputImageUrl'][0]; const prompt = req.body.prompt;
        const outputImageCount = parseInt(req.body.outputImageCount, 10) || 1;

        console.log("Received request:", { inputImage, prompt, outputImageCount });

        try {
            // Assuming imageToImage function expects a buffer or stream for the image
            const base64Image = inputImage.buffer.toString('base64');
            const result = await imageToImage(base64Image, prompt, outputImageCount);
            res.status(200).json(result); // Send the result back to the client
        } catch (error) {
            console.error("Error processing image generation request:", error);
            res.status(500).send('Error generating image');
        }
    });


// POST /api/stableDiffusion/controlNet/
stableDiffusionController.post('/controlNet', async (req, res) => {
    const input = { image: req.body.image, prompt: req.body.prompt };
    console.log("prompt", prompt);
    const negativePrompt = req.body.negativePrompt
    console.log("stableDiffusionController / POST /api/stableDiffusion/ called");
    try {
        const result = await regenerateImageFromUrl(input);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving image');
    }
});


// Export the router
export default stableDiffusionController;
