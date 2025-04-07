import { Prisma } from "@prisma/client";
import { OrderBump } from "../../domain/order-bump.entity";
import { Product } from "@/lib/actions/products";

export type OrderBumpPlainedObject = {
  id: number;
  productId: number;
  bumpProductId: number;
  bumpPrice: number;
  bumpProduct: Product;
  createdAt: Date;
  updatedAt: Date;
};

export class OrderBumpMapper {
  static toModel(entity: OrderBump): Prisma.order_bumpCreateInput {
    return {
      bump_price: entity.bumpPrice,
      product_id: entity.productId,
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
      productId: model.product_id,
      bumpProductId: model.bump_product.id,
      bumpPrice: model.bump_price,
      createdAt: new Date(model.created_at),
      updatedAt: new Date(model.updated_at),
    });
  }

  static toPlainObject(
    model: Prisma.order_bumpGetPayload<{ include: { bump_product: true } }>
  ): OrderBumpPlainedObject {
    return {
      id: model.id,
      productId: model.product_id,
      bumpProductId: model.bump_product.id,
      bumpPrice: model.bump_price,
      bumpProduct: model.bump_product,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    };
  }
}
