import Replicate from 'replicate';
import '../config';

export const replicate = new Replicate({
   auth: process.env.REPLICATE_API_TOKEN,
   userAgent: 'https://www.npmjs.com/package/create-replicate'
});

const model = 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b';

const BASE_IMAGE_REFINER = "base_image_refiner";
const KARRAS_DPM = "KarrasDPM";
const GUIDANCE_SCALE = 7.5;
const HIGH_NOISE_FRAC = 0.8;
const PROMPT_STRENGTH = 0.9;
const NUM_INFERENCE_STEPS = 30;
export const DEFAULT_NEGATIVE_PROMPT = 'blurry, low quality, distorted, deformed, watermark, text, signature';

export interface GenerationOptions {
   prompt: string;
   negativePrompt?: string;
   numOutputs?: number;
   width?: number;
   height?: number;
   seed?: number;
   // How strongly the prompt overrides the input image (image-to-image / inpainting only). 1 = ignore the image.
   promptStrength?: number;
}

// Replicate returns an array of URLs for SDXL (older clients) or FileOutput objects (newer clients).
export function toUrlList(output: unknown): string[] {
   const items = Array.isArray(output) ? output : [output];
   return items.filter(Boolean).map((item) => String(item));
}

function baseInput(options: GenerationOptions) {
   return {
      prompt: options.prompt,
      negative_prompt: options.negativePrompt || DEFAULT_NEGATIVE_PROMPT,
      num_outputs: options.numOutputs || 1,
      refine: BASE_IMAGE_REFINER,
      scheduler: KARRAS_DPM,
      guidance_scale: GUIDANCE_SCALE,
      high_noise_frac: HIGH_NOISE_FRAC,
      num_inference_steps: NUM_INFERENCE_STEPS,
      apply_watermark: false,
      ...(options.seed !== undefined && { seed: options.seed }),
   };
}

async function run(input: Record<string, unknown>) {
   console.log('Running SDXL', { ...input, image: input.image ? '[image]' : undefined, mask: input.mask ? '[mask]' : undefined });
   const output = await replicate.run(model, { input });
   return toUrlList(output);
}

export async function generateImage(options: GenerationOptions) {
   return run({
      ...baseInput(options),
      width: options.width || 1024,
      height: options.height || 1024,
      lora_scale: 0.6,
   });
}

// image: a public URL or a data URI
export async function imageToImage(image: string, options: GenerationOptions) {
   return run({
      ...baseInput(options),
      image,
      prompt_strength: options.promptStrength ?? PROMPT_STRENGTH,
   });
}

// Black areas of the mask are preserved, white areas are re-generated.
export async function inpaintImage(image: string, mask: string, options: GenerationOptions) {
   return run({
      ...baseInput(options),
      image,
      mask,
      prompt_strength: options.promptStrength ?? PROMPT_STRENGTH,
   });
}
