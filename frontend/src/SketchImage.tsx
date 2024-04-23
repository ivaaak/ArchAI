import { useState, useRef, useEffect } from 'react';
import Prompts from './Prompts';
import './App.css';
import { ReactSketchCanvas } from 'react-sketch-canvas';

const SketchImage = () => {
    const [prompt, setPrompt] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            contextRef.current = canvas.getContext('2d');
            // Set canvas background to white
            if (contextRef.current) {
                contextRef.current.fillStyle = '#FFFFFF';
                contextRef.current.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, []);

    const styles = {
        border: "0.0625rem solid #9c9c9c",
        borderRadius: "0.25rem"
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("event", event);
    };

    return (
        <section className="single-feature-container">
            <div className="single-intro">
                <h1> Sketch An Image: </h1>
                <Prompts></Prompts>
                <form onSubmit={handleSubmit}>
                    <textarea
                        placeholder="Prompt The Model"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={4}
                        style={{ width: '100%' }}
                    />
                    <input className='submit-prompt-button' type="submit" value="PROMPT" />
                </form>
            </div>
            <div className="single-feature">
                <ReactSketchCanvas
                    style={styles}

                    strokeWidth={4}
                    strokeColor="red"
                />
            </div>
        </section>
    );
};

export default SketchImage;
