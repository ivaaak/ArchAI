import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import './App.css';

const GenerateImage: React.FC = () => {
    const [showDefaultOptions, setShowDefaultOptions] = useState(false);
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
            <button className={`prompt-button ${selectedPrompts.includes('Monochrome') ? 'selected' : ''}`} onClick={() => handlePromptClick('Monochrome')}>Monochrome</button>
            <button className={`prompt-button ${selectedPrompts.includes('Cross Section') ? 'selected' : ''}`} onClick={() => handlePromptClick('Cross Section')}>Cross Section</button>
            <button className={`prompt-button ${selectedPrompts.includes('Black White') ? 'selected' : ''}`} onClick={() => handlePromptClick('Black White')}>Black White</button>
            <button className={`prompt-button ${selectedPrompts.includes('Wireframe') ? 'selected' : ''}`} onClick={() => handlePromptClick('Wireframe')}>Wireframe</button>
            <button className={`prompt-button ${selectedPrompts.includes('Outline') ? 'selected' : ''}`} onClick={() => handlePromptClick('Outline')}>Outline</button>
            <button className={`prompt-button ${selectedPrompts.includes('Landscape') ? 'selected' : ''}`} onClick={() => handlePromptClick('Landscape')}>Landscape</button>
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
        </div>
    );
};

export default GenerateImage;
