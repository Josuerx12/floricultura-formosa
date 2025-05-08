"use server";

import { prisma } from "@/lib/db/prisma";
import {
  OrderBumpMapper,
  OrderBumpPlainedObject,
} from "../mappers/order-bump.mapper";

export const GetBumpsByCategoryId = async (
  categoryId: number
): Promise<OrderBumpPlainedObject[]> => {
  const bumps = await prisma.order_bump.findMany({
    where: {
      category_id: categoryId,
    },
    include: {
      bump_product: {
        include: {
          product_images: {
            select: {
              url: true,
            },
          },
        },
      },
    },
  });

  return bumps?.map((b) => OrderBumpMapper.toPlainObject(b));
};
