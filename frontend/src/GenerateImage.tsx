import { SetStateAction, useState } from 'react';
import apiClient from './axios'; // Adjust the import path as necessary
import Prompts from './Prompts';
import ImageGenerationParameters from './ImageGenerationParameters';
import './App.css';

const GenerateImage = () => {
    const [prompt, setPrompt] = useState('');
    const [combinedPrompt, setCombinedPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [parameters, setParameters] = useState({
        sketchType: '',
        color: '',
        artStyle: '',
        perspective: '',
        dimension: '',
        structure: '',
        location: '',
    });

    const handleParametersChange = (newParameters: SetStateAction<{
        sketchType: string;
        color: string;
        artStyle: string;
        perspective: string;
        dimension: string;
        structure: string;
        location: string;
    }>) => {
        setParameters(newParameters);
        console.log(parameters);
    };

    const combinePromptParameters = () => {
        let combinedParameters = '';
        if (parameters.sketchType) {
            combinedParameters += `Sketch Type: ${parameters.sketchType}, `;
        }
        if (parameters.color) {
            combinedParameters += `Color: ${parameters.color}, `;
        }
        if (parameters.artStyle) {
            combinedParameters += `Art Style: ${parameters.artStyle}, `;
        }
        if (parameters.perspective) {
            combinedParameters += `Perspective: ${parameters.perspective}, `;
        }
        if (parameters.dimension) {
            combinedParameters += `Dimension: ${parameters.dimension}, `;
        }
        if (parameters.structure) {
            combinedParameters += `Structure: ${parameters.structure}, `;
        }
        if (parameters.location) {
            combinedParameters += `Location: ${parameters.location}, `;
        }

        combinedParameters = combinedParameters.replace(/,\s*$/, '');
        return combinedParameters;
    };


    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        let combinedPrompt = `${combinePromptParameters()} ${prompt}`;
        console.log("combinedPrompt", combinedPrompt)
        setCombinedPrompt(combinedPrompt);
        setIsLoading(true);
        try {
            const response = await apiClient.post('/stableDiffusion/', {
                prompt: combinedPrompt,
                negativePrompt: ''
            });
            setGeneratedImage(response.data);
            saveImageToLocalStorage(response.data, prompt);
        } catch (error) {
            console.error('Error submitting the form:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveImageToLocalStorage = (imageUrl: string, prompt: string) => {
        const storedData = JSON.parse(localStorage.getItem('generatedImages') || '[]');
        const newImageData = {
            url: imageUrl,
            prompt: prompt
        };
        storedData.push(newImageData);
        localStorage.setItem('generatedImages', JSON.stringify(storedData));
    };


    return (
        <section className="single-feature-container">
            <div className="single-intro">
                <h1>Generate A Sketch: </h1>
                <Prompts></Prompts>
                <ImageGenerationParameters onParametersChange={handleParametersChange}>
                </ImageGenerationParameters>
                <form onSubmit={handleSubmit}>
                    <textarea
                        placeholder="Prompt The Model"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={4}
                        style={{ width: '100%' }}
                    />
                    <input className='submit-prompt-button' type="submit" value="PROMPT" />
                </form>
            </div>
            <div className="single-feature">
                {isLoading && 
                    <>
                        <div className="loader"></div>
                        <p> Loading... </p>
                    </>
                }
                {!generatedImage && !isLoading &&
                    <img src="https://stories.freepiklabs.com/storage/1864/Meeting-01.svg" />}
                {generatedImage && !isLoading &&
                    <img src={generatedImage} />}
                {prompt && !isLoading &&
                    <p className="single-feature-note">Prompt Used: {combinedPrompt}</p>}
            </div>
        </section>
    );
};

export default GenerateImage;
