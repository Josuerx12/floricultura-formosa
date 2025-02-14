import { ProductCard } from "@/components/cards/product-card";
import { prisma } from "@/lib/db/prisma";
import React from "react";

const OfertasPage = async () => {
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
  return (
    <div>
      <h2 className="text-center text-xl  my-6">Ofertas - Promoções</h2>

      <div className="flex gap-5 justify-between p-2">
        {productPromotions.length > 0 ? (
          productPromotions.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p>Nenhuma oferta encontrada!</p>
        )}
      </div>
    </div>
  );
};

export default OfertasPage;
