import { ProductCard } from "@/components/cards/product-card";
import HomeSlickSlider from "@/components/slider/home-slider";
import PromoSlider from "@/components/slider/promo-slider";
import {
  getDeluxeProducts,
  getTop10SelledProducts,
  Product,
} from "@/lib/actions/products";
import { prisma } from "@/lib/db/prisma";
import Image from "next/image";

export default async function Home() {
  const topProducts = await getTop10SelledProducts();

  const allProducts = await prisma.product.findMany({
    include: {
      product_images: true,
      promotions: {
        where: {
          start_date: { lte: new Date() },
          end_date: { gte: new Date() },
        },
        orderBy: { start_date: "asc" },
        take: 1,
        select: {
          discount_percentage: true,
          end_date: true,
          start_date: true,
        },
      },
    },
    take: 21,
    orderBy: { created_at: "desc" },
  });

  const deluxeProducts = await getDeluxeProducts();

  return (
    <main className="flex w-full flex-col  items-center justify-center pb-6">
      <section className="w-full">
        <HomeSlickSlider />
      </section>

      {topProducts && topProducts.length > 0 && (
        <section className="w-full max-w-6xl my-8">
          <h2 className="text-lg text-body_foreground md:text-2xl font-bold text-center my-6 uppercase">
            Mais vendidos
          </h2>
          <PromoSlider products={topProducts} />
        </section>
      )}

      {allProducts && allProducts.length > 0 && (
        <section className="w-full max-w-6xl my-8">
          <div className="mx-2 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-6">
            {allProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {deluxeProducts && deluxeProducts.length > 0 && (
        <section className="w-full max-w-6xl my-8">
          <h2 className="text-lg text-body_foreground md:text-2xl font-bold text-center my-6 uppercase">
            Coleção luxo
          </h2>
          <PromoSlider products={deluxeProducts} />
        </section>
      )}
    </main>
  );
}
