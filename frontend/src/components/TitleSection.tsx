import { Link } from 'react-router-dom';
import '../App.css'
import { useEffect, useState } from 'react';

const TitleSection = () => {
  const [currentQuote, setCurrentQuote] = useState('');
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
        <p>Powered By StableDiffusion and ControlNet AI Models</p>
        <form>
          <input type="email" name="email" id="email" placeholder="Email Address" />
          <Link to="/login">
            <input type="submit" value="Sign Up" />
          </Link>
        </form>
      </div>
      <img src="https://stories.freepiklabs.com/storage/49289/Software-integration-01.svg" alt="" />
    </header>
  );
};

export default TitleSection;
