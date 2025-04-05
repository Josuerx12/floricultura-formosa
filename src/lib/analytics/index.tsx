"use server";

import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../db/prisma";

export async function getStatistcs() {
  const totalSales = await prisma.order.aggregate({
    _sum: {
      total_price: true,
      delivery_fee: true,
    },
    _count: {
      id: true,
    },

    where: { NOT: [{ status: "CANCELED" }, { status: "PENDING" }] },
  });

  const usersCount = await prisma.user.count();

  const salesByMonth = await prisma.$queryRaw<
    { month: string; totalSalesAmount: Decimal; averageSaleAmount: Decimal }[]
  >`
    SELECT 
      TO_CHAR("createdAt", 'YYYY-MM') AS month,  -- Formato YYYY-MM
      SUM("total_price") AS "totalSalesAmount",
      AVG("total_price") AS "averageSaleAmount"
    FROM "order"
    WHERE status != 'CANCELED'
    GROUP BY month
    ORDER BY month ASC;
  `;

  const lastSales = await prisma.order.findMany({
    where: { NOT: [{ status: "CANCELED" }, { status: "PENDING" }] },
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  });

  return {
    totalSalesAmount: totalSales._sum.total_price?.toNumber(),
    totalSales: totalSales._count.id,
    totalFreightAmount: totalSales._sum.delivery_fee?.toNumber(),
    usersCount,
    salesByMonth: salesByMonth.map((s) => ({
      averageSaleAmount: s.averageSaleAmount.toNumber(),
      totalSalesAmount: s.totalSalesAmount.toNumber(),
      month: s.month,
    })),
    lastSales: lastSales.map((ls) => ({
      ...ls,
      total_price: ls.total_price.toNumber(),
      delivery_fee: ls.total_price.toNumber(),
    })),
  };
}
