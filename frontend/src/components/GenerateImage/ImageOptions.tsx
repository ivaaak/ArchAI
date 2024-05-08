import React, { useEffect, useState } from 'react';
import '../../App.css';

interface ImageOptionsProps {
    onImageOptionsChange: (imagesOptions: { count: string; res: string }) => void;
}

const ImageOptions: React.FC<ImageOptionsProps> = ({ onImageOptionsChange }) => {
    const [imagesOptions, setImagesOptions] = useState({ count: "1", res: "1024x1024" });

    const imageCountOptions = ['1', '2', '3', '4'];
    const imageResOptions = ['1024x1024', '500x500', '256x256'];

    useEffect(() => {
        onImageOptionsChange(imagesOptions);
    }, [imagesOptions]);

    const handleImagesCountOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setImagesOptions({...imagesOptions, count: e.target.value });
    };

    const handleImageResOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setImagesOptions({...imagesOptions, res: e.target.value });
    };

    return (
        <>Generate
            <select value={imagesOptions.count} onChange={handleImagesCountOption}>
                {imageCountOptions.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            Image{imagesOptions.count!== '1' && <>s</>} sized :
            <select value={imagesOptions.res} onChange={handleImageResOption}>
                {imageResOptions.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </>
    );
};

export default ImageOptions;
