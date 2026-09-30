import { useEffect, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faImage, faPen, faRotateLeft, faRotateRight, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { requestGeneration } from '../lib/api';
import { createDefaultSettings } from '../lib/prompt';
import { readFileAsDataUrl } from '../lib/files';
import { svgToPng } from '../lib/imageProcessing';
import { useGeneration } from '../hooks/useGeneration';
import GenerationControls from './GenerateImage/GenerationControls';
import ResultsPanel from './GenerateImage/ResultsPanel';
import Workspace from './GenerateImage/Workspace';
import './SketchCanvas.css';

const BRUSH_COLORS = ['#1d1c2b', '#4b5563', '#9ca3af'];

const SketchImage = () => {
    const { user } = useAuth0();
    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const traceInputRef = useRef<HTMLInputElement>(null);
    const [settings, setSettings] = useState(() => createDefaultSettings());
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [brushSize, setBrushSize] = useState(4);
    const [brushColor, setBrushColor] = useState(BRUSH_COLORS[0]);
    // Optional reference image shown under the drawing - it is not sent to the model
    const [traceImage, setTraceImage] = useState('');
    const [hasStrokes, setHasStrokes] = useState(false);
    const [submittedSketch, setSubmittedSketch] = useState('');
    const generation = useGeneration();

    const selectTool = (newTool: 'pen' | 'eraser') => {
        setTool(newTool);
        canvasRef.current?.eraseMode(newTool === 'eraser');
    };

    // Ctrl+Z / Ctrl+Y (or Ctrl+Shift+Z) outside of text fields
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;
            if (!(event.ctrlKey || event.metaKey) || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
            const key = event.key.toLowerCase();
            if (key === 'z' && !event.shiftKey) {
                event.preventDefault();
                canvasRef.current?.undo();
            } else if (key === 'y' || (key === 'z' && event.shiftKey)) {
                event.preventDefault();
                canvasRef.current?.redo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSubmit = () => generation.run(async () => {
        const paths = await canvasRef.current?.exportPaths();
        if (!paths?.length) {
            throw new Error('Draw something on the canvas first.');
        }
        // exportSvg (unlike exportImage) leaves out the trace image: just the lines on the white canvas color
        const sketch = await svgToPng(await canvasRef.current!.exportSvg());
        setSubmittedSketch(sketch.dataUrl);
        return requestGeneration('/stableDiffusion/sketchToImage', settings, {
            ownerId: user?.sub,
            image: sketch.blob,
        });
    });

    const canvas = (
        <div className="sketch-area">
            <div className="canvas-toolbar" role="toolbar" aria-label="Drawing tools">
                <div className="segmented">
                    <button type="button" className={tool === 'pen' ? 'active' : ''} aria-pressed={tool === 'pen'} onClick={() => selectTool('pen')} title="Pen">
                        <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button type="button" className={tool === 'eraser' ? 'active' : ''} aria-pressed={tool === 'eraser'} onClick={() => selectTool('eraser')} title="Eraser">
                        <FontAwesomeIcon icon={faEraser} />
                    </button>
                </div>
                <div className="color-swatches" role="radiogroup" aria-label="Brush color">
                    {BRUSH_COLORS.map((color) => (
                        <button
                            key={color}
                            type="button"
                            role="radio"
                            aria-checked={brushColor === color}
                            aria-label={`Brush color ${color}`}
                            className={`swatch ${brushColor === color ? 'active' : ''}`}
                            style={{ background: color }}
                            onClick={() => { setBrushColor(color); selectTool('pen'); }}
                        />
                    ))}
                </div>
                <label className="brush-size" title="Brush size">
                    <span className="muted small">Size</span>
                    <input type="range" min={1} max={24} value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} />
                </label>
                <div className="toolbar-spacer" />
                <button type="button" className="icon-btn" onClick={() => canvasRef.current?.undo()} title="Undo (Ctrl+Z)" aria-label="Undo">
                    <FontAwesomeIcon icon={faRotateLeft} />
                </button>
                <button type="button" className="icon-btn" onClick={() => canvasRef.current?.redo()} title="Redo (Ctrl+Y)" aria-label="Redo">
                    <FontAwesomeIcon icon={faRotateRight} />
                </button>
                <button type="button" className="icon-btn" onClick={() => canvasRef.current?.clearCanvas()} title="Clear canvas" aria-label="Clear canvas">
                    <FontAwesomeIcon icon={faTrashCan} />
                </button>
                {traceImage ? (
                    <button type="button" className="icon-btn" onClick={() => setTraceImage('')} title="Remove trace image" aria-label="Remove trace image">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                ) : (
                    <button type="button" className="icon-btn" onClick={() => traceInputRef.current?.click()} title="Trace over an image" aria-label="Trace over an image">
                        <FontAwesomeIcon icon={faImage} />
                    </button>
                )}
                <input
                    ref={traceInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) setTraceImage(await readFileAsDataUrl(file));
                        e.target.value = '';
                    }}
                />
            </div>
            <div className="canvas-frame">
                <ReactSketchCanvas
                    ref={canvasRef}
                    className="sketch-canvas"
                    width="100%"
                    height="100%"
                    strokeWidth={brushSize}
                    eraserWidth={brushSize * 3}
                    strokeColor={brushColor}
                    canvasColor="#ffffff"
                    backgroundImage={traceImage}
                    exportWithBackgroundImage={false}
                    preserveBackgroundImageAspectRatio="xMidYMid meet"
                    onChange={(paths) => setHasStrokes(paths.length > 0)}
                />
                {!hasStrokes && !traceImage && <p className="canvas-hint">Draw the outline of your building here</p>}
            </div>
            {(generation.isLoading || generation.error || generation.images.length > 0) && (
                <ResultsPanel {...generation} compareWith={submittedSketch} placeholder={null} />
            )}
        </div>
    );

    return (
        <Workspace
            title="Sketch to Image"
            description="Draw rough lines and ControlNet turns them into a detailed drawing that keeps your composition."
            wideOutput
            controls={
                <GenerationControls
                    value={settings}
                    onChange={setSettings}
                    onSubmit={handleSubmit}
                    isLoading={generation.isLoading}
                    canSubmit={hasStrokes}
                    submitLabel={hasStrokes ? 'Generate from sketch' : 'Draw something first'}
                    textLabel="What did you draw?"
                    textPlaceholder="e.g. a two storey concrete house with a flat roof and large windows"
                    showSize={false}
                />
            }
            output={canvas}
        />
    );
};

export default SketchImage;
