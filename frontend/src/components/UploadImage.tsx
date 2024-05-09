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

    const handleUploadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!uploadedImage) {
            alert('Please upload an image');
            return;
        }

        try {
            // Convert the data URL to a Blob
            const response = await fetch(uploadedImage);
            const blob = await response.blob();

            const formData = new FormData();
            formData.append('image', blob, 'uploadedImage.jpg');
            //formData.append('employeeId', '');

            // Send the FormData to the backend using Axios
            const result = await apiClient.post('/image/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (result.status === 201) {
                alert(`Image uploaded successfully. Image ID: ${result.data.imageId}`);
            } else {
                alert('Error uploading image');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error uploading image');
        }
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
    const handleModifySubmit = () => { }

    return (
        <>
            <Tabs routes={[
                { route: "/generate", label: "Generate Image" },
                { route: "/upload", label: "Upload Image" },
                { route: "/sketch", label: "Sketch Image" }
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
