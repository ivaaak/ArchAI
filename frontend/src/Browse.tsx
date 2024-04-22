import { useEffect, useState } from 'react';
import './Browse.css';

interface ImageData {
    url: string;
    prompt: string;
}

const Gallery = () => {
    const [imagesData, setImagesData] = useState<ImageData[]>([]);

    useEffect(() => {
        const storedImagesData = localStorage.getItem('generatedImages');
        const parsedImagesData = storedImagesData ? JSON.parse(storedImagesData) : [];
        setImagesData(parsedImagesData);
    }, []);

    return (
        <div className="gallery">
            {imagesData.map((imageData, index) => (
                <div key={index} className="gallery-item">
                    <div className="image-container">
                        <img src={imageData.url} alt={`Generated Image ${index + 1}`} />
                        <div className="overlay">
                            <button className="overlay-button">Download</button>
                            <button className="overlay-button">Edit</button>
                            <button className="overlay-button">Share</button>
                        </div>
                        <p className='prompt-detail'>Prompt: {imageData.prompt}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Gallery;
