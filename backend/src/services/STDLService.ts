// runReplicate.js
import Replicate from 'replicate';
import dotenv from 'dotenv';

dotenv.config();

const replicate = new Replicate({
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

export async function generateImage(prompt: string, negative_prompt: string, outputImageCount?: number) {
   if (!outputImageCount) {
      outputImageCount = 1;
   }

   const input = {
      width: 1024,
      height: 1024,
      prompt: prompt,
      refine: BASE_IMAGE_REFINER,
      scheduler: KARRAS_DPM,
      lora_scale: 0.6,
      num_outputs: outputImageCount,
      guidance_scale: GUIDANCE_SCALE,
      apply_watermark: false,
      high_noise_frac: HIGH_NOISE_FRAC,
      negative_prompt: negative_prompt,
      prompt_strength: PROMPT_STRENGTH,
      num_inference_steps: NUM_INFERENCE_STEPS,
   };

   console.log({ model, input });
   console.log('Running...');
   const output = await replicate.run(model, { input });
   console.log('Done!', output);

   return output;
}

export async function imageToImage(inputImageUrl: string, prompt: string, outputImageCount: number) {
   if (!outputImageCount) {
      outputImageCount = 1;
   }

   const input = {
      image: inputImageUrl,
      width: 1024,
      height: 1024,
      prompt: prompt,
      refine: BASE_IMAGE_REFINER,
      scheduler: KARRAS_DPM,
      num_outputs: outputImageCount,
      guidance_scale: GUIDANCE_SCALE,
      high_noise_frac: HIGH_NOISE_FRAC,
      prompt_strength: PROMPT_STRENGTH,
      num_inference_steps: NUM_INFERENCE_STEPS,
   };

   console.log({ model, input });
   console.log('Running...');
   const output = await replicate.run(model, { input });
   console.log('Done!', output);

   return output;
}

/* Example Input for the Replicate API:
{
  "mask": "https://replicate.delivery/pbxt/JF3OMU8P5Kpxi4EmDqDKEH1fxE5qGOZThplanZAXnzJzzVja/nyc-mask.png",
  "image": "https://replicate.delivery/pbxt/JF3OMzdRCDSp9ZL2bxRDb6YZWryrT0OxfTB60W4y5PFA6MYi/nyc.png",
  "width": 1024,
  "height": 1024,
  "prompt": "Alien invasion",
  "refine": "base_image_refiner",
  "scheduler": "KarrasDPM",
  "num_outputs": 1,
  "guidance_scale": 7.5,
  "high_noise_frac": 0.8,
  "prompt_strength": 0.9,
  "num_inference_steps": 30
}
*/
