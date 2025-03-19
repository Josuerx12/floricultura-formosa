import { ProductCard } from "@/components/cards/product-card";
import Pagination from "@/components/pagination";
import { prisma } from "@/lib/db/prisma";

const ProductsPage = async ({ searchParams }: { searchParams: any }) => {
  const params = await searchParams;

  const perPage = 20;

  const search = params.search ?? "";
  const page = params.page ?? 1;

  const totalProducts = await prisma.product.count({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  const totalPages = Math.ceil(totalProducts / perPage);

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
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
    take: perPage,
    skip: (page - 1) * perPage,
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="flex flex-col py-5 px-2">
      <h2 className="text-center text-xl my-6 uppercase font-medium">
        Produtos Disponiveis
      </h2>

      <div className="max-w-screen-xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.length > 0 ? (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p>Nenhum produto encontrado!</p>
        )}
      </div>

      {products.length > 0 && <Pagination totalPages={totalPages} />}
    </div>
  );
};

export default ProductsPage;
