import { ProductCard } from "@/components/cards/product-card";
import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";
import { fromCents } from "@/lib/utils";
import Link from "next/link";
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
        slug: {
          contains: subcategoria,
        },
        category: {
          slug: {
            contains: categoria,
          },
        },
      },
    },
  });

  const totalPages = Math.ceil(totalProducts / perPage);

  const products = await prisma.product.findMany({
    where: {
      subcategory: {
        slug: {
          contains: subcategoria,
        },
        category: {
          slug: {
            contains: categoria,
          },
        },
      },
    },
    include: {
      subcategory: {
        select: {
          name: true,
          id: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      },
      product_images: {
        select: {
          url: true,
        },
      },
    },
    take: perPage,
    skip: (page - 1) * perPage,
    orderBy: {
      created_at: "desc",
    },
  });

  if (!products || products.length <= 0) {
    return (
      <div className="flex min-h-screen flex-col w-full item-center">
        <h2 className=" text-center">
          Nenhum produto encontrado para esta subcategoria.
        </h2>
        <Link className=" mx-auto" href={"/"}>
          <Button variant={"link"}>Voltar para pagina inicial.</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 pb-6">
      <h3 className="my-6 text-xl text-center uppercase font-medium">
        {products[0]?.subcategory?.category?.name} |{" "}
        {products[0]?.subcategory?.name}
      </h3>

      <div className="max-w-screen-xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products?.length > 0 ? (
          products.map((p) => {
            p.price = fromCents(p.price);
            return <ProductCard key={p.id} product={p as any} />;
          })
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
