import './Browse.css';
import cityPlanImage from '../public/sketchTypePreviews/city plan.jpeg'
import combinedImage from '../public/sketchTypePreviews/combined.jpeg'
import singleBuildingImage from '../public/sketchTypePreviews/single building 3d sketch.jpeg'
import sitePlanImage from '../public/sketchTypePreviews/site plan.jpeg'
import sketchAerialImage from '../public/sketchTypePreviews/sketch aerial isomorphic view.jpeg'

interface ImageData {
    url: string;
    prompt: string;
}

const Examples = () => {
    const imagesData: ImageData[] = [
        {
            url: cityPlanImage,
            prompt: 'City Plan'
        },
        {
            url: combinedImage,
            prompt: 'Combined Image'
        },
        {
            url: singleBuildingImage,
            prompt: 'Single Building'
        },
        {
            url: sitePlanImage,
            prompt: 'Site Plan'
        },
        {
            url: sketchAerialImage,
            prompt: 'Aerial'
        }
    ]

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
                        <p className='prompt-detail'>Example of a : {imageData.prompt} Prompt</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Examples;
