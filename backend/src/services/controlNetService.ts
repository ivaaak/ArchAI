import Replicate from 'replicate';
const replicate = new Replicate();



export async function regenerateImageFromUrl(input: {image: string, prompt: string}) {
    const output = await replicate.run("jagilley/controlnet:8ebda4c70b3ea2a2bf86e44595afb562a2cdf85525c620f1671a78113c9f325b", { input });
    console.log(output)
    return output;
    //=> ["https://replicate.delivery/pbxt/94lHvFrTYlKkCVk9vEPqP5U...
}

export async function generateExampleImageFromUrl() {
    const input = {
        image: "https://replicate.delivery/pbxt/IMpV0c2SLNPxcnFxJzNrYymUxrzOd9UoQzdLxV1Ew3jAzXRW/doge.png",
        prompt: "a cute dog"
    };
    const output = await replicate.run("jagilley/controlnet:8ebda4c70b3ea2a2bf86e44595afb562a2cdf85525c620f1671a78113c9f325b", { input });
    console.log(output);
    return output;
    //=> ["https://replicate.delivery/pbxt/94lHvFrTYlKkCVk9vEPqP5U...
}
