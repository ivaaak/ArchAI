import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const IMAGES = Array.from({ length: 12 }, (_, index) => `/mj/${index + 1}.png`);

const CarouselComponent = () => {
    return (
        <section className="landing-section" aria-labelledby="renders-title">
            <header className="section-header">
                <h2 id="renders-title">Renders generated using AI</h2>
                <p className="muted">From loose concept sketches to photorealistic visualisations.</p>
            </header>
            <div className="render-carousel">
                <Carousel autoPlay infiniteLoop useKeyboardArrows showThumbs={false} showStatus={false} interval={4000}>
                    {IMAGES.map((image, index) => (
                        <div key={image}>
                            <img src={image} alt={`AI generated architectural render ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} />
                        </div>
                    ))}
                </Carousel>
            </div>
        </section>
    );
};

export default CarouselComponent;
