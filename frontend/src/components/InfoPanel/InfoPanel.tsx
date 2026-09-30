import './InfoPanel.css';

const STEPS = [
  {
    label: 'Input',
    image: '/assetImages/parameters.webp',
    title: 'Design criteria and details',
    text: 'Describe the design, pick the drawing type and style, or start from your own sketch or photo.',
  },
  {
    label: 'Processing',
    image: '/assetImages/AI-Flow.webp',
    title: 'AI optimized design development',
    text: 'Stable Diffusion XL and ControlNet generate the drawings that best fit your parameters, in seconds.',
  },
  {
    label: 'Output',
    image: '/assetImages/bim-block.webp',
    title: 'Sketches ready for your workflow',
    text: 'Compare variations, refine them further, and download the drawings to continue in your usual tools.',
  },
];

const InfoPanel = () => {
  return (
    <section className="landing-section info-panel" aria-labelledby="info-title">
      <header className="section-header">
        <h2 id="info-title">From idea to design in real time</h2>
        <p className="muted">
          Used by architects and real estate developers to speed up sketching and brainstorming, iterate rapidly,
          and then continue with the standardized drawings in their traditional workflow.
        </p>
      </header>
      <ol className="steps">
        {STEPS.map((step, index) => (
          <li key={step.label} className="step">
            <span className="step-label">{index + 1}. {step.label}</span>
            <img src={step.image} alt="" loading="lazy" />
            <h3>{step.title}</h3>
            <p className="muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default InfoPanel;
