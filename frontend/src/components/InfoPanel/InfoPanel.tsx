import './InfoPanel.css';

const InfoPanel = () => {
  return (
    <section className="flex flex-col items-center border-b border-gray-300 text-justify">
      <h1 className="mx-5 font-dense text-6xl">From Idea to Design in Real-time</h1>
      <p className="mx-5 max-w-6xl text-xl font-light text-arch-grey">
        Used by architects and real estate developers to optimize the sketching / brainstorming process, rapid iterations, and accurate instant insights. Then, to download the standardized sketch / drawing to continue with their traditional workflow.
      </p>
      <div className="mt-2 grid w-full grid-cols-1 justify-around gap-4 pb-5 md:grid-cols-3">
        <div className="flex w-64 flex-col items-center justify-self-center lg:w-72">
          <p className="mb-2 font-dense text-4xl uppercase">Input</p>
          <img width="235" height="140" src="../../public/assetImages/parameters.webp" style={{ color: 'transparent' }} />
          <p className="my-5 text-center font-dense text-4xl">1.-Introduction of Design Criteria and Details</p>
          <p className="font-light text-arch-grey">
            The user inputs the design criteria that the sketch must meet and defines and models the solution online in an easy and intuitive way.
          </p>
        </div>
        <div className="mt-5 flex w-64 flex-col items-center justify-self-center md:mt-0 lg:w-72">
        <img width="235" height="140" src="../../public/assetImages/AI-Flow.webp" style={{ color: 'transparent' }} />
          <p className="my-5 text-center font-dense text-4xl">2.-AI Optimized Design Development</p>
          <p className="font-light text-arch-grey">
            The cloud-based AI system generates the drawing and geometry that best fits the parameters entered for each user iteration.
          </p>
        </div>
        <div className="mt-2 flex w-64 flex-col items-center justify-self-center md:mt-0 lg:w-72">
          <p className="mb-2 font-dense text-4xl uppercase">Output</p>
          <img width="235" height="140" src="../../public/assetImages/bim-block.webp" style={{ color: 'transparent' }} />
          <p className="my-5 text-center font-dense text-4xl">3.-Generation of the sketch and Project Data</p>
          <p className="font-light text-arch-grey">
            The platform shows the resulting sketch and all its metrics to be later downloaded and iterate on.
          </p>
        </div>
      </div>
    </section>
  );
};

export default InfoPanel;
