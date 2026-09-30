import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import { requestGeneration } from '../lib/api';
import { buildPrompt, createDefaultSettings } from '../lib/prompt';
import { useGeneration } from '../hooks/useGeneration';
import GenerationControls from './GenerateImage/GenerationControls';
import ResultsPanel from './GenerateImage/ResultsPanel';
import './GlobalSearchModal.css'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Quick text-to-image generation from anywhere in the app (the "Imagine..." button / Ctrl+K)
const GlobalSearchModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const { isAuthenticated, user, loginWithRedirect } = useAuth0();
    const [settings, setSettings] = useState(() => createDefaultSettings());
    const generation = useGeneration();
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        dialogRef.current?.querySelector<HTMLElement>('textarea, button')?.focus();
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = () => generation.run(() =>
        requestGeneration('/stableDiffusion/', settings, { ownerId: user?.sub, includeSize: true })
    );

    const hasOutput = generation.isLoading || generation.error || generation.images.length > 0;

    return (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <div className={`modal ${hasOutput ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="quick-generate-title" ref={dialogRef}>
                <header className="modal-header">
                    <h2 id="quick-generate-title">Imagine…</h2>
                    <button className="icon-btn" onClick={onClose} aria-label="Close">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </header>
                {!isAuthenticated ? (
                    <div className="modal-signin">
                        <img src="/assetImages/Software-integration-01.svg" alt="" />
                        <p>Sign in to generate architectural sketches with AI.</p>
                        <button className="btn btn-primary" onClick={() => loginWithRedirect()}>Log in or sign up</button>
                    </div>
                ) : (
                    <div className="modal-body">
                        <div className="modal-controls">
                            <GenerationControls
                                value={settings}
                                onChange={setSettings}
                                onSubmit={handleSubmit}
                                isLoading={generation.isLoading}
                                compact
                            />
                            <Link
                                className="btn-link"
                                to={`/generate?prompt=${encodeURIComponent(settings.text)}`}
                                onClick={onClose}
                            >
                                Open the full editor <FontAwesomeIcon icon={faArrowRight} />
                            </Link>
                        </div>
                        {hasOutput && (
                            <div className="modal-output">
                                <ResultsPanel {...generation} placeholder={null} />
                                {generation.images.length > 0 && <p className="muted small">{buildPrompt(settings)}</p>}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlobalSearchModal;
