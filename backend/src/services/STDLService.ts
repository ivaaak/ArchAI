// runReplicate.js
import Replicate from 'replicate';
import dotenv from 'dotenv';

dotenv.config();

export async function generateImage(prompt: string, negative_prompt: string, imageCount: number) {
 const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
    userAgent: 'https://www.npmjs.com/package/create-replicate'
 });

 const model = 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b';
 const input = {
    width: 1024,
    height: 1024,
    prompt: prompt,
    refine: 'expert_ensemble_refiner',
    scheduler: 'K_EULER',
    lora_scale: 0.6,
    num_outputs: 1, //imageCount
    guidance_scale: 7.5,
    apply_watermark: false,
    high_noise_frac: 0.8,
    negative_prompt: negative_prompt,
    prompt_strength: 0.8,
    num_inference_steps: 25,
 };

 console.log({ model, input });
 console.log('Running...');
 const output = await replicate.run(model, { input });
 console.log('Done!', output);

 return output;
}
