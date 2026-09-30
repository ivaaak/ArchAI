import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ExampleShowcase from './Browse/ExampleShowcase';
import InfoPanel from './InfoPanel/InfoPanel';
import Carousel from './Carousel/Carousel';
import TitleSection from './TitleSection/TitleSection';
import './Features.css';

const MODES = [
    {
        to: '/generate',
        image: '/assetImages/Meeting-01.svg',
        title: 'Text to Image',
        description: 'Describe a building and choose the drawing type, style and perspective. Get up to four variations at once.',
    },
    {
        to: '/upload',
        image: '/assetImages/Business-Deal-bro-01.svg',
        title: 'Image to Image',
        description: 'Upload a photo, model screenshot or render and restyle it while keeping its composition.',
    },
    {
        to: '/sketch',
        image: '/assetImages/Coins-01.svg',
        title: 'Sketch to Image',
        description: 'Scribble the outline on the canvas and ControlNet develops it into a detailed drawing.',
    },
    {
        to: '/inpaint',
        image: '/assetImages/Software-integration-01.svg',
        title: 'In-Painting',
        description: 'Paint over part of an image, like a facade or a roof, and regenerate only that area.',
    },
];

const Features = () => {
    return (
        <div className="page landing">
            <TitleSection />

            <section className="landing-section" aria-labelledby="modes-title">
                <header className="section-header">
                    <h2 id="modes-title">Four ways to sketch</h2>
                    <p className="muted">Pick the mode that matches where you are in the design process.</p>
                </header>
                <div className="feature-grid">
                    {MODES.map((mode) => (
                        <Link key={mode.to} to={mode.to} className="feature-card">
                            <img src={mode.image} alt="" width="120" height="120" />
                            <h3>{mode.title}</h3>
                            <p>{mode.description}</p>
                            <span className="feature-link">Try it <FontAwesomeIcon icon={faArrowRight} /></span>
                        </Link>
                    ))}
                </div>
            </section>

            <InfoPanel />
            <Carousel />
            <ExampleShowcase />
        </div>
    );
};

export default Features;
