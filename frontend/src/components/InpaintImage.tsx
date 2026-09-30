import { useEffect, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faPaintbrush, faRotateLeft, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { requestGeneration } from '../lib/api';
import { createDefaultSettings } from '../lib/prompt';
import { loadImage } from '../lib/files';
import { createMask, resizeForModel } from '../lib/imageProcessing';
import { useGeneration } from '../hooks/useGeneration';
import { useSourceImage } from '../hooks/useSourceImage';
import GenerationControls from './GenerateImage/GenerationControls';
import ResultsPanel from './GenerateImage/ResultsPanel';
import Workspace from './GenerateImage/Workspace';
import ImageDropzone from './ImageDropzone';
import './SketchCanvas.css';

// Semi-transparent so the image stays visible under the painted area
const MASK_COLOR = 'rgba(145, 227, 169, 0.7)';

const InpaintImage = () => {
    const { user } = useAuth0();
    const source = useSourceImage();
    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const [settings, setSettings] = useState(() => createDefaultSettings());
    const [brushSize, setBrushSize] = useState(36);
    const [isErasing, setIsErasing] = useState(false);
    const [hasMask, setHasMask] = useState(false);
    const [aspectRatio, setAspectRatio] = useState(1);
    const generation = useGeneration();

    useEffect(() => {
        if (!source.preview) return;
        loadImage(source.preview).then((img) => setAspectRatio(img.naturalWidth / img.naturalHeight)).catch(() => setAspectRatio(1));
    }, [source.preview]);

    const toggleEraser = () => {
        canvasRef.current?.eraseMode(!isErasing);
        setIsErasing(!isErasing);
    };

    const handleSubmit = () => generation.run(async () => {
        if (!source.preview) throw new Error('Upload an image first.');
        const image = await resizeForModel(source.preview);
        // exportSvg (unlike exportImage) leaves out the background image: just the strokes on the black canvas color
        const strokes = await canvasRef.current!.exportSvg();
        const mask = await createMask(strokes, image.width, image.height);
        return requestGeneration('/stableDiffusion/inpaint', settings, {
            ownerId: user?.sub,
            image: image.blob,
            mask,
        });
    });

    const clearImage = () => {
        source.selectFile(null);
        generation.reset();
        setHasMask(false);
    };

    const output = source.preview ? (
        <div className="sketch-area">
            <div className="canvas-toolbar" role="toolbar" aria-label="Mask tools">
                <div className="segmented">
                    <button type="button" className={!isErasing ? 'active' : ''} aria-pressed={!isErasing} onClick={() => isErasing && toggleEraser()} title="Paint the area to change">
                        <FontAwesomeIcon icon={faPaintbrush} /> Paint
                    </button>
                    <button type="button" className={isErasing ? 'active' : ''} aria-pressed={isErasing} onClick={() => !isErasing && toggleEraser()} title="Erase paint">
                        <FontAwesomeIcon icon={faEraser} /> Erase
                    </button>
                </div>
                <label className="brush-size" title="Brush size">
                    <span className="muted small">Size</span>
                    <input type="range" min={8} max={120} value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} />
                </label>
                <div className="toolbar-spacer" />
                <button type="button" className="icon-btn" onClick={() => canvasRef.current?.undo()} title="Undo" aria-label="Undo">
                    <FontAwesomeIcon icon={faRotateLeft} />
                </button>
                <button type="button" className="icon-btn" onClick={() => canvasRef.current?.clearCanvas()} title="Clear mask" aria-label="Clear mask">
                    <FontAwesomeIcon icon={faTrashCan} />
                </button>
                <button type="button" className="icon-btn" onClick={clearImage} title="Use another image" aria-label="Use another image">
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>
            <div className="canvas-frame" style={{ aspectRatio, maxWidth: `calc(72vh * ${aspectRatio})` }}>
                <ReactSketchCanvas
                    ref={canvasRef}
                    className="sketch-canvas"
                    width="100%"
                    height="100%"
                    strokeWidth={brushSize}
                    eraserWidth={brushSize}
                    strokeColor={MASK_COLOR}
                    canvasColor="#000000"
                    backgroundImage={source.preview}
                    exportWithBackgroundImage={false}
                    preserveBackgroundImageAspectRatio="none"
                    onChange={(paths) => setHasMask(paths.some((path) => path.drawMode))}
                />
            </div>
            {(generation.isLoading || generation.error || generation.images.length > 0) && (
                <ResultsPanel {...generation} compareWith={source.preview} placeholder={null} />
            )}
        </div>
    ) : (
        <div className="results-status">
            {source.isLoading ? <span className="spinner spinner-large" aria-label="Loading image" /> : (
                <ImageDropzone onFile={source.selectFile} title="Drop the image you want to edit" />
            )}
            {source.error && <p className="form-error" role="alert">{source.error}</p>}
        </div>
    );

    return (
        <Workspace
            title="In-Painting"
            description="Paint over part of an image and describe what should appear there. Everything else stays untouched."
            wideOutput
            controls={
                <GenerationControls
                    value={settings}
                    onChange={setSettings}
                    onSubmit={handleSubmit}
                    isLoading={generation.isLoading}
                    canSubmit={Boolean(source.file) && hasMask}
                    submitLabel={!source.file ? 'Upload an image first' : hasMask ? 'Repaint selected area' : 'Paint the area to change'}
                    textLabel="What should appear in the painted area?"
                    textPlaceholder="e.g. a green roof terrace with trees"
                    showSize={false}
                />
            }
            output={output}
        />
    );
};

export default InpaintImage;
