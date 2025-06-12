import { ProductCard } from "@/components/cards/product-card";
import ProductFilter from "@/components/filters/product-filter/ProductFilter";
import HomeSlickSlider from "@/components/slider/home-slider";
import Title from "@/components/title";
import { getBanners } from "@/lib/actions/banners";
import {
  getDeluxeProducts,
  getTop20SelledProducts,
} from "@/lib/actions/products";

export default async function Home({ searchParams }: { searchParams: any }) {
  const params = await searchParams;

  const topProducts = await getTop20SelledProducts({
    ...(params.order_by && { order_by: params.order_by }),
  });

  const deluxeProducts = await getDeluxeProducts();

  const banners = await getBanners();

  return (
    <main className="flex w-full flex-col  items-center justify-center pb-6">
      <section className="w-full">
        <HomeSlickSlider banners={banners} />
      </section>

      {topProducts && topProducts.length > 0 && (
        <section className="w-full max-w-6xl my-8">
          <Title>Produtos</Title>
          <div className="w-full flex justify-end my-4 -ml-2">
            <ProductFilter />
          </div>
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
