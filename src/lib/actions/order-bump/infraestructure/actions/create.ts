"use server";

import { prisma } from "@/lib/db/prisma";
import { OrderBump } from "../../domain/order-bump.entity";
import { OrderBumpMapper } from "../mappers/order-bump.mapper";
import { auth } from "@/lib/auth/auth";
import { SessionValidation } from "@/lib/actions/session-validation";

export type CreateOrderBumpInput = {
  categoryId: number;
  bumpProductId: number;
};

export const CreateOrderBump = async (data: CreateOrderBumpInput) => {
  const session = await auth();
  const validator = new SessionValidation(session);
  validator.IsSellerOrAdmin();

  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
    select: { id: true },
  });

  if (!category) {
    throw new Error("Categoria não encontrada.");
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
