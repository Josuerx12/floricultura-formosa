import { ProductCard } from "@/components/cards/product-card";
import HomeSlickSlider from "@/components/slider/home-slider";
import {
  getDeluxeProducts,
  getTop10SelledProducts,
} from "@/lib/actions/products";
import { Playfair_Display } from "next/font/google";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default async function Home() {
  const topProducts = await getTop10SelledProducts();

  const deluxeProducts = await getDeluxeProducts();

  return (
    <main className="flex w-full flex-col  items-center justify-center pb-6">
      <section className="w-full">
        <HomeSlickSlider />
      </section>

      {topProducts && topProducts.length > 0 && (
        <section className="w-full max-w-6xl my-8">
          <h2
            className={`${playfairDisplay.className} text-lg text-body_foreground md:text-2xl font-bold text-center my-6 uppercase`}
          >
            Mais vendidos
          </h2>
          <div className="mx-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {topProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {deluxeProducts && deluxeProducts.length > 0 && (
        <section className="w-full max-w-6xl my-8">
          <h2
            className={`${playfairDisplay.className} text-lg text-body_foreground md:text-2xl font-bold text-center my-6 uppercase`}
          >
            Coleção luxo
          </h2>
          <div className="mx-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {deluxeProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
