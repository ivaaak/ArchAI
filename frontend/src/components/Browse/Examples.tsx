import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { EXAMPLES } from '../../data/examples';
import { downloadImage } from '../../lib/files';
import { COLLECTION_ROUTES } from '../../lib/labels';
import Tabs from '../Tabs'
import './Browse.css';

const Examples = () => {
    return (
        <div className="page">
            <Tabs routes={COLLECTION_ROUTES} label="Collections" />
            <div className="gallery-grid gallery-grid-large">
                {EXAMPLES.map((example) => (
                    <article key={example.src} className="gallery-card">
                        <div className="gallery-card-image">
                            <img src={example.src} alt={example.name} loading="lazy" />
                        </div>
                        <div className="gallery-card-body">
                            <h2 className="gallery-card-title">{example.name}</h2>
                            <p className="gallery-card-prompt gallery-card-prompt-full">{example.prompt}</p>
                            <div className="tag-list">
                                {example.tags.map((tag) => <span key={tag} className="badge">{tag}</span>)}
                            </div>
                        </div>
                        <div className="gallery-card-actions">
                            <Link className="btn btn-small btn-primary" to={`/generate?prompt=${encodeURIComponent(example.prompt)}`}>
                                <FontAwesomeIcon icon={faWandMagicSparkles} /> Use this prompt
                            </Link>
                            <button className="icon-btn" onClick={() => downloadImage(example.src, `${example.name}.jpg`)} title="Download" aria-label="Download">
                                <FontAwesomeIcon icon={faDownload} />
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default Examples;
