import { loadImage } from './files';

function canvasToBlob(canvas: HTMLCanvasElement, type = 'image/png', quality?: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not process the image'))), type, quality);
    });
}

/**
 * Scales an image down so its longest side is at most maxSide (SDXL works at ~1024px;
 * huge inputs are slow and costly) and rounds the size to a multiple of 8 as the model expects.
 */
export async function resizeForModel(src: string, maxSide = 1536) {
    const img = await loadImage(src);
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const width = Math.max(8, Math.round((img.naturalWidth * scale) / 8) * 8);
    const height = Math.max(8, Math.round((img.naturalHeight * scale) / 8) * 8);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
    return { blob: await canvasToBlob(canvas), width, height };
}

/**
 * Rasterises an SVG exported by react-sketch-canvas (exportSvg). Unlike exportImage, exportSvg
 * leaves out the background image and paints the canvas color instead, so only the strokes remain.
 */
async function renderSvg(svg: string, width?: number, height?: number) {
    const img = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
    const canvas = document.createElement('canvas');
    canvas.width = width ?? img.naturalWidth;
    canvas.height = height ?? img.naturalHeight;
    const context = canvas.getContext('2d')!;
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    return { canvas, context };
}

// A drawing as a PNG, on its canvas color and without any trace image
export async function svgToPng(svg: string) {
    const { canvas } = await renderSvg(svg);
    return { blob: await canvasToBlob(canvas), dataUrl: canvas.toDataURL('image/png') };
}

/**
 * Converts the painted strokes (drawn on a black canvas) into an inpainting mask of the given size:
 * painted pixels become pure white (re-generate), everything else pure black (keep).
 */
export async function createMask(strokesSvg: string, width: number, height: number): Promise<Blob> {
    const { canvas, context } = await renderSvg(strokesSvg, width, height);

    const pixels = context.getImageData(0, 0, width, height);
    const data = pixels.data;
    for (let i = 0; i < data.length; i += 4) {
        const value = data[i] + data[i + 1] + data[i + 2] > 60 ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = value;
        data[i + 3] = 255;
    }
    context.putImageData(pixels, 0, 0);
    return canvasToBlob(canvas);
}
