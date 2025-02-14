"use client";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HomeSlider() {
  const slides = [
    { id: 1, src: "/images/banner-teste.png", alt: "Banner Image" },
  ];

  const settings = {
    dots: true,
    infinite: slides.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Slider className="-z-20" {...settings}>
      {slides.map((slide) => (
        <Image
          key={slide.id}
          src={slide.src}
          alt={slide.alt}
          width={1920}
          height={580}
          quality={100}
        />
      ))}
    </Slider>
  );
}
