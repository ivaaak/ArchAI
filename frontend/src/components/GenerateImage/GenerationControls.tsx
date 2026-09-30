import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faCheck, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { GenerationSettings } from '../../types';
import { EMPTY_PARAMETERS, buildPrompt, hasPromptContent } from '../../lib/prompt';
import { getSavedPrompts, savePrompt } from '../../lib/storage';
import PromptsMenu from './PromptMenu';
import ImageGenerationParameters from './ImageGenerationParameters';
import ImageOptions from './ImageOptions';

interface GenerationControlsProps {
    value: GenerationSettings;
    onChange: (settings: GenerationSettings) => void;
    onSubmit: () => void;
    isLoading?: boolean;
    // Extra requirement besides a prompt, e.g. an uploaded image
    canSubmit?: boolean;
    submitLabel?: string;
    textLabel?: string;
    textPlaceholder?: string;
    showSize?: boolean;
    // Collapses the parameters section (used in the quick-generate dialog)
    compact?: boolean;
    // Extra fields rendered above the submit button
    children?: React.ReactNode;
}

const GenerationControls: React.FC<GenerationControlsProps> = ({
    value,
    onChange,
    onSubmit,
    isLoading = false,
    canSubmit = true,
    submitLabel = 'Generate',
    textLabel = 'Describe your design',
    textPlaceholder = 'e.g. a timber house on a lake shore with a large glass facade',
    showSize = true,
    compact = false,
    children,
}) => {
    const [savedPrompts, setSavedPrompts] = useState(getSavedPrompts);
    const [justSaved, setJustSaved] = useState(false);

    const update = <K extends keyof GenerationSettings>(key: K, fieldValue: GenerationSettings[K]) =>
        onChange({ ...value, [key]: fieldValue });

    const activeParameterCount = Object.values(value.parameters).filter(Boolean).length;
    const isReady = hasPromptContent(value) && canSubmit && !isLoading;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (isReady) onSubmit();
    };

    const handleSavePrompt = () => {
        savePrompt(value.text);
        setSavedPrompts(getSavedPrompts());
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 1500);
    };

    return (
        <form className="generation-controls" onSubmit={handleSubmit}>
            <div className="field">
                <div className="field-label-row">
                    <label className="field-label" htmlFor="prompt-text">{textLabel}</label>
                    <button
                        type="button"
                        className="btn-link"
                        onClick={handleSavePrompt}
                        disabled={!value.text.trim()}
                        title="Save this prompt to your collection"
                    >
                        <FontAwesomeIcon icon={justSaved ? faCheck : faBookmark} /> {justSaved ? 'Saved' : 'Save'}
                    </button>
                </div>
                <textarea
                    id="prompt-text"
                    placeholder={textPlaceholder}
                    value={value.text}
                    onChange={(e) => update('text', e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit(e);
                    }}
                    rows={compact ? 3 : 4}
                    maxLength={1000}
                />
                {savedPrompts.length > 0 && (
                    <select
                        className="saved-prompts"
                        value=""
                        onChange={(e) => e.target.value && update('text', e.target.value)}
                        aria-label="Use a saved prompt"
                    >
                        <option value="">Use a saved prompt…</option>
                        {savedPrompts.map((prompt) => (
                            <option key={prompt} value={prompt}>{prompt.length > 70 ? `${prompt.slice(0, 70)}…` : prompt}</option>
                        ))}
                    </select>
                )}
            </div>

            <div className="field">
                <span className="field-label">Style keywords</span>
                <PromptsMenu selected={value.styles} onChange={(styles) => update('styles', styles)} />
            </div>

            <details className="disclosure" open={!compact}>
                <summary>
                    Parameters {activeParameterCount > 0 && <span className="badge">{activeParameterCount}</span>}
                </summary>
                <div className="disclosure-body">
                    <ImageGenerationParameters value={value.parameters} onChange={(parameters) => update('parameters', parameters)} />
                    {activeParameterCount > 0 && (
                        <button type="button" className="btn-link" onClick={() => update('parameters', { ...EMPTY_PARAMETERS })}>
                            Reset parameters
                        </button>
                    )}
                </div>
            </details>

            <ImageOptions value={value.options} onChange={(options) => update('options', options)} showSize={showSize} />

            {children}

            <details className="disclosure">
                <summary>Advanced</summary>
                <div className="disclosure-body">
                    <label className="field">
                        <span className="field-label">Negative prompt</span>
                        <input
                            type="text"
                            value={value.negativePrompt}
                            onChange={(e) => update('negativePrompt', e.target.value)}
                            placeholder="Things to avoid, e.g. people, cars, text"
                            maxLength={500}
                        />
                    </label>
                    <div className="field">
                        <span className="field-label">Final prompt sent to the model</span>
                        <p className="prompt-preview">{buildPrompt(value) || '—'}</p>
                    </div>
                </div>
            </details>

            <button type="submit" className="btn btn-primary btn-block" disabled={!isReady}>
                {isLoading ? <span className="spinner" aria-hidden /> : <FontAwesomeIcon icon={faWandMagicSparkles} />}
                {isLoading ? 'Generating…' : submitLabel}
            </button>
        </form>
    );
};

export default GenerationControls;
