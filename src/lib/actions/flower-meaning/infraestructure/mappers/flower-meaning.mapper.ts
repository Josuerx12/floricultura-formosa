import { Prisma } from "@prisma/client";
import { FlowerMeaning } from "../../domain/flower-meaning.entity";

export type FlowerMeaningPlainObject = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export class FlowerMeaningMapper {
  static toModel(entity: FlowerMeaning): Prisma.flower_meaningCreateInput {
    return {
      name: entity.name,
      description: entity.description,
      image_url: entity.imageUrl,
    };
  }

  static toEntity(model: Prisma.flower_meaningGetPayload<{}>): FlowerMeaning {
    return new FlowerMeaning({
      id: model.id,
      name: model.name,
      description: model.description,
      imageUrl: model.image_url,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    });
  }

  static toPlainObject(
    model: Prisma.flower_meaningGetPayload<{}>
  ): FlowerMeaningPlainObject {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      imageUrl: model.image_url,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    };
  }
}
