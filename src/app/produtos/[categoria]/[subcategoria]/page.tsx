import { ProductCard } from "@/components/cards/product-card";
import Pagination from "@/components/pagination";
import { prisma } from "@/lib/db/prisma";
import React from "react";

const ProdutosSubcategoria = async ({
  params,
  searchParams,
}: {
  params: { categoria?: string; subcategoria?: string } & any;
  searchParams: any;
}) => {
  const sp = await searchParams;

  const { categoria, subcategoria } = await params;

  const page = sp.page || 1;
  const perPage = 20;

  const totalProducts = await prisma.product.count({
    where: {
      subcategory: {
        name: {
          contains: subcategoria?.replaceAll("-", " "),
        },
        category: {
          name: {
            contains: categoria?.replaceAll("-", " "),
          },
        },
      },
    },
  });

  const totalPages = Math.ceil(totalProducts / perPage);

  const products = await prisma.product.findMany({
    where: {
      subcategory: {
        name: {
          contains: subcategoria?.replaceAll("-", " "),
        },
        category: {
          name: {
            contains: categoria?.replaceAll("-", " "),
          },
        },
      },
    },
    include: {
      subcategory: {
        select: {
          name: true,
          id: true,
        },
      },
      product_images: {
        select: {
          url: true,
        },
      },

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
    take: perPage,
    skip: (page - 1) * perPage,
    orderBy: {
      created_at: "desc",
    },
  });

  return (
    <div className="flex flex-col px-4 pb-6">
      <h3 className="my-6 text-xl text-center">
        {categoria?.replaceAll("-", " ")} | {subcategoria?.replaceAll("-", " ")}
      </h3>

      <div className="max-w-screen-xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products?.length > 0 ? (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p className="text-center w-full">
            Nenhum produto foi encontrado para essa categoria!
          </p>
        )}
      </div>

      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default ProdutosSubcategoria;
