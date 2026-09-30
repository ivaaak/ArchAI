import React from 'react';
import Tabs from '../Tabs';

const MODE_ROUTES = [
    { route: '/generate', label: 'Text to Image' },
    { route: '/upload', label: 'Image to Image' },
    { route: '/sketch', label: 'Sketch to Image' },
    { route: '/inpaint', label: 'In-Painting' },
];

interface WorkspaceProps {
    title: string;
    description: string;
    controls: React.ReactNode;
    output: React.ReactNode;
    // Makes the output column wider, for canvas-based modes
    wideOutput?: boolean;
}

// Shared layout of the generation pages: mode tabs, a controls column and an output area
const Workspace: React.FC<WorkspaceProps> = ({ title, description, controls, output, wideOutput = false }) => (
    <div className="page">
        <Tabs routes={MODE_ROUTES} label="Generation modes" />
        <div className={`workspace ${wideOutput ? 'workspace-wide' : ''}`}>
            <aside className="panel workspace-controls">
                <header className="workspace-header">
                    <h1>{title}</h1>
                    <p className="muted">{description}</p>
                </header>
                {controls}
            </aside>
            <section className="panel workspace-output" aria-label="Output">
                {output}
            </section>
        </div>
    </div>
);

export default Workspace;
