"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ProductCard } from "@/components/cards/product-card";
import { Product } from "@/lib/actions/products";

interface PromoSliderProps {
  products: Product[];
}

export default function PromoSlider({ products }: PromoSliderProps) {
  const settings = {
    dots: true,
    infinite: products.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="flex-grow overflow-hidden">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="px-2 md:h-[600px] mt-5">
            <ProductCard product={product} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
