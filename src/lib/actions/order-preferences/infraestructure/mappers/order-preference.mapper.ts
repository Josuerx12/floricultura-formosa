import { Prisma } from "@prisma/client";
import { OrderPreference } from "../../domain/entities/order-preference.entity";

export class OrderPreferenceMapper {
  static toModel(entity: OrderPreference): Prisma.order_preferencesCreateInput {
    return {
      id: entity.id,
      phone: entity.phone,
      from: entity.from,
      to: entity.to,
      message: entity.message,
      delivery_date: entity.deliveryDate,
      order: {
        connect: {
          id: entity.orderId,
        },
      },
    };
  }
  static toEntity(
    model: Prisma.order_preferencesGetPayload<{
      include: { order: true };
    }>
  ): OrderPreference {
    return new OrderPreference(model);
  }
}
