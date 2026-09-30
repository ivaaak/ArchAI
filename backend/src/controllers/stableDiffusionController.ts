import express, { Request } from 'express';
import { GenerationOptions, generateImage, imageToImage, inpaintImage } from '../services/STDLService';
import { regenerateImageFromUrl, scribbleToImage } from '../services/controlNetService';
import { bufferToDataUri, persistImage } from '../services/storageService';
import { collections } from '../database';
import { Image, ImageMode } from '../models/image';
import { HttpError, asyncHandler } from '../utils/http';
import { imageUpload } from '../utils/upload';

const stableDiffusionController = express.Router();

// SDXL works best at these sizes (~1 megapixel, multiples of 64)
const ALLOWED_SIZES = new Set(['1024x1024', '1152x896', '896x1152', '1216x832', '832x1216', '1344x768', '768x1344']);

const toNumber = (value: unknown) => {
    const n = Number(value);
    return value === undefined || value === '' || Number.isNaN(n) ? undefined : n;
};

// Reads generation options from a JSON or multipart body (multipart fields are strings)
function parseOptions(body: Record<string, unknown>): GenerationOptions {
    const prompt = String(body.prompt ?? '').trim();
    if (!prompt) {
        throw new HttpError(400, 'A prompt is required');
    }

    const numOutputs = toNumber(body.numOutputs ?? body.outputImageCount) ?? 1;
    if (!Number.isInteger(numOutputs) || numOutputs < 1 || numOutputs > 4) {
        throw new HttpError(400, 'numOutputs must be between 1 and 4');
    }

    const options: GenerationOptions = {
        prompt,
        negativePrompt: body.negativePrompt ? String(body.negativePrompt) : undefined,
        numOutputs,
        seed: toNumber(body.seed),
    };

    if (body.size) {
        const size = String(body.size);
        if (!ALLOWED_SIZES.has(size)) {
            throw new HttpError(400, `Unsupported size ${size}`);
        }
        [options.width, options.height] = size.split('x').map(Number);
    }

    const promptStrength = toNumber(body.promptStrength);
    if (promptStrength !== undefined) {
        if (promptStrength <= 0 || promptStrength > 1) {
            throw new HttpError(400, 'promptStrength must be between 0 and 1');
        }
        options.promptStrength = promptStrength;
    }
    return options;
}

function parseParameters(value: unknown): Record<string, unknown> | undefined {
    if (!value) return undefined;
    if (typeof value === 'object') return value as Record<string, unknown>;
    try {
        return JSON.parse(String(value));
    } catch {
        return undefined;
    }
}

type UploadedFiles = Record<string, Express.Multer.File[]> | undefined;

function getFile(req: Request, ...fieldNames: string[]) {
    const files = req.files as UploadedFiles;
    for (const name of fieldNames) {
        const file = files?.[name]?.[0];
        if (file) return file;
    }
    return undefined;
}

/**
 * Stores an input image and returns a reference Replicate can read:
 * the public (Cloudinary) URL when there is one, otherwise a data URI.
 */
async function prepareInputImage(file: Express.Multer.File, prefix: string) {
    const dataUri = bufferToDataUri(file.buffer, file.mimetype);
    const storedUrl = await persistImage({ buffer: file.buffer, mimetype: file.mimetype }, prefix)
        .catch((error) => {
            console.error('Could not store the input image:', error);
            return undefined;
        });
    const modelInput = storedUrl?.startsWith('http') ? storedUrl : dataUri;
    return { storedUrl, modelInput };
}

interface SaveContext {
    mode: ImageMode;
    options: GenerationOptions;
    body: Record<string, unknown>;
    sourceImageUrl?: string;
}

/**
 * Copies the generated images to permanent storage and records them in the database.
 * Failures here never fail the request - the client still gets the (temporary) Replicate URLs.
 */
async function saveGenerations(outputUrls: string[], { mode, options, body, sourceImageUrl }: SaveContext) {
    return Promise.all(outputUrls.map(async (outputUrl): Promise<Image> => {
        const image: Image = {
            ownerId: body.ownerId ? String(body.ownerId) : undefined,
            imageUrl: outputUrl,
            mode,
            prompt: options.prompt,
            negativePrompt: options.negativePrompt,
            parameters: {
                ...parseParameters(body.parameters),
                numOutputs: options.numOutputs,
                ...(options.width && { size: `${options.width}x${options.height}` }),
                ...(options.promptStrength !== undefined && { promptStrength: options.promptStrength }),
                ...(options.seed !== undefined && { seed: options.seed }),
            },
            sourceImageUrl,
            createdAt: new Date(),
        };
        try {
            image.imageUrl = await persistImage({ url: outputUrl }, 'generated');
            if (collections.images) {
                const result = await collections.images.insertOne(image);
                image._id = result.insertedId;
            }
        } catch (error) {
            console.error('Could not save a generated image:', error);
        }
        return image;
    }));
}

// POST /api/stableDiffusion/ - text to image
stableDiffusionController.post('/', asyncHandler(async (req, res) => {
    const options = parseOptions(req.body);
    const output = await generateImage(options);
    const images = await saveGenerations(output, { mode: 'text-to-image', options, body: req.body });
    res.status(200).json({ images });
}));

// POST /api/stableDiffusion/imageUrlToImage/ - image to image from a public URL
stableDiffusionController.post('/imageUrlToImage', asyncHandler(async (req, res) => {
    const { inputImageUrl } = req.body;
    if (!inputImageUrl) {
        throw new HttpError(400, 'inputImageUrl is required');
    }
    const options = parseOptions(req.body);
    const output = await imageToImage(inputImageUrl, options);
    const images = await saveGenerations(output, { mode: 'image-to-image', options, body: req.body, sourceImageUrl: inputImageUrl });
    res.status(200).json({ images });
}));

// POST /api/stableDiffusion/imageToImage/ - multipart: image (or legacy inputImageUrl), prompt, ...
stableDiffusionController.post(
    '/imageToImage',
    imageUpload.fields([{ name: 'image', maxCount: 1 }, { name: 'inputImageUrl', maxCount: 1 }]),
    asyncHandler(async (req, res) => {
        const file = getFile(req, 'image', 'inputImageUrl');
        if (!file) {
            throw new HttpError(400, 'An image file is required');
        }
        const options = parseOptions(req.body);
        const { storedUrl, modelInput } = await prepareInputImage(file, 'source');
        const output = await imageToImage(modelInput, options);
        const images = await saveGenerations(output, { mode: 'image-to-image', options, body: req.body, sourceImageUrl: storedUrl });
        res.status(200).json({ images });
    })
);

// POST /api/stableDiffusion/sketchToImage/ - multipart: image (the drawing), prompt, ...
stableDiffusionController.post(
    '/sketchToImage',
    imageUpload.fields([{ name: 'image', maxCount: 1 }]),
    asyncHandler(async (req, res) => {
        const file = getFile(req, 'image');
        if (!file) {
            throw new HttpError(400, 'A sketch image is required');
        }
        const options = parseOptions(req.body);
        const { storedUrl, modelInput } = await prepareInputImage(file, 'sketch');
        const output = await scribbleToImage(modelInput, options);
        const images = await saveGenerations(output, { mode: 'sketch-to-image', options, body: req.body, sourceImageUrl: storedUrl });
        res.status(200).json({ images });
    })
);

// POST /api/stableDiffusion/inpaint/ - multipart: image, mask (white = repaint), prompt, ...
stableDiffusionController.post(
    '/inpaint',
    imageUpload.fields([{ name: 'image', maxCount: 1 }, { name: 'mask', maxCount: 1 }]),
    asyncHandler(async (req, res) => {
        const file = getFile(req, 'image');
        const mask = getFile(req, 'mask');
        if (!file || !mask) {
            throw new HttpError(400, 'Both an image and a mask are required');
        }
        const options = parseOptions(req.body);
        const { storedUrl, modelInput } = await prepareInputImage(file, 'source');
        const output = await inpaintImage(modelInput, bufferToDataUri(mask.buffer, mask.mimetype), options);
        const images = await saveGenerations(output, { mode: 'inpaint', options, body: req.body, sourceImageUrl: storedUrl });
        res.status(200).json({ images });
    })
);

// POST /api/stableDiffusion/controlNet/ - JSON: image (URL or data URI), prompt
stableDiffusionController.post('/controlNet', asyncHandler(async (req, res) => {
    const { image, prompt } = req.body;
    if (!image || !prompt) {
        throw new HttpError(400, 'image and prompt are required');
    }
    const output = await regenerateImageFromUrl({ image, prompt });
    res.status(200).json(output);
}));

export default stableDiffusionController;
