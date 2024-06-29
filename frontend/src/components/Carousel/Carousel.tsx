import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import '../TitleSection/TitleSection.css'

const CarouselComponent = () => {
    const images = [
        "/mj/1.png",
        "/mj/2.png",
        "/mj/3.png",
        "/mj/4.png",
        "/mj/5.png",
        "/mj/6.png",
        "/mj/7.png",
        "/mj/8.png",
        "/mj/9.png",
        "/mj/10.png",
        "/mj/11.png",
        "/mj/12.png"
    ];

    return (
        <>
            <h1> Renders Generated Using AI: </h1>
            <Carousel autoPlay infiniteLoop useKeyboardArrows showThumbs={false}
                showIndicators={false}>
                {images.map((image, index) => (
                    <div key={index}>
                        <img src={image} />
                    </div>
                ))}
            </Carousel>
        </>
    );
};

export default CarouselComponent;
