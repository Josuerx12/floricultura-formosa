import { Prisma } from "@prisma/client";
import { OrderBump } from "../../domain/order-bump.entity";
import { Product } from "@/lib/actions/products";
import { fromCents } from "@/lib/utils";

export type OrderBumpPlainedObject = {
  id: number;
  categoryId: number;
  bumpProductId: number;
  bumpProduct: Product;
  createdAt: Date;
  updatedAt: Date;
};

export class OrderBumpMapper {
  static toModel(entity: OrderBump): Prisma.order_bumpCreateInput {
    return {
      category_id: entity.categoryId,
      bump_product: {
        connect: {
          id: entity.bumpProductId,
        },
      },
    };
  }

  static toEntity(
    model: Prisma.order_bumpGetPayload<{ include: { bump_product: true } }>
  ) {
    return new OrderBump({
      id: model.id,
      categoryId: model.category_id,
      bumpProductId: model.bump_product.id,
      createdAt: new Date(model.created_at),
      updatedAt: new Date(model.updated_at),
    });
  }

  static toPlainObject(
    model: Prisma.order_bumpGetPayload<{ include: { bump_product: true } }>
  ): OrderBumpPlainedObject {
    return {
      id: model.id,
      categoryId: model.category_id,
      bumpProductId: model.bump_product.id,
      bumpProduct: {
        ...model.bump_product,
        price: fromCents(model.bump_product.price),
      },
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    };
  }
}
