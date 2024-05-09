import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './TitleSection.css'

const TitleSection = () => {
  const [currentQuote, setCurrentQuote] = useState('');
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();

  const quotes = [
    "Design Beyond Imagination.",
    "Sketch, Create, Innovate.",
    "Blueprints to Brilliance.",
    "Unleash Architectural Ingenuity.",
    "Empowering Creativity, One Sketch at a Time.",
    "Architect Your Vision with Precision.",
    "From Concept to Construction, Seamlessly.",
    "Elevate Your Designs with AI Precision.",
    "Transform Ideas into Masterpieces.",
    "Architectural Excellence Made Effortless."
  ];
  // const images = [
  //   "/public/carousel/1.jpg",
  //   "/public/carousel/2.jpg",
  //   "/public/carousel/3.jpeg",
  //   "/public/carousel/4.jpg",
  //   "/public/carousel/5.jpg",
  //   "/public/carousel/6.jpg",
  //   "/public/carousel/7.jpeg",
  //   "/public/carousel/8.jpeg",
  //   "/public/carousel/10.jpeg",
  //   "/public/carousel/11.jpg",
  //   "/public/carousel/12.jpg",
  //   "/public/carousel/13.jpeg",
  // ];
  const images = [
    "/public/mj/1.png",
    "/public/mj/2.png",
    "/public/mj/3.png",
    "/public/mj/4.png",
    "/public/mj/5.png",
    "/public/mj/6.png",
    "/public/mj/7.png",
    "/public/mj/8.png",
    "/public/mj/9.png",
    "/public/mj/10.png",
    "/public/mj/11.png",
    "/public/mj/12.png"
  ];

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  };

  useEffect(() => {
    getRandomQuote();
  }, []);

  return (
    <header>
      <div className="intro">
        <h1>Generate Sketches Using AI </h1>
        <h1 style={{ opacity: '0.7' }}>{currentQuote}</h1>
        {isAuthenticated && <h3 style={{ opacity: '0.7' }}>Welcome, {user?.name}</h3>}
        <h2 style={{ opacity: '0.7' }}>Powered By StableDiffusion and ControlNet AI Models</h2>
        <form>
          <input type="email" name="email" id="email" placeholder="Email Address" />
          <input type='submit' value="Sign Up" onClick={() => loginWithRedirect()} /> {/* TODO Hook up to Leads */}
          <Link to="/pricing" className='pricingBtn'>Pricing</Link>
        </form>
      </div>
      {/* <img src="https://stories.freepiklabs.com/storage/49289/Software-integration-01.svg" alt="" /> */}
      <Carousel autoPlay infiniteLoop useKeyboardArrows showThumbs={false}
        showIndicators={false}>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image} />
          </div>
        ))}
      </Carousel>
    </header>
  );
};

export default TitleSection;
