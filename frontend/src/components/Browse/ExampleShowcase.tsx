import { Link } from 'react-router-dom';
import { EXAMPLES } from '../../data/examples';
import './Browse.css'

const ExampleShowcase = () => {
    return (
        <section className="landing-section" id="exampleShowcase" aria-labelledby="examples-title">
            <header className="section-header">
                <h2 id="examples-title">Generated image examples</h2>
                <p className="muted">Hover an image to see the prompt behind it.</p>
            </header>
            <div className="showcase-grid">
                {EXAMPLES.map((example) => (
                    <figure key={example.src} className="showcase-item" tabIndex={0}>
                        <img src={example.src} alt={example.name} loading="lazy" />
                        <figcaption className="showcase-overlay">
                            <h3>{example.name}</h3>
                            <p>{example.prompt}</p>
                            <Link to={`/generate?prompt=${encodeURIComponent(example.prompt)}`}>Use this prompt →</Link>
                        </figcaption>
                    </figure>
                ))}
            </div>
            <p className="section-footer">
                <Link className="btn" to="/examples">See all examples</Link>
            </p>
        </section>
    );
};

export default ExampleShowcase;
