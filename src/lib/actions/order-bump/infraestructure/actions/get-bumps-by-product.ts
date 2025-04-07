"use server";

import { prisma } from "@/lib/db/prisma";
import {
  OrderBumpMapper,
  OrderBumpPlainedObject,
} from "../mappers/order-bump.mapper";
import { OrderBump } from "../../domain/order-bump.entity";

export const GetBumpsByProductId = async (
  productId: number
): Promise<OrderBumpPlainedObject[]> => {
  const bumps = await prisma.order_bump.findMany({
    where: {
      product_id: productId,
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

  return bumps.map((b) => OrderBumpMapper.toPlainObject(b));
};
