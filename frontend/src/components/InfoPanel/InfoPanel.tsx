import './InfoPanel.css';

const InfoPanel = () => {
  return (
    <section className="container">
      <h1 className="header">From Idea to Design in Real-time</h1>
      <p className="textSection">
        Used by architects and real estate developers to optimize the sketching / brainstorming process, rapid iterations, and accurate instant insights. Then, to download the standardized sketch / drawing to continue with their traditional workflow.
      </p>
      <div className="gridContainer">
        <div className="inputSection">
          <h2>Input</h2>
          <img className="imageSection" src="../../public/assetImages/parameters.webp" alt="Input" />
          <h3 className="textCenter my-5 text-4xl">1. Design Criteria and Details</h3>
          <p className="font-light text-arch-grey">
            The user inputs the design criteria that the sketch must meet and defines and models the solution online in an easy and intuitive way.
          </p>
        </div>
        <div className="processingSection">
          <h2>Processing</h2>
          <img className="imageSection" src="../../public/assetImages/AI-Flow.webp" alt="Processing" />
          <h3 className="textCenter my-5 text-4xl">2.-AI Optimized Design Development</h3>
          <p className="font-light text-arch-grey">
            The cloud-based AI system generates the drawing and geometry that best fits the parameters entered for each user iteration.
          </p>
        </div>
        <div className="outputSection">
          <h2>Output</h2>
          <img className="imageSection" src="../../public/assetImages/bim-block.webp" alt="Output" />
          <h3 className="textCenter my-5 text-4xl">3.-Generation of the sketch and Project Data</h3>
          <p className="font-light text-arch-grey">
            The platform shows the resulting sketch and all its metrics to be later downloaded and iterate on.
          </p>
        </div>
      </div>
    </section>
  );
};

export default InfoPanel;
