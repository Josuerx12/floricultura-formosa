"use server";

import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { DeliveryFeeSchema } from "@/lib/schemas-validator/delivery-fee.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
      fee: parseFloat(data.fee.replace(/\./g, "").replace(",", ".")),
      district: data.district,
    },
  });

  return {
    message: "Taxa de entrega cadastrada com sucesso!",
  };
}

export async function getDeliveryFees() {
  const deliveryFee = await prisma.delivery_fee.findMany();

  return deliveryFee;
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
      id: df.id,
      district: df.district,
      fee: df.fee.toNumber(),
    })),
  };
}
