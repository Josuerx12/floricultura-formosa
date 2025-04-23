import { ProductCard } from "@/components/cards/product-card";
import Pagination from "@/components/pagination";
import { GetAllProductsWithPagination } from "@/lib/actions/products";
import { prisma } from "@/lib/db/prisma";

const ProductsPage = async ({ searchParams }: { searchParams: any }) => {
  const params = await searchParams;

  const perPage = 20;

  const search = params.search ?? "";
  const page = params.page ?? 1;

  const data = await GetAllProductsWithPagination({
    page,
    perPage,
    search,
    isVisible: true,
  });

  return (
    <div className="flex flex-col py-5 px-2">
      <h2 className="text-center text-xl my-6 uppercase font-medium">
        Produtos Disponiveis
      </h2>

      <div className="max-w-screen-xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.products.length > 0 ? (
          data.products.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p>Nenhum produto encontrado!</p>
        )}
      </div>

      {data.products.length > 0 && <Pagination totalPages={data.totalPages} />}
    </div>
  );
};

export default ProductsPage;
