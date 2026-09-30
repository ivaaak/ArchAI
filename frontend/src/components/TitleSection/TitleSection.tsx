import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ImgComparisonSlider } from '@img-comparison-slider/react';
import { apiClient, getErrorMessage } from '../../lib/api';
import './TitleSection.css'

const QUOTES = [
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

const TitleSection = () => {
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'error' | 'pending'; message: string } | null>(null);
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: 'pending', message: 'Signing you up…' });
    try {
      await apiClient.post('/lead', { email });
      // Continue to Auth0 sign up with the email pre-filled
      await loginWithRedirect({
        authorizationParams: { screen_hint: 'signup', login_hint: email },
        appState: { returnTo: '/generate' },
      });
    } catch (error) {
      setStatus({ type: 'error', message: getErrorMessage(error) });
    }
  };

  return (
    <header className="hero">
      <div className="hero-intro">
        <span className="eyebrow">AI sketching for architects</span>
        <h1 className="hero-title">Generate Sketches <span className="text-mint">Using AI</span></h1>
        <p className="hero-quote">{quote}</p>
        <p className="hero-subtitle">
          Turn a sentence, a photo or a rough scribble into floor plans, elevations and renders in seconds.
          Powered by Stable Diffusion XL and ControlNet.
        </p>

        {isAuthenticated ? (
          <div className="hero-actions">
            <p className="hero-welcome">Welcome back, {user?.name?.split('@')[0]}</p>
            <Link to="/generate" className="btn btn-primary btn-large">
              Start generating <FontAwesomeIcon icon={faArrowRight} />
            </Link>
            <Link to="/browse" className="btn btn-large">Your collections</Link>
          </div>
        ) : (
          <>
            <form className="hero-form" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                required
                aria-label="Email address"
                placeholder="you@studio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" disabled={status?.type === 'pending'}>
                Get started free
              </button>
            </form>
            {status && <p className={status.type === 'error' ? 'form-error' : 'muted small'} role="status">{status.message}</p>}
            <p className="muted small">
              Just looking? <Link to="/examples">Browse example prompts</Link> or see <Link to="/pricing">pricing</Link>.
            </p>
          </>
        )}
      </div>
      <figure className="hero-media">
        <ImgComparisonSlider className="hero-compare">
          <img slot="first" src="/comparison/comparisonRender.jpg" alt="Photorealistic render of an office building" />
          <img slot="second" src="/comparison/comparisonSketch.jpg" alt="The same building as a line sketch" />
        </ImgComparisonSlider>
        <figcaption className="muted small">Drag to compare the render with its sketch</figcaption>
      </figure>
    </header>
  );
};

export default TitleSection;
