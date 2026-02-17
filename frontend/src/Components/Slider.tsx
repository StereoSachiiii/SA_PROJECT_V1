import { Carousel } from 'react-bootstrap'
import photo1 from "../assets/photo1.jpg";
import photo2 from "../assets/photo2.jpg";
import photo3 from "../assets/photo3.jpg";


function Slider() {
    return (
        <Carousel>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={photo1}
                    alt="First slide"
                    style={{ height: '400px', objectFit: 'cover' }}
                />
            </Carousel.Item>

            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={photo2}
                    alt="Second slide"
                    style={{ height: '400px', objectFit: 'cover' }}
                />
            </Carousel.Item>

            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={photo3}
                    alt="Third slide"
                    style={{ height: '400px', objectFit: 'cover' }}
                />
            </Carousel.Item>
        </Carousel>
    )
}

export default Slider
