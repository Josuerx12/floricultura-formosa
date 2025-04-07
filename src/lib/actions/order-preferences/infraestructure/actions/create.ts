"use server";

import { prisma } from "@/lib/db/prisma";
import { OrderPreference } from "../../domain/entities/order-preference.entity";
import { OrderPreferenceMapper } from "../mappers/order-preference.mapper";
import { auth } from "@/lib/auth/auth";
import { SessionValidation } from "@/lib/actions/session-validation";

export type CreateOrderInput = {
  order_id: string;
  phone: string;
  from?: string;
  to?: string;
  message?: string;
};

export const CreateOrderPreference = async (data: CreateOrderInput) => {
  const session = await auth();
  new SessionValidation(session);

  const order = prisma.order.findUnique({
    where: {
      id: data.order_id,
    },
    select: { id: true },
  });

  if (!order) {
    throw new Error("Pedido não encontrado.");
  }

  const orderPreference = new OrderPreference(data);

  await prisma.order_preferences.create({
    data: OrderPreferenceMapper.toModel(orderPreference),
  });
};
