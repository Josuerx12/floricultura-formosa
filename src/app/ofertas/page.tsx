import { ProductCard } from "@/components/cards/product-card";
import Pagination from "@/components/pagination";
import { prisma } from "@/lib/db/prisma";
import React from "react";

const OfertasPage = async ({ searchParams }: { searchParams: any }) => {
  const page = Number(searchParams.page) || 1; // Pegando a página atual ou padrão para 1
  const pageSize = 20; // Definindo quantos produtos por página

  // Contando o total de produtos para calcular a paginação
  const totalProducts = await prisma.product.count({
    where: {
      promotions: {
        some: {
          start_date: { lte: new Date() },
          end_date: { gte: new Date() },
        },
      },
    },
  });

  const totalPages = Math.ceil(totalProducts / pageSize); // Calculando o total de páginas

  // Buscando os produtos da página atual
  const productPromotions = await prisma.product.findMany({
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
      _count: true,
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
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  return (
    <div className="flex flex-col">
      <h2 className="text-center text-xl my-6">Ofertas - Promoções</h2>

      <div className="max-w-screen-xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {productPromotions.length > 0 ? (
          productPromotions.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p>Nenhuma oferta encontrada!</p>
        )}
      </div>

      {/* Passando os parâmetros para o Pagination */}
      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default OfertasPage;
