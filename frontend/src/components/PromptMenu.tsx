import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import '../App.css';

interface GenerateImageProps {
    onSelectedPromptsChange: (selectedPrompts: string[]) => void;
}

const PromptsMenu: React.FC<GenerateImageProps> = ({ onSelectedPromptsChange }) => {
    const [showDefaultOptions, setShowDefaultOptions] = useState(false);
    const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);

    useEffect(() => {
        onSelectedPromptsChange(selectedPrompts);
    }, [selectedPrompts, onSelectedPromptsChange]);

    const handlePromptClick = (prompt: string) => {
        setSelectedPrompts(prevPrompts => {
            const newSelectedPrompts = prevPrompts.includes(prompt)
                ? prevPrompts.filter(p => p !== prompt)
                : [...prevPrompts, prompt];
            return newSelectedPrompts;
        });
    };


    return (
        <div className="prompts">
            <button className={`prompt-button ${selectedPrompts.includes('Angular') ? 'selected' : ''}`}
                onClick={() => handlePromptClick('Angular')}>Angular</button>
            <button className={`prompt-button ${selectedPrompts.includes('Sharp') ? 'selected' : ''}`}
                onClick={() => handlePromptClick('Sharp')}>Sharp</button>
            <button className={`prompt-button ${selectedPrompts.includes('Smooth') ? 'selected' : ''}`}
                onClick={() => handlePromptClick('Smooth')}>Smooth</button>
            <button className={`prompt-button ${selectedPrompts.includes('Paper') ? 'selected' : ''}`}
                onClick={() => handlePromptClick('Paper')}>Paper</button>
            <button className={`prompt-button ${selectedPrompts.includes('Minimalist') ? 'selected' : ''}`}
                onClick={() => handlePromptClick('Minimalist')}>Minimalist</button>
            <button className={`prompt-button ${selectedPrompts.includes('Detailed') ? 'selected' : ''}`}
                onClick={() => handlePromptClick('Detailed')}>Detailed</button>
            <button className={`prompt-button ${selectedPrompts.includes('Outline') ? 'selected' : ''}`}
                onClick={() => handlePromptClick('Outline')}>Outline</button>
            <button className={`prompt-button ${selectedPrompts.includes('Shaded') ? 'selected' : ''}`}
                onClick={() => handlePromptClick('Shaded')}>Shaded</button>
            <button className={`prompt-button ${selectedPrompts.includes('Geometric') ? 'selected' : ''}`}
                onClick={() => handlePromptClick('Geometric')}>Geometric</button>
            <button className={`prompt-button ${selectedPrompts.includes('Textured') ? 'selected' : ''}`}
                onClick={() => handlePromptClick('Textured')}>Textured</button>
            <button className={`prompt-button ${selectedPrompts.includes('Depth of Field') ? 'selected' : ''}`}
                onClick={() => handlePromptClick('Depth of Field')}>Depth of Field</button>
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

export default PromptsMenu;
