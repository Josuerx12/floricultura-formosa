import { ProductCard } from "@/components/cards/product-card";
import HomeSlickSlider from "@/components/slider/home-slider";
import PromoSlider from "@/components/slider/promo-slider";
import { Product } from "@/lib/actions/products";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export default async function Home() {
  const promotionsProducts = await prisma.product.findMany({
    where: {
      promotions: {
        some: {
          start_date: { lte: new Date() },
          end_date: { gte: new Date() },
        },
      },
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock_quantity: true,
      description: true,
      product_images: { select: { url: true } },
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
  });

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
    take: 20,
    orderBy: { created_at: "desc" },
  });

  return (
    <main className="flex w-full flex-col items-center justify-center mb-6">
      <section className="w-full">
        <HomeSlickSlider />
      </section>

      {promotionsProducts && promotionsProducts.length > 0 && (
        <section className="w-full max-w-6xl my-8">
          <h2 className="text-2xl font-bold mb-4">🔥 Produtos em Promoção</h2>
          <PromoSlider products={promotionsProducts} />
        </section>
      )}

      {allProducts && allProducts.length > 0 && (
        <section className="w-full max-w-6xl my-8">
          <h2 className="text-2xl font-bold mb-4">🌼 Todos os Produtos</h2>
          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <Link
        title="Clique aqui para ver mais produtos disponiveis!"
        href={"/produtos"}
        className="bg-primary/50 hover:bg-primary duration-200 ease-linear border border-primary-foreground text-primary-foreground p-2"
      >
        Ver mais produtos ...
      </Link>
    </main>
  );
}
