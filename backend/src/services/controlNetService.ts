import { DEFAULT_NEGATIVE_PROMPT, GenerationOptions, replicate, toUrlList } from './STDLService';

const SCRIBBLE_MODEL = 'jagilley/controlnet-scribble:435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117';
const CONTROLNET_MODEL = 'jagilley/controlnet:8ebda4c70b3ea2a2bf86e44595afb562a2cdf85525c620f1671a78113c9f325b';

/**
 * Turns a scribble (dark lines on a light background) into a detailed image while keeping its structure.
 * image: a public URL or a data URI
 */
export async function scribbleToImage(image: string, options: GenerationOptions) {
    const numSamples = options.numOutputs && options.numOutputs > 1 ? 4 : 1; // the model only accepts 1 or 4
    const input = {
        image,
        prompt: options.prompt,
        n_prompt: options.negativePrompt || DEFAULT_NEGATIVE_PROMPT,
        num_samples: String(numSamples),
        image_resolution: '768',
        ...(options.seed !== undefined && { seed: options.seed }),
    };
    const output = toUrlList(await replicate.run(SCRIBBLE_MODEL, { input }));
    // The model prepends the detected scribble map to its results - keep only the generated images
    return output.slice(-numSamples).slice(0, options.numOutputs || 1);
}

export async function regenerateImageFromUrl(input: { image: string, prompt: string }) {
    const output = await replicate.run(CONTROLNET_MODEL, { input });
    return toUrlList(output);
}
