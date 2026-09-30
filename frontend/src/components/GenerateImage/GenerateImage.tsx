import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { requestGeneration } from '../../lib/api';
import { createDefaultSettings } from '../../lib/prompt';
import { useGeneration } from '../../hooks/useGeneration';
import GenerationControls from './GenerationControls';
import ResultsPanel from './ResultsPanel';
import Workspace from './Workspace';

const GenerateImage = () => {
    const [searchParams] = useSearchParams();
    const { user } = useAuth0();
    // Prompts can be passed in from the examples / details pages: /generate?prompt=...
    const [settings, setSettings] = useState(() => createDefaultSettings(searchParams.get('prompt') ?? ''));
    const generation = useGeneration();

    const handleSubmit = () => generation.run(() =>
        requestGeneration('/stableDiffusion/', settings, { ownerId: user?.sub, includeSize: true })
    );

    return (
        <Workspace
            title="Text to Image"
            description="Describe a design, pick the drawing type and style, and let SDXL sketch it."
            controls={
                <GenerationControls
                    value={settings}
                    onChange={setSettings}
                    onSubmit={handleSubmit}
                    isLoading={generation.isLoading}
                />
            }
            output={
                <ResultsPanel
                    {...generation}
                    placeholder={
                        <>
                            <img src="/assetImages/Meeting-01.svg" alt="" />
                            <p className="results-status-title">Your sketches will appear here</p>
                            <p className="muted">Write a description or combine a few parameters, then press Generate.</p>
                        </>
                    }
                />
            }
        />
    );
};

export default GenerateImage;
