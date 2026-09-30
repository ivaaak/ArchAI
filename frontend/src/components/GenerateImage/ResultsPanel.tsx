import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faDownload, faPaintbrush, faRotate, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { ImgComparisonSlider } from '@img-comparison-slider/react';
import { resolveImageUrl } from '../../config';
import { downloadImage } from '../../lib/files';
import { StoredImage } from '../../types';
import './ResultsPanel.css';

interface ResultsPanelProps {
    images: StoredImage[];
    isLoading: boolean;
    error?: string;
    elapsed?: number;
    // Shown before anything has been generated
    placeholder: React.ReactNode;
    // Source image to compare the result against (image-to-image, sketch, inpainting)
    compareWith?: string;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ images, isLoading, error, elapsed = 0, placeholder, compareWith }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => setSelectedIndex(0), [images]);

    if (isLoading) {
        return (
            <div className="results-panel results-status" aria-live="polite">
                <div className="generation-loader" aria-hidden>
                    <span /><span /><span /><span />
                </div>
                <p className="results-status-title">Generating… {elapsed > 0 && `${elapsed}s`}</p>
                <p className="muted">This usually takes 10–40 seconds.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="results-panel results-status" role="alert">
                <FontAwesomeIcon icon={faTriangleExclamation} className="results-error-icon" />
                <p className="results-status-title">Generation failed</p>
                <p className="muted">{error}</p>
            </div>
        );
    }

    if (!images.length) {
        return <div className="results-panel results-status">{placeholder}</div>;
    }

    const selected = images[Math.min(selectedIndex, images.length - 1)];
    const selectedUrl = resolveImageUrl(selected);

    return (
        <div className="results-panel">
            <div className="result-main">
                {compareWith ? (
                    <ImgComparisonSlider className="result-compare">
                        <img slot="first" src={compareWith} alt="Original" />
                        <img slot="second" src={selectedUrl} alt="Generated result" />
                    </ImgComparisonSlider>
                ) : (
                    <img className="result-image" src={selectedUrl} alt={selected.prompt || 'Generated image'} />
                )}
            </div>
            {compareWith && <p className="muted result-hint">Drag the slider to compare with the original</p>}

            {images.length > 1 && (
                <div className="result-thumbnails" role="tablist" aria-label="Generated images">
                    {images.map((image, index) => (
                        <button
                            key={image._id || index}
                            role="tab"
                            aria-selected={index === selectedIndex}
                            className={index === selectedIndex ? 'active' : ''}
                            onClick={() => setSelectedIndex(index)}
                        >
                            <img src={resolveImageUrl(image)} alt={`Result ${index + 1}`} />
                        </button>
                    ))}
                </div>
            )}

            <div className="result-actions">
                <button className="btn" onClick={() => downloadImage(selectedUrl, `archai-${selected._id || Date.now()}.png`)}>
                    <FontAwesomeIcon icon={faDownload} /> Download
                </button>
                <button className="btn" onClick={() => navigate('/upload', { state: { sourceUrl: selectedUrl } })}>
                    <FontAwesomeIcon icon={faRotate} /> Refine
                </button>
                <button className="btn" onClick={() => navigate('/inpaint', { state: { sourceUrl: selectedUrl } })}>
                    <FontAwesomeIcon icon={faPaintbrush} /> Edit region
                </button>
                {selected._id && (
                    <Link className="btn" to={`/details/${selected._id}`}>
                        <FontAwesomeIcon icon={faCircleInfo} /> Details
                    </Link>
                )}
            </div>
            {!selected._id && (
                <p className="muted result-hint">
                    This image could not be saved to your collection. Download it now: the link expires in about an hour.
                </p>
            )}
        </div>
    );
};

export default ResultsPanel;
