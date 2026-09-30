import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { getPreferences, setPreferences } from '../../lib/storage';

const DEFAULT_STYLES = [
    'Angular', 'Sharp', 'Smooth', 'Paper', 'Minimalist', 'Detailed',
    'Outline', 'Shaded', 'Geometric', 'Textured', 'Depth of Field',
];

interface PromptsMenuProps {
    selected: string[];
    onChange: (selectedPrompts: string[]) => void;
}

const PromptsMenu: React.FC<PromptsMenuProps> = ({ selected, onChange }) => {
    const [customStyles, setCustomStyles] = useState(() => getPreferences().customStyles);
    const [isAdding, setIsAdding] = useState(false);
    const [newStyle, setNewStyle] = useState('');

    const toggle = (style: string) => {
        onChange(selected.includes(style) ? selected.filter((s) => s !== style) : [...selected, style]);
    };

    const saveCustomStyles = (styles: string[]) => {
        setCustomStyles(styles);
        setPreferences({ ...getPreferences(), customStyles: styles });
    };

    const addCustomStyle = (event: React.FormEvent) => {
        event.preventDefault();
        const style = newStyle.trim();
        if (style && !DEFAULT_STYLES.includes(style) && !customStyles.includes(style)) {
            saveCustomStyles([...customStyles, style]);
            onChange([...selected, style]);
        }
        setNewStyle('');
        setIsAdding(false);
    };

    const removeCustomStyle = (style: string) => {
        saveCustomStyles(customStyles.filter((s) => s !== style));
        onChange(selected.filter((s) => s !== style));
    };

    return (
        <div className="chip-group" role="group" aria-label="Style keywords">
            {[...DEFAULT_STYLES, ...customStyles].map((style) => {
                const isCustom = customStyles.includes(style);
                const isSelected = selected.includes(style);
                return (
                    <span key={style} className={`chip ${isSelected ? 'selected' : ''} ${isCustom ? 'custom' : ''}`}>
                        <button type="button" aria-pressed={isSelected} onClick={() => toggle(style)}>
                            {style}
                        </button>
                        {isCustom && (
                            <button type="button" className="chip-remove" aria-label={`Remove ${style}`} onClick={() => removeCustomStyle(style)}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        )}
                    </span>
                );
            })}
            {isAdding ? (
                <form className="chip-form" onSubmit={addCustomStyle}>
                    <input
                        autoFocus
                        value={newStyle}
                        onChange={(e) => setNewStyle(e.target.value)}
                        onBlur={() => !newStyle && setIsAdding(false)}
                        onKeyDown={(e) => e.key === 'Escape' && setIsAdding(false)}
                        placeholder="Your keyword"
                        maxLength={40}
                    />
                </form>
            ) : (
                <button type="button" className="chip chip-add" onClick={() => setIsAdding(true)}>
                    <FontAwesomeIcon icon={faPlus} /> Custom
                </button>
            )}
        </div>
    );
};

export default PromptsMenu;
