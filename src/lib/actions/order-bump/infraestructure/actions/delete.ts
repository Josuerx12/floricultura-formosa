"use server";

import { SessionValidation } from "@/lib/actions/session-validation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { UserRoles } from "@prisma/client";

export const DeleteOrderBump = async (id: number) => {
  const session = await auth();
  const validator = new SessionValidation(session);
  validator.IsSellerOrAdmin();

  const orderBump = await prisma.order_bump.delete({
    where: { id },
  });

  if (!orderBump) {
    throw new Error("Order bump não encontrado.");
  }

  return { message: "Order bump removido com sucesso!" };
};
