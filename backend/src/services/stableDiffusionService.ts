import axios from 'axios';

class ImageGenerator {
    private headers: { [key: string]: string };

    constructor() {
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.5',
            'Referer': 'https://replicate.com/stability-ai/sdxl',
            'Content-Type': 'application/json',
            'Origin': 'https://replicate.com',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'TE': 'trailers'
        };
    }

    async genImage(
        prompt: string, 
        negativePrompt: string, 
        count: number = 1, 
        width: number = 1024, 
        height: number = 1024, 
        refine: string = "expert_ensemble_refiner", 
        scheduler: string = "DDIM", 
        guidanceScale: number = 7.5, 
        highNoiseFrac: number = 0.8, 
        promptStrength: number = 1, 
        numInferenceSteps: number = 50): 
        Promise<string | null | { prompt: string; negative_prompt: string; images: any; }> {
        try {
            if (count < 1 || count > 4) {
                throw new Error("Count must be between 1 and 4");
            }
            if (width > 1024 || height > 1024) {
                throw new Error("Width and height must be 1024 or less");
            }
            const validSchedulers = ["DDIM", "DPMSolverMultistep", "HeunDiscrete", "KarrasDPM", "K_EULER_ANCESTRAL", "K_EULER", "PNDM"];
            if (!validSchedulers.includes(scheduler)) {
                throw new Error("Invalid scheduler value");
            }
            if (numInferenceSteps < 1 || numInferenceSteps > 500) {
                throw new Error("num_inference_steps must be between 1 and 500");
            }
            if (guidanceScale < 1 || guidanceScale > 50) {
                throw new Error("guidance_scale must be between 1 and 50");
            }
            if (promptStrength > 1) {
                throw new Error("prompt_strength must be 1 or less");
            }
            if (highNoiseFrac > 1) {
                throw new Error("high_noise_frac must be 1 or less");
            }
            const url = "https://replicate.com/api/models/stability-ai/sdxl/versions/8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f/predictions";
            const payload = JSON.stringify({
                inputs: {
                    width,
                    height,
                    prompt,
                    refine,
                    scheduler,
                    num_outputs: count,
                    guidance_scale: guidanceScale,
                    high_noise_frac: highNoiseFrac,
                    prompt_strength: promptStrength,
                    num_inference_steps: numInferenceSteps,
                    negative_prompt: negativePrompt
                }
            });
            const response = await axios.post(url, payload, { headers: this.headers });
            const jsonResponse = response.data;
            const uuid = jsonResponse.uuid;
            const imageUrl = await this.getImageUrl(uuid, prompt, negativePrompt);

            return imageUrl;
        } catch (error) {
            const err = error as Error;
            console.error(`An error occurred: ${err.message}`);
            return null;
        }
    }

    async getImageUrl(uuid: string, prompt: string, negativePrompt: string): Promise<string | null | { prompt: string; negative_prompt: string; images: any; }> {
        const url = `https://replicate.com/api/models/stability-ai/sdxl/versions/8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f/predictions/${uuid}`;
        const response = await axios.get(url, { headers: this.headers });
        const jsonResponse = response.data;

        if (jsonResponse.prediction.status === "succeeded") {
            const output = { prompt: prompt, negative_prompt: negativePrompt, images: jsonResponse.prediction.output_files };
            return output;
        } else {
            return this.getImageUrl(uuid, prompt, negativePrompt);
        }
    }
}

const imageGenerator = new ImageGenerator();

export async function generateImageNoParam() {
    const prompt = "Super hero Cat";
    const negativePrompt = "Super hero cape";
    const image = await imageGenerator.genImage(prompt, negativePrompt);
    console.log(image);
}

export default async function generateImageWithParams(prompt: string, negativePrompt: string ) {
    const image = await imageGenerator.genImage(prompt, negativePrompt);
    console.log(image);
}

//generateImageNoParam();
