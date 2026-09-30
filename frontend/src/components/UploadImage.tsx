import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons';
import { apiClient, getErrorMessage, requestGeneration } from '../lib/api';
import { createDefaultSettings } from '../lib/prompt';
import { resizeForModel } from '../lib/imageProcessing';
import { useGeneration } from '../hooks/useGeneration';
import { useSourceImage } from '../hooks/useSourceImage';
import GenerationControls from './GenerateImage/GenerationControls';
import ResultsPanel from './GenerateImage/ResultsPanel';
import Workspace from './GenerateImage/Workspace';
import ImageDropzone from './ImageDropzone';

const UploadImage = () => {
    const { user } = useAuth0();
    const source = useSourceImage();
    const [settings, setSettings] = useState(() => createDefaultSettings());
    // How far the model may move away from the uploaded image
    const [strength, setStrength] = useState(0.65);
    const [saveStatus, setSaveStatus] = useState('');
    const generation = useGeneration();

    const handleSubmit = () => generation.run(async () => {
        const image = await resizeForModel(source.preview);
        return requestGeneration('/stableDiffusion/imageToImage', settings, {
            ownerId: user?.sub,
            image: image.blob,
            promptStrength: strength,
        });
    });

    const saveToCollection = async () => {
        if (!source.file) return;
        setSaveStatus('Saving…');
        try {
            const form = new FormData();
            form.append('image', source.file);
            if (user?.sub) form.append('ownerId', user.sub);
            if (settings.text.trim()) form.append('description', settings.text.trim());
            await apiClient.post('/image', form);
            setSaveStatus('Saved to your collection');
        } catch (error) {
            setSaveStatus(getErrorMessage(error));
        }
    };

    const clearImage = () => {
        source.selectFile(null);
        generation.reset();
        setSaveStatus('');
    };

    const controls = (
        <>
            {source.preview && (
                <div className="source-card">
                    <img src={source.preview} alt="Uploaded input" />
                    <div className="source-card-body">
                        <p className="source-card-title">{source.file?.name || 'Input image'}</p>
                        <div className="source-card-actions">
                            <button type="button" className="btn btn-small" onClick={saveToCollection}>
                                <FontAwesomeIcon icon={faFloppyDisk} /> Save
                            </button>
                            <button type="button" className="btn btn-small btn-ghost" onClick={clearImage}>
                                <FontAwesomeIcon icon={faXmark} /> Remove
                            </button>
                        </div>
                        {saveStatus && <p className="muted small">{saveStatus}</p>}
                    </div>
                </div>
            )}
            <GenerationControls
                value={settings}
                onChange={setSettings}
                onSubmit={handleSubmit}
                isLoading={generation.isLoading}
                canSubmit={Boolean(source.file)}
                submitLabel={source.file ? 'Transform image' : 'Upload an image first'}
                textLabel="How should the image change?"
                textPlaceholder="e.g. turn into a watercolor rendering with warm evening light"
                showSize={false}
            >
                <label className="field">
                    <span className="field-label-row">
                        <span className="field-label">Transformation strength</span>
                        <span className="muted small">{Math.round(strength * 100)}%</span>
                    </span>
                    <input
                        type="range"
                        min={0.3}
                        max={0.95}
                        step={0.05}
                        value={strength}
                        onChange={(e) => setStrength(Number(e.target.value))}
                    />
                    <span className="range-labels muted small"><span>Keep the layout</span><span>Reimagine</span></span>
                </label>
            </GenerationControls>
        </>
    );

    const output = source.preview ? (
        <ResultsPanel
            {...generation}
            compareWith={source.preview}
            placeholder={
                <>
                    <img className="source-preview" src={source.preview} alt="Uploaded input" />
                    <p className="muted">Describe the change on the left, then press Transform image.</p>
                </>
            }
        />
    ) : (
        <div className="results-status">
            {source.isLoading ? <span className="spinner spinner-large" aria-label="Loading image" /> : (
                <ImageDropzone onFile={source.selectFile} title="Drop a sketch, photo or render" />
            )}
            {source.error && <p className="form-error" role="alert">{source.error}</p>}
        </div>
    );

    return (
        <Workspace
            title="Image to Image"
            description="Upload a sketch, photo or render and restyle it while keeping its composition."
            controls={controls}
            output={output}
        />
    );
};

export default UploadImage;
