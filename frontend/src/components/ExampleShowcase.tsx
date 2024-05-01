import './Browse.css'

const ExampleShowcase = () => {
    const images = [
        {
            src: "/public/sketchTypePreviews/single building 3d sketch.jpeg",
            name: "Single Building 3D Sketch",
            description: "a modern house Attersee, Austria, 3d paper sketch angular black and white outlines style"
        },
        {
            src: "/public/sketchTypePreviews/combined.jpeg",
            name: "Combined View",
            description: "Combined View"
        },
        {
            src: "/public/sketchTypePreviews/out-0.png",
            name: "Out-0 View",
            description: "Out-0 View"
        },
        {
            src: "/public/sketchTypePreviews/city plan.jpeg",
            name: "City Plan",
            description: "topdown view 2d black and white vanrick style architecture sketch city plan"
        },
        {
            src: "/public/sketchTypePreviews/sketch aerial isomorphic view.jpeg",
            name: "Aerial Isomorphic View",
            description: "Aerial Isomorphic View"
        },
        {
            src: "/public/sketchTypePreviews/site plan.jpeg",
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
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

};

export default ExampleShowcase;
