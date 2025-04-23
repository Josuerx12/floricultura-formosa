import { ProductCard } from "@/components/cards/product-card";
import HomeSlickSlider from "@/components/slider/home-slider";
import Title from "@/components/title";
import {
  getDeluxeProducts,
  getTop20SelledProducts,
} from "@/lib/actions/products";

export default async function Home() {
  const topProducts = await getTop20SelledProducts();

  const deluxeProducts = await getDeluxeProducts();

  return (
    <main className="flex w-full flex-col  items-center justify-center pb-6">
      <section className="w-full">
        <HomeSlickSlider />
      </section>

      {topProducts && topProducts.length > 0 && (
        <section className="w-full max-w-6xl my-8">
          <Title>Mais vendidos</Title>
          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {topProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {deluxeProducts && deluxeProducts.length > 0 && (
        <section className="w-full max-w-6xl my-8">
          <Title>Coleção luxo</Title>
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
