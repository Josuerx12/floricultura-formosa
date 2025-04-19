import { Prisma } from "@prisma/client";
import { FlowerCare } from "../../domain/flower-care.entity";

export type FlowerCarePlainObject = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export class FlowerCareMapper {
  static toModel(entity: FlowerCare): Prisma.flower_careCreateInput {
    return {
      title: entity.title,
      description: entity.description,
      image_url: entity.imageUrl,
    };
  }

  static toEntity(model: Prisma.flower_careGetPayload<{}>): FlowerCare {
    return new FlowerCare({
      id: model.id,
      title: model.title,
      description: model.description,
      imageUrl: model.image_url,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    });
  }

  static toPlainObject(
    model: Prisma.flower_careGetPayload<{}>
  ): FlowerCarePlainObject {
    return {
      id: model.id,
      title: model.title,
      description: model.description,
      imageUrl: model.image_url,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    };
  }
}
