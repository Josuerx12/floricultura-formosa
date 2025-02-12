import { ProductCard } from "@/components/cards/product-card";
import HomeSlickSlider from "@/components/slider/home-slider";
import { Product } from "@/lib/actions/products";
import { prisma } from "@/lib/db/prisma";

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
        },
      },
    },
  });

  const subCategories = await prisma.subcategory.findMany({
    where: {
      products: {
        some: {},
      },
    },
    include: {
      products: {
        include: { product_images: true },
        take: 5,
      },
    },
  });

  const allProducts = await prisma.product.findMany({
    include: { product_images: true },
    orderBy: { created_at: "desc" },
  });

  return (
    <main className="flex w-full flex-col items-center justify-center">
      <section className="w-full">
        <HomeSlickSlider />
      </section>

      <section className="w-full max-w-6xl my-8">
        <h2 className="text-2xl font-bold mb-4">🔥 Produtos em Promoção</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {promotionsProducts.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      </section>

      {subCategories.map((category) => (
        <section key={category.id} className="w-full max-w-6xl my-8">
          <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}

      <section className="w-full max-w-6xl my-8">
        <h2 className="text-2xl font-bold mb-4">📦 Todos os Produtos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
