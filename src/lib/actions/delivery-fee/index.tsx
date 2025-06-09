"use server";

import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import {
  DeliveryFeeSchema,
  DeliveryFeeType,
} from "@/lib/schemas-validator/delivery-fee.schema";
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

export async function DeleteDeliveryFee(id: string) {
  await prisma.delivery_fee.delete({
    where: {
      id,
    },
  });
}

export async function EditDeliveryFee(data: DeliveryFeeType) {
  console.log(data);
  const deliveryFee = await prisma.delivery_fee.findUnique({
    where: {
      id: data!.id,
    },
  });

  if (!deliveryFee) {
    throw new Error(
      "Taxa de entrega não encontrada, atualize a pagina e tente novamente."
    );
  }

  if (data.district) {
    deliveryFee.district = data.district;
  }

  if (data.fee) {
    deliveryFee.fee = toCents(data.fee);
  }

  await prisma.delivery_fee.update({
    where: {
      id: deliveryFee.id,
    },
    data: deliveryFee,
  });

  return {
    message: "Taxa de entrega atualizada com sucesso!",
  };
}
