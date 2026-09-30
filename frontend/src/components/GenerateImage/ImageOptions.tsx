import React from 'react';
import { ImageOptionsValue } from '../../types';

// SDXL is trained on ~1 megapixel images; these are its native aspect ratios
const IMAGE_SIZES: { value: string; label: string }[] = [
    { value: '1024x1024', label: 'Square · 1:1' },
    { value: '1216x832', label: 'Landscape · 3:2' },
    { value: '832x1216', label: 'Portrait · 2:3' },
    { value: '1344x768', label: 'Wide · 16:9' },
    { value: '768x1344', label: 'Tall · 9:16' },
];

const IMAGE_COUNTS = [1, 2, 3, 4];

interface ImageOptionsProps {
    value: ImageOptionsValue;
    onChange: (options: ImageOptionsValue) => void;
    showSize?: boolean;
}

const ImageOptions: React.FC<ImageOptionsProps> = ({ value, onChange, showSize = true }) => {
    return (
        <div className="image-options">
            <div className="field">
                <span className="field-label" id="image-count-label">Images</span>
                <div className="segmented" role="radiogroup" aria-labelledby="image-count-label">
                    {IMAGE_COUNTS.map((count) => (
                        <button
                            key={count}
                            type="button"
                            role="radio"
                            aria-checked={value.count === count}
                            className={value.count === count ? 'active' : ''}
                            onClick={() => onChange({ ...value, count })}
                        >
                            {count}
                        </button>
                    ))}
                </div>
            </div>
            {showSize && (
                <label className="field">
                    <span className="field-label">Format</span>
                    <select value={value.size} onChange={(e) => onChange({ ...value, size: e.target.value })}>
                        {IMAGE_SIZES.map(({ value: size, label }) => (
                            <option key={size} value={size}>{label}</option>
                        ))}
                    </select>
                </label>
            )}
        </div>
    );
};

export default ImageOptions;
