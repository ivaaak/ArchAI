import '../App.css'

const TitleSection = () => {
 return (
    <header>
    <div className="intro">
      <h1>Generate Sketches Using AI <br/> Empowering Creativity, One Sketch at a Time.</h1>
      {/* "Design Beyond Imagination."
        "Sketch, Create, Innovate."
        "Blueprints to Brilliance."
        "Unleash Architectural Ingenuity."
        "Empowering Creativity, One Sketch at a Time."
        "Architect Your Vision with Precision."
        "From Concept to Construction, Seamlessly."
        "Elevate Your Designs with AI Precision."
        "Transform Ideas into Masterpieces."
        "Architectural Excellence Made Effortless." */}
      <p>Powered By StableDiffusion and ControlNet AI Models</p>
      <form>
        <input type="email" name="email" id="email" placeholder="Email Address" />
        <input type="submit" value="Sign Up" />
      </form>
    </div>
    <img src="https://stories.freepiklabs.com/storage/49289/Software-integration-01.svg" alt="" />
  </header>
 );
};

export default TitleSection;
