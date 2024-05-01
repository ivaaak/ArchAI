import './HowItWorks.css'

const ExampleShowcase = () => {
    return (
        <div className="gallery-showcase" id='exampleShowcase'> 
            <h1 className="gallery-title">  Generated Image Examples: </h1>
            <img src="/public/sketchTypePreviews/single building 3d sketch.jpeg" alt="" width="500" height="600" />
            <img src="/public/sketchTypePreviews/combined.jpeg" alt="" width="500" height="600" />
            <img src="/public/sketchTypePreviews/out-0.png" alt="" width="500" height="600" />
            <img src="/public/sketchTypePreviews/city plan.jpeg" alt="" width="500" height="600" />
            <img src="/public/sketchTypePreviews/sketch aerial isomorphic view.jpeg" alt="" width="500" height="600" />
            <img src="/public/sketchTypePreviews/site plan.jpeg" alt="" width="500" height="600" />
        </div>
    );

};

export default ExampleShowcase;
