import { ProductCard } from "@/components/cards/product-card";
import Pagination from "@/components/pagination";
import { prisma } from "@/lib/db/prisma";
import React from "react";

const CategoryPage = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {
  const p = await params;
  const sp = await searchParams;

  const category = p.categoria?.replaceAll("-", " ") || "";
  const page = sp.page || 1;
  const perPage = 20;

  const totalProducts = await prisma.product.count({
    where: {
      subcategory: {
        category: {
          name: category,
        },
      },
    },
  });

  const totalPages = Math.ceil(totalProducts / perPage);

  const products = await prisma.product.findMany({
    where: {
      subcategory: {
        category: {
          name: category,
        },
      },
    },
    include: {
      product_images: {
        select: {
          url: true,
        },
      },
      subcategory: {
        select: {
          name: true,
          id: true,
          category: {
            select: {
              name: true,
              id: true,
            },
          },
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
  });

  return (
    <div className="px-4 pb-6">
      <h3 className="my-6 text-xl text-center">
        {category?.replaceAll("-", " ")}
      </h3>

      <div className="max-w-screen-xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
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

export default CategoryPage;
