import { useEffect, useState } from 'react';
import './Browse.css';

interface ImageData {
    url: string;
    prompt: string;
}

const Browse = () => {
    const [imagesData, setImagesData] = useState<ImageData[]>([]);

    useEffect(() => {
        const storedImagesData = localStorage.getItem('generatedImages');
        const parsedImagesData = storedImagesData ? JSON.parse(storedImagesData) : [];
        setImagesData(parsedImagesData);
    }, []);

    const downloadImage = (url: string, index: number) => {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Generated Image ${index + 1}.jpg`;
                document.body.appendChild(a); // Required for Firefox
                a.click();
                a.remove();
            })
            .catch(error => console.error('Error downloading image:', error));
    };

    return (
        <div className="gallery">
            {imagesData.map((imageData, index) => (
                <div key={index} className="gallery-item">
                    <div className="image-container">
                        <img src={imageData.url} alt={`Generated Image ${index + 1}`} />
                        <div className="overlay">
                            <button onClick={() => downloadImage(imageData.url, index)} className="overlay-button">Download</button>
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

export default Browse;
