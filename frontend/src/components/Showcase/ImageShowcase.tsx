import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft, faCheck, faCopy, faDownload, faExpand, faLink, faPaintbrush, faRotate, faTrashCan, faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';
import { ImgComparisonSlider } from '@img-comparison-slider/react';
import { resolveImageUrl } from '../../config';
import { apiClient, getErrorMessage } from '../../lib/api';
import { copyToClipboard, downloadImage } from '../../lib/files';
import { MODE_LABELS, displayPrompt, formatDate } from '../../lib/labels';
import { StoredImage } from '../../types';
import './ImageShowcase.css';

const HIDDEN_PARAMETERS = new Set(['text', 'styles']);

const ImageShowcase = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth0();
    const [image, setImage] = useState<StoredImage | null>(null);
    const [error, setError] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [copied, setCopied] = useState('');

    useEffect(() => {
        setImage(null);
        setError('');
        apiClient.get<StoredImage>(`/image/${id}`)
            .then((response) => setImage(response.data))
            .catch((err) => setError(getErrorMessage(err)));
    }, [id]);

    useEffect(() => {
        if (!isFullscreen) return;
        const close = (event: KeyboardEvent) => event.key === 'Escape' && setIsFullscreen(false);
        document.addEventListener('keydown', close);
        return () => document.removeEventListener('keydown', close);
    }, [isFullscreen]);

    const copy = async (key: string, text: string) => {
        if (await copyToClipboard(text)) {
            setCopied(key);
            setTimeout(() => setCopied(''), 1500);
        }
    };

    if (error) {
        return (
            <div className="page empty-state">
                <h1>Image not found</h1>
                <p className="muted">{error}</p>
                <Link className="btn" to="/browse">Back to collections</Link>
            </div>
        );
    }

    if (!image) {
        return <div className="page gallery-loading"><span className="spinner spinner-large" aria-label="Loading image" /></div>;
    }

    const src = resolveImageUrl(image);
    const prompt = displayPrompt(image);
    const isOwner = Boolean(user?.sub && image.ownerId === user.sub);
    const parameters = Object.entries(image.parameters ?? {}).filter(([key, value]) => !HIDDEN_PARAMETERS.has(key) && value !== '' && value != null);
    const styles = Array.isArray(image.parameters?.styles) ? (image.parameters.styles as string[]) : [];

    const deleteImage = async () => {
        if (!window.confirm('Delete this image from your collection?')) return;
        try {
            await apiClient.delete(`/image/${image._id}`, { params: { ownerId: user?.sub } });
            navigate('/browse');
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    return (
        <div className="page">
            <button className="btn-link back-link" onClick={() => navigate(-1)}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back
            </button>
            <div className="details-layout">
                <div className="details-media panel">
                    {image.sourceImageUrl ? (
                        <ImgComparisonSlider className="details-compare">
                            <img slot="first" src={resolveImageUrl(image.sourceImageUrl)} alt="Original input" />
                            <img slot="second" src={src} alt={prompt || 'Generated image'} />
                        </ImgComparisonSlider>
                    ) : (
                        <img className="details-image" src={src} alt={prompt || 'Generated image'} onClick={() => setIsFullscreen(true)} />
                    )}
                    <button className="icon-btn details-expand" onClick={() => setIsFullscreen(true)} aria-label="View full size" title="View full size">
                        <FontAwesomeIcon icon={faExpand} />
                    </button>
                </div>

                <aside className="details-info panel">
                    <div className="details-meta">
                        {image.mode && <span className="badge">{MODE_LABELS[image.mode]}</span>}
                        {image.createdAt && <span className="muted small">{formatDate(image.createdAt)}</span>}
                    </div>

                    <section>
                        <div className="field-label-row">
                            <h2 className="details-heading">Prompt</h2>
                            {image.prompt && (
                                <button className="btn-link" onClick={() => copy('prompt', image.prompt!)}>
                                    <FontAwesomeIcon icon={copied === 'prompt' ? faCheck : faCopy} /> {copied === 'prompt' ? 'Copied' : 'Copy'}
                                </button>
                            )}
                        </div>
                        <p className="details-prompt">{prompt || <span className="muted">No prompt recorded</span>}</p>
                        {styles.length > 0 && (
                            <div className="tag-list">{styles.map((style) => <span key={style} className="badge">{style}</span>)}</div>
                        )}
                    </section>

                    {image.negativePrompt && (
                        <section>
                            <h2 className="details-heading">Negative prompt</h2>
                            <p className="muted">{image.negativePrompt}</p>
                        </section>
                    )}

                    {parameters.length > 0 && (
                        <section>
                            <h2 className="details-heading">Parameters</h2>
                            <dl className="details-parameters">
                                {parameters.map(([key, value]) => (
                                    <div key={key}>
                                        <dt>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</dt>
                                        <dd>{String(value)}</dd>
                                    </div>
                                ))}
                            </dl>
                        </section>
                    )}

                    <div className="details-actions">
                        <button className="btn btn-primary" onClick={() => downloadImage(src, `archai-${image._id}.png`)}>
                            <FontAwesomeIcon icon={faDownload} /> Download
                        </button>
                        {prompt && (
                            <Link className="btn" to={`/generate?prompt=${encodeURIComponent(prompt)}`}>
                                <FontAwesomeIcon icon={faWandMagicSparkles} /> Remix prompt
                            </Link>
                        )}
                        <button className="btn" onClick={() => navigate('/upload', { state: { sourceUrl: src } })}>
                            <FontAwesomeIcon icon={faRotate} /> Refine
                        </button>
                        <button className="btn" onClick={() => navigate('/inpaint', { state: { sourceUrl: src } })}>
                            <FontAwesomeIcon icon={faPaintbrush} /> Edit region
                        </button>
                        <button className="btn" onClick={() => copy('link', window.location.href)}>
                            <FontAwesomeIcon icon={copied === 'link' ? faCheck : faLink} /> {copied === 'link' ? 'Link copied' : 'Copy link'}
                        </button>
                        {isOwner && (
                            <button className="btn btn-danger" onClick={deleteImage}>
                                <FontAwesomeIcon icon={faTrashCan} /> Delete
                            </button>
                        )}
                    </div>
                </aside>
            </div>

            {isFullscreen && (
                <div className="lightbox" onClick={() => setIsFullscreen(false)} role="dialog" aria-label="Full size image">
                    <img src={src} alt={prompt || 'Generated image'} />
                </div>
            )}
        </div>
    );
};

export default ImageShowcase;
