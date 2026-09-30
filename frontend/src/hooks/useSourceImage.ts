import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { readFileAsDataUrl, urlToFile } from '../lib/files';

/**
 * Holds the input image of image-to-image style modes.
 * Pages can be opened with { state: { sourceUrl } } to start from an existing image.
 */
export function useSourceImage() {
    const location = useLocation();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const selectFile = async (newFile: File | null) => {
        setFile(newFile);
        setError('');
        setPreview(newFile ? await readFileAsDataUrl(newFile) : '');
    };

    const sourceUrl = (location.state as { sourceUrl?: string } | null)?.sourceUrl;

    useEffect(() => {
        if (!sourceUrl) return;
        let cancelled = false;
        setIsLoading(true);
        urlToFile(sourceUrl)
            .then(async (loaded) => {
                if (cancelled) return;
                setFile(loaded);
                setPreview(await readFileAsDataUrl(loaded));
            })
            .catch(() => !cancelled && setError('Could not load that image. Try downloading and uploading it instead.'))
            .finally(() => !cancelled && setIsLoading(false));
        return () => { cancelled = true; };
    }, [sourceUrl]);

    return { file, preview, isLoading, error, selectFile };
}
