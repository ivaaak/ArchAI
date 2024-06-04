import { Link } from 'react-router-dom';
import './HowItWorks.css'

const HowItWorks = () => {
    return (
        <div className="gallery" id='howItWorks'>
            <h1 className="gallery-title">Sketch Generation Options: </h1>
            <Link to="/generate">
                <img className='instructionImg' src="/assetImages/generateMenu.png" alt="" width="500" height="700" />
            </Link>
            <Link to="/upload">
                <img className='instructionImg' src="/assetImages/uploadMenu.png" alt="" width="500" height="700" />
            </Link>
            <Link to="/sketch">
                <img className='instructionImg' src="/assetImages/sketchMenu.png" alt="" width="500" height="700" />
            </Link>
        </div>
    );

};

export default HowItWorks;
