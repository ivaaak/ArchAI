import { useEffect, useState } from 'react';
import './Browse.css';
import apiClient from '../utils/axios';

interface ImageData {
    imageData: string;
    prompt: string;
}

const Browse = () => {
    const [imagesData, setImagesData] = useState<ImageData[]>([]);
    useEffect(() => {
        apiClient.get('/image')
            .then(response => {
                setImagesData(response.data);
            })
            .catch(error => console.error('Error fetching images:', error));
    }, []);

    const downloadImage = (imageData: string, index: number) => {
        const a = document.createElement('a');
        a.href = imageData;
        a.download = `Generated Image ${index + 1}.jpg`;
        document.body.appendChild(a); // Required for Firefox
        a.click();
        a.remove();
    };

    const openInNewTab = (imageData: string) => {
        window.open(`http://localhost:3000/${imageData}`, '_blank');
    };

    return (
        <div className="gallery">
            {imagesData.map((image, index) => (
                <div key={index} className="gallery-item">
                    <div className="image-container">
                        <img src={`http://localhost:3000/${image.imageData}`} alt={`Generated Image ${index + 1}`} />
                        <div className="overlay">
                            <button onClick={() => downloadImage(image.imageData, index)} className="overlay-button">Download</button>
                            <button className="overlay-button">Edit</button>
                            <button className="overlay-button">Share</button>
                            <button onClick={() => openInNewTab(image.imageData)} className="overlay-button">Open in New Tab</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

};

export default Browse;