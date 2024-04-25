import { SetStateAction, useState } from 'react';
import apiClient from '../utils/axios';
import PromptsMenu from './PromptMenu';
import ImageGenerationParameters from './ImageGenerationParameters';
import '../App.css';

const GenerateImage = () => {
    const [textPrompt, setTextPrompt] = useState('');
    const [selectedPromptsMenu, setSelectedPromptsMenu] = useState<string[]>([]);
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

    const handleSelectedPromptsChange = (newSelectedPrompts: string[]) => {
        setSelectedPromptsMenu(newSelectedPrompts);
    };

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
            combinedParameters += `((${parameters.sketchType})), `;
        }
        if (parameters.artStyle) {
            combinedParameters += `((${parameters.artStyle})), `;
        }
        if (parameters.perspective) {
            combinedParameters += `((${parameters.perspective})), `;
        }
        if (parameters.structure) {
            combinedParameters += `((${parameters.structure})), `;
        }
        if (parameters.dimension) {
            combinedParameters += `(${parameters.dimension}), `;
        }
        if (parameters.location) {
            combinedParameters += `(${parameters.location}), `;
        }
        if (parameters.color) {
            combinedParameters += `(${parameters.color}), `;
        }

        combinedParameters = combinedParameters.replace(/,\s*$/, '');
        return combinedParameters;
    };


    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        let combinedPrompt = `${combinePromptParameters()}, ((${textPrompt})), ${selectedPromptsMenu}`;
        console.log("combinedPrompt", combinedPrompt)
        setCombinedPrompt(combinedPrompt);
        setIsLoading(true);
        try {
            const response = await apiClient.post('/stableDiffusion/', {
                prompt: combinedPrompt,
                negativePrompt: ''
            });
            setGeneratedImage(response.data);
            saveImageToLocalStorage(response.data, textPrompt);
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
                <PromptsMenu onSelectedPromptsChange={handleSelectedPromptsChange}></PromptsMenu>
                <ImageGenerationParameters onParametersChange={handleParametersChange}></ImageGenerationParameters>
                <form onSubmit={handleSubmit}>
                    <textarea
                        placeholder="Prompt The Model"
                        value={textPrompt}
                        onChange={(e) => setTextPrompt(e.target.value)}
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
                {textPrompt && !isLoading &&
                    <p className="single-feature-note"> Prompt Used: {textPrompt}</p>}
                    <p className="single-feature-note"> Options Used: {selectedPromptsMenu}</p>
                    <p className="single-feature-note"> Parameters Used: {combinePromptParameters()}</p>
            </div>
        </section>
    );
};

export default GenerateImage;
