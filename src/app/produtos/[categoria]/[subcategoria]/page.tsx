import { ProductCard } from "@/components/cards/product-card";
import { prisma } from "@/lib/db/prisma";
import React from "react";

const ProdutosSubcategoria = async ({
  params,
}: {
  params: { categoria?: string; subcategoria?: string } & any;
}) => {
  const { categoria, subcategoria } = await params;

  const products = await prisma.product.findMany({
    where: {
      subcategory: {
        name: {
          contains: subcategoria?.replaceAll("%20", " "),
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
  });

  return (
    <div className="flex flex-col">
      <h3 className="my-6 text-xl text-center">
        {categoria?.replaceAll("%20", " ")} |{" "}
        {subcategoria?.replaceAll("%20", " ")}
      </h3>

      <div className="flex p-2 gap-5">
        {products?.length > 0 ? (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p className="text-center w-full">
            Nenhum produto foi encontrado para essa categoria!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProdutosSubcategoria;
