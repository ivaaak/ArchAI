import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';

const MAX_SIZE_MB = 20;

interface ImageDropzoneProps {
    onFile: (file: File) => void;
    title?: string;
    hint?: string;
}

// Accepts an image by drag and drop, file picker, or pasting from the clipboard
const ImageDropzone: React.FC<ImageDropzoneProps> = ({
    onFile,
    title = 'Drop an image here',
    hint = 'or click to browse · paste with Ctrl+V · PNG, JPG or WEBP',
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');

    const accept = (file: File | undefined | null) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('That file is not an image.');
            return;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setError(`Images must be smaller than ${MAX_SIZE_MB} MB.`);
            return;
        }
        setError('');
        onFile(file);
    };

    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            const file = Array.from(event.clipboardData?.files ?? []).find((f) => f.type.startsWith('image/'));
            if (file) accept(file);
        };
        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className={`dropzone ${isDragging ? 'dragging' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                accept(e.dataTransfer.files[0]);
            }}
        >
            <FontAwesomeIcon icon={faCloudArrowUp} className="dropzone-icon" />
            <p className="dropzone-title">{title}</p>
            <p className="muted">{hint}</p>
            {error && <p className="form-error" role="alert">{error}</p>}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                    accept(e.target.files?.[0]);
                    e.target.value = '';
                }}
            />
        </div>
    );
};

export default ImageDropzone;
