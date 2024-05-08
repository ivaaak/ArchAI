import { useState } from 'react'
import { useParams } from 'react-router-dom';
import './ImageShowcase.css';

const ImageShowcase = () => {
    const { id } = useParams();
    const [isZoomed, setIsZoomed] = useState(false);

    const handleMouseEnter = () => {
        setIsZoomed(true);
    };

    const handleMouseLeave = () => {
        setIsZoomed(false);
    };
    
    return (
        <>
            <h1 className="gallery-title">
                Image Title Here
            </h1>
            <div className="gallery-homepage">
                <div className="image-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <img  src={`http://localhost:3000/src/uploads/${id}`} alt="Generated Image" 
                    className={isZoomed? "magnified" : ""} />
                    <div className="overlay">
                        <h3> Name: Example Image Name</h3>
                        <h3> Prompt: This is an example description.</h3>
                        <p> Tags: Example, Tag</p>
                    </div>
                    <div className="magnifying-glass">MAGNIFY</div>

                </div>
                <div className="panel">
                    <h3>Info Text Here</h3>
                    <p>Additional Info Here</p>
                    <button>Button 1</button>
                    <button>Button 2</button>
                </div>
            </div>
        </>
    );
};

export default ImageShowcase;
