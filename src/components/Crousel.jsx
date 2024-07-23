import React, { useState, useEffect } from "react";
import image1 from "../assets/b6.avif";
import image2 from "../assets/b4.jpg";
import image3 from "../assets/b7.avif";
// import image4 from "../assets/b8.avif";
import { CgMouse } from "react-icons/cg";

const carouselItems = [
  { id: 1, src: image1 },
  { id: 2, src: image2 },
  { id: 3, src: image3 },
  // { id: 4, src: image4 },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (carouselItems.length * 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-2xl bg-gray-800">
      <div
        className="relative flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${(currentIndex % carouselItems.length) * 100}%)` }}
      >
        {carouselItems.concat(carouselItems).map((item, index) => (
          <div key={index} className="w-full flex-shrink-0 relative">
            <img
              src={item.src}
              alt={`Carousel Image ${index + 1}`}
              className="w-full h-[500px] object-cover rounded-lg shadow-lg transform scale-105 transition-transform duration-500 ease-in-out hover:scale-110 hover:shadow-2xl"
            />
            <a href="#container">
              <button
                className="absolute bottom-40 left-1/2 transform -translate-x-1/2  text-white px-6 py-3 rounded-full shadow-lg hover:shadow-2xl hover:from-red-600 hover:to-red-800 transition duration-300 ease-in-out border-2 border-white flex items-center space-x-2"
              >
                <span>Shop Now</span>
                <CgMouse />
              </button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
