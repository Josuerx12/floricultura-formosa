"use server";

import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { DeliveryFeeSchema } from "@/lib/schemas-validator/delivery-fee.schema";
import { z } from "zod";
import { fromCents, toCents } from "@/lib/utils";

export type PaginationProps = {
  page?: number;
  perPage?: number;
  search?: string;
};
export async function CreateDeliveryFee(
  data: z.infer<typeof DeliveryFeeSchema>
) {
  await prisma.delivery_fee.create({
    data: {
      fee: toCents(data.fee),
      district: data.district,
    },
  });

  return {
    message: "Taxa de entrega cadastrada com sucesso!",
  };
}

export async function getDeliveryFees() {
  const deliveryFee = await prisma.delivery_fee.findMany();

  return deliveryFee.map((df) => ({ ...df, fee: fromCents(df.fee) }));
}

export async function GetAllDeliveryFeesWithPagination({
  page = 1,
  perPage = 10,
  search = "",
}: PaginationProps) {
  const where: Prisma.delivery_feeWhereInput = {
    OR: [
      {
        district: {
          contains: search,
          mode: "insensitive",
        },
      },
    ],
  };

  const totalItems = await prisma.delivery_fee.count({
    where,
  });

  const totalPages = Math.ceil(totalItems / perPage);

  const deliveryFees = await prisma.delivery_fee.findMany({
    where,
    take: perPage,
    skip: (page - 1) * perPage,
  });

  return {
    totalItems,
    totalPages,
    deliveryFees: deliveryFees.map((df) => ({
      ...df,
      fee: fromCents(df.fee),
    })),
  };
}
