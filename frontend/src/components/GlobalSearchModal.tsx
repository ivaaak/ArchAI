// GlobalSearchModal.tsx
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import './GlobalSearchModal.css'
import PromptsMenu from './GenerateImage/PromptMenu';
import ImageGenerationParameters from './GenerateImage/ImageGenerationParameters';
import ImageOptions from './GenerateImage/ImageOptions';
import apiClient from '../utils/axios';
import { useAuth0 } from '@auth0/auth0-react';
import UnauthorizedPage from './UnauthorizedPage';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GlobalSearchModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const { isAuthenticated } = useAuth0();
    const [textPrompt, setTextPrompt] = useState('');
    const [combinedPrompt, setCombinedPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPromptsMenu, setSelectedPromptsMenu] = useState<string[]>([]);
    const [parameters, setParameters] = useState({
        sketchType: '',
        color: '',
        artStyle: '',
        perspective: '',
        dimension: '',
        structure: '',
        location: '',
    });
    const modalContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);


    const handleSelectedPromptsChange = (newSelectedPrompts: string[]) => {
        setSelectedPromptsMenu(newSelectedPrompts);
    };

    const handleImagesCountOptionChange = () => { };


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
        } catch (error) {
            console.error('Error submitting the form:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-content" ref={modalContentRef}>
                {!isAuthenticated
                    ? <UnauthorizedPage></UnauthorizedPage>
                    : <>
                        <div className="modal-third">
                            <h1>Generate A Sketch: </h1>
                            <PromptsMenu onSelectedPromptsChange={handleSelectedPromptsChange}></PromptsMenu>
                        </div>
                        <div className="modal-third">
                            <ImageOptions onImageOptionsChange={handleImagesCountOptionChange}></ImageOptions>
                            <ImageGenerationParameters onParametersChange={handleParametersChange}></ImageGenerationParameters>
                        </div>
                        <div className="modal-third">
                            <form onSubmit={handleSubmit}>
                                <textarea
                                    placeholder="Describe specifics or details to the model"
                                    value={textPrompt}
                                    onChange={(e) => setTextPrompt(e.target.value)}
                                    rows={4}
                                    style={{ width: '100%' }}
                                />
                                <input className='submit-prompt-button' type="submit" value="PROMPT" />
                            </form>
                        </div>
                    </>
                }
            </div>
        </div>
    );
};

export default GlobalSearchModal;
