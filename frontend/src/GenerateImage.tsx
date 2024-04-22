import { useState } from 'react';
import apiClient from './axios'; // Adjust the import path as necessary
import Prompts from './Prompts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import './App.css';

const GenerateImage = () => {
    const [prompt, setPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState('');
    const [showDefaultOptions, setShowDefaultOptions] = useState(false);

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try {
            const response = await apiClient.post('/stableDiffusion/', {
                prompt: prompt,
                negativePrompt: ''
            });
            setGeneratedImage(response.data);
            saveImageToLocalStorage(response.data, prompt);
        } catch (error) {
            console.error('Error submitting the form:', error);
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
                <h1>Generate Sketches Using AI</h1>
                <p>Prompt Options:</p>
                <Prompts></Prompts>
                <form onSubmit={handleSubmit}>
                    <textarea
                        placeholder="Prompt The Model"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={4}
                        style={{ width: '100%' }}
                    />
                    <input className='submit-prompt-button' type="submit" value="PROMPT" />
                    <button className='default-options-button' type="button" onClick={() => setShowDefaultOptions(!showDefaultOptions)}>
                        <FontAwesomeIcon icon={faCog} />
                    </button>
                    {showDefaultOptions && (
                        <div className="default-options">
                            <input
                                type="text"
                                placeholder="Default Prompt Option"
                            // Add functionality to handle default options
                            />
                        </div>
                    )}
                </form>
            </div>
            <div className="single-feature">
                {!generatedImage &&
                    <img src="https://stories.freepiklabs.com/storage/1864/Meeting-01.svg" />}
                {generatedImage &&
                    <img src={generatedImage} />}
                {prompt &&
                    <p className="single-feature-note">Prompt Used: {prompt}</p>}
            </div>
        </section>
    );
};

export default GenerateImage;
