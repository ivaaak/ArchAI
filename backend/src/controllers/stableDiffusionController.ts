import express from 'express';
import { generateImage, imageToImage } from '../services/STDLService';
import { regenerateImageFromUrl } from '../services/controlNetService';
const stableDiffusionController = express.Router();

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


// POST /api/stableDiffusion/imageToImage/
stableDiffusionController.post('/imageToImage', async (req, res) => {
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
