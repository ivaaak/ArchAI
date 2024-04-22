import React, { useState } from 'react';
import './App.css';

const GenerateImage: React.FC = () => {
    const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);

    const handlePromptClick = (prompt: string) => {
        setSelectedPrompts(prevPrompts => {
            if (prevPrompts.includes(prompt)) {
                return prevPrompts.filter(p => p !== prompt);
            } else {
                return [...prevPrompts, prompt];
            }
        });
    };

    return (
        <div className="prompts">
            <button className={`prompt-button ${selectedPrompts.includes('Style') ? 'selected' : ''}`} onClick={() => handlePromptClick('Style')}>Style</button>
            <button className={`prompt-button ${selectedPrompts.includes('Structure') ? 'selected' : ''}`} onClick={() => handlePromptClick('Structure')}>Structure</button>
            <button className={`prompt-button ${selectedPrompts.includes('Location') ? 'selected' : ''}`} onClick={() => handlePromptClick('Location')}>Location</button>
            <button className={`prompt-button ${selectedPrompts.includes('2D') ? 'selected' : ''}`} onClick={() => handlePromptClick('2D')}>2D</button>
            <button className={`prompt-button ${selectedPrompts.includes('3D') ? 'selected' : ''}`} onClick={() => handlePromptClick('3D')}>3D</button>
            <button className={`prompt-button ${selectedPrompts.includes('Wireframe') ? 'selected' : ''}`} onClick={() => handlePromptClick('Wireframe')}>Wireframe</button>
            <button className={`prompt-button ${selectedPrompts.includes('Sketch') ? 'selected' : ''}`} onClick={() => handlePromptClick('Sketch')}>Sketch</button>
            <button className={`prompt-button ${selectedPrompts.includes('Paper') ? 'selected' : ''}`} onClick={() => handlePromptClick('Paper')}>Paper</button>
            <button className={`prompt-button ${selectedPrompts.includes('Monochrome') ? 'selected' : ''}`} onClick={() => handlePromptClick('Monochrome')}>Monochrome</button>
        </div>
    );
};

export default GenerateImage;
