import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../lib/api';
import { StoredImage } from '../types';

// Tracks one image generation request: results, loading state, error and elapsed time
export function useGeneration() {
    const [images, setImages] = useState<StoredImage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [elapsed, setElapsed] = useState(0);
    const timer = useRef<number>();

    useEffect(() => () => window.clearInterval(timer.current), []);

    const run = useCallback(async (task: () => Promise<StoredImage[]>) => {
        setIsLoading(true);
        setError('');
        setElapsed(0);
        const startedAt = Date.now();
        timer.current = window.setInterval(() => setElapsed(Math.round((Date.now() - startedAt) / 1000)), 1000);
        try {
            const result = await task();
            if (!result.length) throw new Error('The model did not return any images. Try adjusting your prompt.');
            setImages(result);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            window.clearInterval(timer.current);
            setIsLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setImages([]);
        setError('');
    }, []);

    return { images, isLoading, error, elapsed, run, reset };
}
