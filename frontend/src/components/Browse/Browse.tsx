import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faDownload, faLink, faMagnifyingGlass, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { resolveImageUrl } from '../../config';
import { apiClient, getErrorMessage } from '../../lib/api';
import { copyToClipboard, downloadImage } from '../../lib/files';
import { COLLECTION_ROUTES, MODE_LABELS, displayPrompt } from '../../lib/labels';
import { ImageMode, StoredImage } from '../../types';
import Tabs from '../Tabs';
import './Browse.css';

const PAGE_SIZE = 24;

const Browse = () => {
    const { isAuthenticated, user } = useAuth0();
    const navigate = useNavigate();
    const [images, setImages] = useState<StoredImage[]>([]);
    const [total, setTotal] = useState(0);
    const [scope, setScope] = useState<'all' | 'mine'>('all');
    const [mode, setMode] = useState<ImageMode | ''>('');
    const [search, setSearch] = useState('');
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [copiedId, setCopiedId] = useState('');

    // Debounce the search box
    useEffect(() => {
        const timeout = setTimeout(() => setQuery(search), 300);
        return () => clearTimeout(timeout);
    }, [search]);

    const fetchImages = useCallback(async (skip: number) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await apiClient.get<{ images: StoredImage[]; total: number }>('/image', {
                params: {
                    limit: PAGE_SIZE,
                    skip,
                    q: query || undefined,
                    mode: mode || undefined,
                    ownerId: scope === 'mine' ? user?.sub : undefined,
                },
            });
            setImages((previous) => (skip === 0 ? response.data.images : [...previous, ...response.data.images]));
            setTotal(response.data.total);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    }, [query, mode, scope, user?.sub]);

    useEffect(() => {
        fetchImages(0);
    }, [fetchImages]);

    const shareImage = async (image: StoredImage) => {
        const url = image._id ? `${window.location.origin}/details/${image._id}` : resolveImageUrl(image);
        if (await copyToClipboard(url)) {
            setCopiedId(image._id || '');
            setTimeout(() => setCopiedId(''), 1500);
        }
    };

    const deleteImage = async (image: StoredImage) => {
        if (!image._id || !window.confirm('Delete this image from your collection?')) return;
        try {
            await apiClient.delete(`/image/${image._id}`, { params: { ownerId: user?.sub } });
            setImages((previous) => previous.filter((i) => i._id !== image._id));
            setTotal((previous) => previous - 1);
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    return (
        <div className="page">
            <Tabs routes={COLLECTION_ROUTES} label="Collections" />

            <div className="gallery-toolbar">
                {isAuthenticated && (
                    <div className="segmented" role="radiogroup" aria-label="Whose images">
                        <button className={scope === 'all' ? 'active' : ''} aria-checked={scope === 'all'} role="radio" onClick={() => setScope('all')}>All</button>
                        <button className={scope === 'mine' ? 'active' : ''} aria-checked={scope === 'mine'} role="radio" onClick={() => setScope('mine')}>Mine</button>
                    </div>
                )}
                <select value={mode} onChange={(e) => setMode(e.target.value as ImageMode | '')} aria-label="Filter by mode">
                    <option value="">All modes</option>
                    {Object.entries(MODE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
                <label className="search-field">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input type="search" placeholder="Search prompts" value={search} onChange={(e) => setSearch(e.target.value)} />
                </label>
                <span className="muted small gallery-count">{total} image{total === 1 ? '' : 's'}</span>
            </div>

            {error && <p className="alert alert-error" role="alert">{error}</p>}

            {!isLoading && !error && images.length === 0 && (
                <div className="empty-state">
                    <img src="/assetImages/Meeting-01.svg" alt="" />
                    <h2>No images yet</h2>
                    <p className="muted">
                        {query || mode || scope === 'mine' ? 'Nothing matches these filters.' : 'Generated images are saved here automatically.'}
                    </p>
                    <Link className="btn btn-primary" to="/generate">Generate an image</Link>
                </div>
            )}

            <div className="gallery-grid">
                {images.map((image) => {
                    const src = resolveImageUrl(image);
                    const isOwner = Boolean(user?.sub && image.ownerId === user.sub);
                    return (
                        <article key={image._id} className="gallery-card">
                            <button className="gallery-card-image" onClick={() => image._id && navigate(`/details/${image._id}`)} aria-label="View details">
                                <img src={src} alt={displayPrompt(image) || 'Generated image'} loading="lazy" />
                            </button>
                            <div className="gallery-card-body">
                                {image.mode && <span className="badge">{MODE_LABELS[image.mode]}</span>}
                                <p className="gallery-card-prompt" title={image.prompt}>{displayPrompt(image) || 'Untitled'}</p>
                            </div>
                            <div className="gallery-card-actions">
                                <button className="icon-btn" onClick={() => downloadImage(src, `archai-${image._id}.png`)} title="Download" aria-label="Download">
                                    <FontAwesomeIcon icon={faDownload} />
                                </button>
                                <button className="icon-btn" onClick={() => shareImage(image)} title="Copy link" aria-label="Copy link">
                                    <FontAwesomeIcon icon={copiedId && copiedId === image._id ? faCheck : faLink} />
                                </button>
                                {isOwner && (
                                    <button className="icon-btn icon-btn-danger" onClick={() => deleteImage(image)} title="Delete" aria-label="Delete">
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </button>
                                )}
                            </div>
                        </article>
                    );
                })}
            </div>

            {isLoading && <div className="gallery-loading"><span className="spinner spinner-large" aria-label="Loading images" /></div>}
            {!isLoading && images.length < total && (
                <div className="gallery-loading">
                    <button className="btn" onClick={() => fetchImages(images.length)}>Load more</button>
                </div>
            )}
        </div>
    );
};

export default Browse;
