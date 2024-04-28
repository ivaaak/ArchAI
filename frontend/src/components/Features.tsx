import TitleSection from './TitleSection';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import ExampleShowcase from './ExampleShowcase';
import HowItWorks from './HowItWorks';
import '../App.css'

const Features = () => {
    return (
        <>
            <TitleSection></TitleSection>
            <section className="features">
                <div className='checkItOut'>
                    See How It Works Below:
                    <a className='downArrowBtn' href='#howItWorks'>
                    <FontAwesomeIcon icon={faArrowDown} />                    
                    </a>
                </div>
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
                        <p className="feature-name"> Sketch An Image <br /> And Enhance It </p>
                        <p className="feature-note">And build up a full arsenal of tools to grow your business.</p>
                    </div>
                </Link>
                <div className='browseExamples'>
                    AI Generated Examples:
                    <a className='downArrowBtn' href='#exampleShowcase'>
                    <FontAwesomeIcon icon={faArrowDown} />                    
                    </a>
                </div>
            </section>
            <HowItWorks></HowItWorks>
            <ExampleShowcase></ExampleShowcase>
        </>
    );
};

export default Features;
