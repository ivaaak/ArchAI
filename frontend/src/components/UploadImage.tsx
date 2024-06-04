import { SetStateAction, useState } from 'react';
import PromptsMenu from './GenerateImage/PromptMenu';
import ImageGenerationParameters from './GenerateImage/ImageGenerationParameters';
import apiClient from '../utils/axios';
import '../App.css';
import Tabs from './Tabs';

const UploadImage = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUploadDescription, setImageUploadDescription] = useState('');
    const [uploadedImage, setUploadedImage] = useState('');
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
                    setUploadedImage(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e?.target?.result === 'string') {
                    setUploadedImage(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        if (!uploadedImage) {
            alert('Please upload an image');
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append('image', uploadedImage);
    
            const response = await apiClient.post('cloudinary/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response.data.imageUrl) {
                alert('Image uploaded successfully!');
                // Optionally, handle the success scenario here, such as displaying a success message or navigating to a different page
            } else {
                alert('Failed to upload image.');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('An error occurred during the upload.');
        }
    };

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

    const revertImageUpload = () => {
        setUploadedImage('');
    }

    //TODO
    //const handleModifySubmit = () => { }

    return (
        <>
            <Tabs routes={[
                { route: "/generate", label: "Text to Image" },
                { route: "/upload", label: "Image to Image" },
                { route: "/sketch", label: "Sketch to Image" },
                { route: "/inpaint", label: "Image In-Painting" },
            ]} />
            <section className="single-feature-container">
                <div className="single-intro">
                    {uploadedImage &&
                        <>
                            <h1> 2. Modify The Sketch: </h1>
                            <PromptsMenu onSelectedPromptsChange={handleSelectedPromptsChange}></PromptsMenu>
                            <ImageGenerationParameters onParametersChange={handleParametersChange}></ImageGenerationParameters>
                            <form onSubmit={handleUploadSubmit}> {/*  handleModifySubmit */}
                                <textarea
                                    placeholder="Prompt The Model"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    rows={4}
                                    style={{ width: '100%' }}
                                />
                                <input className='submit-prompt-button' type="submit" value="Modify Image" />
                            </form>
                            <button className='undo-button' onClick={revertImageUpload}> Undo Image Upload </button>
                        </>}
                    {!uploadedImage &&
                        <>
                            <h1> 1. Upload A Sketch: </h1>
                            <textarea
                                placeholder="Add An Image Description"
                                value={imageUploadDescription}
                                onChange={(e) => setImageUploadDescription(e.target.value)}
                                rows={4}
                                style={{ width: '100%' }}
                            />
                            <form onSubmit={handleUploadSubmit}>
                                <input type="file" accept="image/*" id="customFileInput"
                                    onChange={handleFileChange} style={{ width: '100%', height: '75px' }} />
                            </form>
                        </>}
                </div>
                <div className="single-feature"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{ border: '6px dashed #ccc', padding: '20px', textAlign: 'center' }}>
                    {!uploadedImage && (
                        <>
                            <img src="https://stories.freepiklabs.com/storage/1864/Meeting-01.svg" />
                            <h1>Drag and drop your image here</h1>
                        </>
                    )}
                    {uploadedImage &&
                        <img src={uploadedImage} alt="Uploaded Image Preview" />}
                    {prompt &&
                        <p className="single-feature-note">Prompt Used: {prompt}</p>}
                </div>
            </section>
        </>
    );
};

export default UploadImage;
