"use server";

import { prisma } from "@/lib/db/prisma";
import { OrderBump } from "../../domain/order-bump.entity";
import { OrderBumpMapper } from "../mappers/order-bump.mapper";
import { auth } from "@/lib/auth/auth";
import { SessionValidation } from "@/lib/actions/session-validation";

export type CreateOrderBumpInput = {
  productId: number;
  bumpProductId: number;
};

export const CreateOrderBump = async (data: CreateOrderBumpInput) => {
  const session = await auth();
  const validator = new SessionValidation(session);
  validator.IsSellerOrAdmin();

  const principalProduct = await prisma.product.findUnique({
    where: { id: data.productId },
    select: { id: true },
  });

  if (!principalProduct) {
    throw new Error("Produto principal não encontrado.");
  }

  const bumpProduct = await prisma.product.findUnique({
    where: { id: data.bumpProductId },
    select: { id: true },
  });

  if (!bumpProduct) {
    throw new Error("Produto do order bump não encontrado.");
  }

  const orderBump = new OrderBump(data);

  await prisma.order_bump.create({
    data: OrderBumpMapper.toModel(orderBump),
  });

  return { message: "Order bump adicionado ao produto com sucesso!" };
};
