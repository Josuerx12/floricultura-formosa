"use server";

import { prisma } from "@/lib/db/prisma";
import { DeliveryFeeSchema } from "@/lib/schemas-validator/delivery-fee.schema";
import { revalidatePath } from "next/cache";

export async function CreateDeliveryFee(data: any) {
  try {
    const deliveryFee = DeliveryFeeSchema.parse(data);

    await prisma.delivery_fee.create({ data: deliveryFee });

    revalidatePath("/dashboard/taxas-de-entrega");
  } catch (error) {
    console.error("Erro ao criar taxa de entrega:", error);
    throw new Error("Erro ao criar taxa de entrega!");
  }
}

export async function getDeliveryFees() {
  const deliveryFee = await prisma.delivery_fee.findMany();

  return deliveryFee;
}
