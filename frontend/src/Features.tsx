import TitleSection from './TitleSection';
import { Link } from 'react-router-dom';
import './App.css'

const Features = () => {
    return (
        <>
            <TitleSection></TitleSection>
            <section className="features">
                <Link to="/generate">
                    <div className="feature">
                        <img src="https://stories.freepiklabs.com/storage/1864/Meeting-01.svg" alt="" width="80" height="80" />
                        <p className="feature-name"> Generate An Image <br /> Via Text Prompt </p>
                        <p className="feature-note">We're talking Evernote, MailChimp, DepsitPhotos...just to name a few.</p>
                    </div>
                </Link>
                <Link to="/upload">
                    <div className="feature">
                        <img src="https://stories.freepiklabs.com/storage/4603/Business-Deal-bro-01.svg" alt="" width="80" height="80" />
                        <p className="feature-name"> Upload An Image <br /> And Have It Enhanced </p>
                        <p className="feature-note">But don't sleep on it! Our deals sell out within a couple weeks.</p>
                    </div>
                </Link>
                <Link to="/sketch">
                    <div className="feature">
                        <img src="https://stories.freepiklabs.com/storage/39672/Coins-01.svg" alt="" width="80" height="80" />
                        <p className="feature-name"> Sketch An Image <br /> And The LLM Will Improve It </p>
                        <p className="feature-note">And build up a full arsenal of tools to grow your business.</p>
                    </div>
                </Link>
            </section>
        </>
    );
};

export default Features;
