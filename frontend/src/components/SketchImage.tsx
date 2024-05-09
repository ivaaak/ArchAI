import { useState, useRef, useEffect } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import PromptsMenu from '../components/GenerateImage/PromptMenu';
import sketchBg from '../../public/assetImages/sketchBackground.jpg'
import Tabs from './Tabs';
import '../App.css';

const SketchImage = () => {
    const [prompt, setPrompt] = useState('');
    const [selectedPromptsMenu, setSelectedPromptsMenu] = useState<string[]>([]);
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
    const [brushSize, setBrushSize] = useState(4);
    const [brushColor, setBrushColor] = useState('white');
    const [backgroundImage, setBackgroundImage] = useState<string>(sketchBg);

    const styles = {
        border: "0.0625rem solid #9c9c9c",
        borderRadius: "0.25rem"
    };

    const handleSelectedPromptsChange = (newSelectedPrompts: string[]) => {
        setSelectedPromptsMenu(newSelectedPrompts);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("event", event);
    };

    const handleBackgroundColorChange = (color: string) => {
        setBackgroundColor(color);
    };

    const handleBrushSizeChange = (size: number) => {
        setBrushSize(size);
    };

    const handleBrushColorChange = (color: string) => {
        setBrushColor(color);
    };

    const handleBackgroundImageChange = (image: string) => {
        setBackgroundImage(image);
    };

    return (
        <>
            <Tabs routes={[
                { route: "/generate", label: "Generate Image" },
                { route: "/upload", label: "Upload Image" },
                { route: "/sketch", label: "Sketch Image" }
            ]} />
            <section className="single-feature-container">
                <div className="single-intro">
                    <h1> Sketch An Image: </h1>
                    <PromptsMenu onSelectedPromptsChange={handleSelectedPromptsChange}></PromptsMenu>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            placeholder="Add Parameters For The Model"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={4}
                            style={{ width: '100%' }}
                        />
                        <input className='submit-prompt-button' type="submit" value="Generate From Sketch" />
                    </form>
                    <div>
                        <h1> Canvas Options: </h1>
                        <label>Background Color:</label>
                        <input type="color" value={backgroundColor} onChange={(e) => handleBackgroundColorChange(e.target.value)} />
                    </div>
                    <div>
                        <label>Brush Size:</label>
                        <input type="number" value={brushSize} onChange={(e) => handleBrushSizeChange(parseInt(e.target.value, 10))} />
                    </div>
                    <div>
                        <label>Brush Color:</label>
                        <input type="color" value={brushColor} onChange={(e) => handleBrushColorChange(e.target.value)} />
                    </div>
                    <div>
                        <label>Background Image:</label>
                        <input type="text" value={backgroundImage} onChange={(e) => handleBackgroundImageChange(e.target.value)} />
                    </div>
                </div>
                <div className="single-feature">
                    <ReactSketchCanvas
                        style={styles}
                        strokeWidth={brushSize}
                        strokeColor={brushColor}
                        backgroundImage={backgroundImage}
                        canvasColor={backgroundColor}
                    // preserveBackgroundImageAspectRatio={"16:9"}
                    />
                </div>
            </section>
        </>
    );
};

export default SketchImage;
