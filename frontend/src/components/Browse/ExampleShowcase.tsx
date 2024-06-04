import { useNavigate } from 'react-router-dom';
import './Browse.css'

const ExampleShowcase = () => {
    const navigate = useNavigate();

    const images = [
        {
            src: "/sketchTypePreviews/single building 3d sketch.jpeg",
            name: "Single Building 3D Sketch",
            description: "a modern house Attersee, Austria, 3d paper sketch angular black and white outlines style"
        },
        {
            src: "/sketchTypePreviews/combined.jpeg",
            name: "Combined View",
            description: "Combined View"
        },
        {
            src: "/sketchTypePreviews/out-0.png",
            name: "Out-0 View",
            description: "Out-0 View"
        },
        {
            src: "/sketchTypePreviews/city plan.jpeg",
            name: "City Plan",
            description: "topdown view 2d black and white vanrick style architecture sketch city plan"
        },
        {
            src: "/sketchTypePreviews/sketch aerial isomorphic view.jpeg",
            name: "Aerial Isomorphic View",
            description: "Aerial Isomorphic View"
        },
        {
            src: "/sketchTypePreviews/site plan.jpeg",
            name: "Site Plan",
            description: "Site Plan"
        }
    ];

    return (
        <div className="gallery-homepage" id='exampleShowcase'>
            <h1 className="gallery-title">
                Generated Image Examples:
                <div className="gallery-hint"> *hover the images to see prompt details </div>
            </h1>

            {images.map((image, index) => (
                <div key={index} className="gallery-item-homepage">
                    <div className="image-container">
                        <img src={image.src} alt={`Generated Image ${index + 1}`} />
                        <div className="overlay">
                            <h3> Name: {image.name}</h3>
                            <h3> Prompt: {image.description}</h3>
                            <p> Tags: </p>
                            {/* <button onClick={() =>  navigate(`/details/${}`)}>View Details</button> */}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

};

export default ExampleShowcase;
