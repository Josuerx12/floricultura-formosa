"use client";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useQuery } from "@tanstack/react-query";
import { getBanners } from "@/lib/actions/banners";
import Link from "next/link";

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
          url: b.redirect_url,
          title: b.title,
        }))
      : [
          {
            id: 1,
            src: "/images/banner-teste.png",
            alt: "Banner Image",
            url: "/",
            title: "Banner padrão",
          },
        ];

  const settings = {
    dots: true,
    infinite: slides.length > 1,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <div className="w-full overflow-hidden">
      <Slider {...settings}>
        {slides.map((slide) => (
          <Link
            title={slide.title}
            key={slide.id}
            href={slide.url}
            target="_blank"
            className="relative min-w-screen w-full h-[250px] md:min-h-[516px]"
          >
            <Image
              fill
              layout="fill"
              src={slide.src}
              alt={slide.alt}
              quality={100}
              className="object-cover"
            />
          </Link>
        ))}
      </Slider>
    </div>
  );
}
