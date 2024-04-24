import { useState } from 'react';
import Prompts from './PromptMenu';
import '../App.css';

const UploadImage = () => {
    const [prompt, setPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("event", event);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e?.target?.result === 'string') {
                    setGeneratedImage(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <section className="single-feature-container">
            <div className="single-intro">
                <h1>Upload A Sketch: </h1>
                <Prompts></Prompts>
                {/* <ImageGenerationParameters></ImageGenerationParameters> */}
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
            <div className="single-feature"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ border: '6px dashed #ccc', padding: '20px', textAlign: 'center' }}>
                {!generatedImage && (
                    <>
                        <img src="https://stories.freepiklabs.com/storage/1864/Meeting-01.svg" />
                        <h1>Drag and drop your image here</h1>
                        {/* Optionally, include an icon here */}
                    </>
                )}
                {generatedImage &&
                    <img src={generatedImage} />}
                {prompt &&
                    <p className="single-feature-note">Prompt Used: {prompt}</p>}
            </div>
        </section>
    );
};

export default UploadImage;
