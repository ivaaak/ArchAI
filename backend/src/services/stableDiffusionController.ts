import express from 'express';
import { generateImage } from './STDLService';
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

//TODO get from DB

// Export the router
export default stableDiffusionController;
