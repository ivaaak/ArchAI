import express from 'express';
import { generateImage } from './STDLService';
import { regenerateImageFromUrl } from './controlNetService';
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

//export async function regenerateImageFromUrl(input: {image: string, prompt: string}) {

//TODO get from DB

// Export the router
export default stableDiffusionController;
