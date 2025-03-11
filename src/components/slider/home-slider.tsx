"use client";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useQuery } from "@tanstack/react-query";
import { getBanners } from "@/lib/actions/banners";

export default function HomeSlider() {
  const { data } = useQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
  });

  const slides =
    data && data.length > 0
      ? data.map((b) => ({
          id: b.id,
          src: b.url,
          alt: b.title,
        }))
      : [{ id: 1, src: "/images/banner-teste.png", alt: "Banner Image" }];

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
