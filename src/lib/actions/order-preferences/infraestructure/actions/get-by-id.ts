import { prisma } from "@/lib/db/prisma";
import { OrderPreference } from "../../domain/entities/order-preference.entity";
import { OrderPreferenceMapper } from "../mappers/order-preference.mapper";
import { auth } from "@/lib/auth/auth";
import { SessionValidation } from "@/lib/actions/session-validation";

export async function getOrderPreferenceById(
  id: string
): Promise<OrderPreference> {
  const session = await auth();
  new SessionValidation(session);

  const orderPreference = await prisma.order_preferences.findUnique({
    where: { id },
    include: { order: true },
  });

  if (!orderPreference) {
    throw new Error(
      "Preferencia do pedido não encontrada para o id informado."
    );
  }

  return OrderPreferenceMapper.toEntity(orderPreference);
}
